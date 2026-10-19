import os
from pathlib import Path
from datetime import date, timedelta
from typing import List, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np

from backend.app.config import APP_TITLE, APP_VERSION, BASE_DIR
from backend.app.database import engine, Base, get_db, SessionLocal
from backend.app.models.db_models import Account, Transaction, CategoryOverride, Goal
from backend.app.models.schemas import (
    TransactionOut, TransactionOverrideReq, AccountsSummaryOut,
    ForecastResponse, ForecastPoint, StressRiskResponse,
    GoalCreate, GoalOut, GoalEvaluationResponse,
    WhatIfSimulationReq, WhatIfSimulationResponse,
    StabilityBenchmarkResponse
)
from backend.app.data.simfin_engine import SimFinEngine
from backend.app.ml.categorizer import ExpenseCategorizer
from backend.app.ml.forecaster import ConformalCashFlowForecaster
from backend.app.ml.stress_analyzer import FinancialStressAnalyzer
from backend.app.ml.goal_simulator import GoalFeasibilityEngine
from backend.app.ml.recourse_optimizer import ConstrainedFinancialRecourseOptimizer
from backend.app.ml.xai_stability import ExplanationStabilityTester

# Global ML instances
categorizer = ExpenseCategorizer(confidence_threshold=0.70)
forecaster = ConformalCashFlowForecaster(alpha=0.10)
stress_analyzer = FinancialStressAnalyzer(min_history_days=45)
goal_engine = GoalFeasibilityEngine(num_simulations=5000)
recourse_optimizer = ConstrainedFinancialRecourseOptimizer()
stability_tester = ExplanationStabilityTester()

def seed_database_if_empty(db: Session, persona: str = "salaried"):
    """Seeds database with realistic transaction records if empty."""
    tx_count = db.query(Transaction).count()
    if tx_count == 0:
        seed_persona_data(db, persona)

def seed_persona_data(db: Session, persona: str = "salaried"):
    # Clear existing
    db.query(Transaction).delete()
    db.query(Account).delete()
    db.query(Goal).delete()
    db.commit()

    seed_data = SimFinEngine.generate_persona_data(persona=persona, days_history=180)

    for acc in seed_data["accounts"]:
        db.add(Account(
            id=acc["id"],
            name=acc["name"],
            account_type=acc["account_type"],
            balance=acc["balance"]
        ))

    for g in seed_data["goals"]:
        db.add(Goal(
            id=g["id"],
            title=g["title"],
            target_amount=g["target_amount"],
            current_amount=g["current_amount"],
            deadline=g["deadline"],
            category=g["category"]
        ))

    for tx in seed_data["transactions"]:
        db.add(Transaction(
            id=tx["id"],
            account_id=tx["account_id"],
            date=tx["date"],
            description=tx["description"],
            amount=tx["amount"],
            tx_type=tx["tx_type"],
            category=tx["category"],
            confidence=tx["confidence"],
            needs_review=tx["needs_review"],
            is_recurring=tx["is_recurring"],
            is_user_overridden=tx["is_user_overridden"]
        ))

    db.commit()
    retrain_ml_models(db)

def retrain_ml_models(db: Session):
    """Trains categorizer and fits conformal forecaster on local database records."""
    txs = db.query(Transaction).all()
    if not txs:
        return

    # Train categorizer
    train_pairs = [(t.description, t.category) for t in txs]
    categorizer.train(train_pairs)

    # Load user overrides into categorizer
    overrides = db.query(CategoryOverride).all()
    for ov in overrides:
        categorizer.add_user_override(ov.merchant_pattern, ov.assigned_category)

    # Fit Conformal Forecaster
    daily_records = []
    for t in txs:
        net = t.amount if t.tx_type == "credit" else -t.amount
        daily_records.append({"date": t.date, "net_cashflow": net})

    df = pd.DataFrame(daily_records)
    if not df.empty:
        df_daily = df.groupby("date")["net_cashflow"].sum().reset_index().sort_values("date")
        forecaster.fit_and_calibrate(df_daily)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite schema
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_database_if_empty(db, "salaried")
    yield

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to get aggregate metrics
def get_user_financial_profile(db: Session) -> Dict[str, Any]:
    accounts = db.query(Account).all()
    liquid_cash = sum(a.balance for a in accounts if a.account_type in ["checking", "savings"])
    total_debt = sum(a.balance for a in accounts if a.account_type in ["credit_card", "loan"])

    # Analyze last 90 days of transactions
    since_date = date.today() - timedelta(days=90)
    txs = db.query(Transaction).filter(Transaction.date >= since_date).all()

    inflows = sum(t.amount for t in txs if t.tx_type == "credit")
    monthly_income = (inflows / 90.0) * 30.0 if inflows > 0 else 5500.0

    essential_cats = {"Housing & Rent", "Utilities", "Groceries", "Debt & Loans", "Healthcare", "Transportation"}
    essential_out = sum(t.amount for t in txs if t.tx_type == "debit" and t.category in essential_cats)
    monthly_essential = (essential_out / 90.0) * 30.0

    disc_out = sum(t.amount for t in txs if t.tx_type == "debit" and t.category not in essential_cats)
    monthly_discretionary = (disc_out / 90.0) * 30.0

    debt_pmts = sum(t.amount for t in txs if t.tx_type == "debit" and t.category == "Debt & Loans")
    monthly_debt = (debt_pmts / 90.0) * 30.0

    # Monthly breakdown by category
    cat_averages = {}
    for cat in categorizer.CANONICAL_RULES.values():
        if cat != "Income & Salary":
            spend = sum(t.amount for t in txs if t.tx_type == "debit" and t.category == cat)
            cat_averages[cat] = round((spend / 90.0) * 30.0, 2)

    earliest_tx = db.query(Transaction).order_by(Transaction.date.asc()).first()
    history_days = (date.today() - earliest_tx.date).days if earliest_tx else 0

    return {
        "liquid_cash": liquid_cash,
        "total_debt": total_debt,
        "monthly_income": monthly_income,
        "monthly_essential": monthly_essential,
        "monthly_discretionary": monthly_discretionary,
        "monthly_debt": monthly_debt,
        "category_averages": cat_averages,
        "history_days": history_days
    }

# ----------------------------------------------------
# REST API ROUTES
# ----------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "app": APP_TITLE,
        "privacy_mode": "Zero-Knowledge Local-First",
        "cloud_telemetry": False
    }

@app.get("/api/accounts/summary", response_model=AccountsSummaryOut)
def get_accounts_summary(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    liquid_cash = sum(a.balance for a in accounts if a.account_type in ["checking", "savings"])
    total_debt = sum(a.balance for a in accounts if a.account_type in ["credit_card", "loan"])
    net_worth = liquid_cash - total_debt

    return {
        "total_liquid_cash": round(liquid_cash, 2),
        "total_debt": round(total_debt, 2),
        "net_worth": round(net_worth, 2),
        "accounts": accounts
    }

@app.get("/api/transactions")
def get_transactions(
    limit: int = 100,
    category: str = None,
    needs_review: bool = None,
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).order_by(Transaction.date.desc())
    if category:
        query = query.filter(Transaction.category == category)
    if needs_review is not None:
        query = query.filter(Transaction.needs_review == needs_review)

    total_count = query.count()
    items = query.limit(limit).all()

    return {
        "total_count": total_count,
        "transactions": items
    }

@app.post("/api/transactions/override")
def override_transaction_category(req: TransactionOverrideReq, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == req.transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    old_cat = tx.category
    tx.category = req.new_category
    tx.confidence = 1.0
    tx.needs_review = False
    tx.is_user_overridden = True

    if req.apply_to_future:
        cleaned_pattern = categorizer.clean_text(tx.description)
        # Store in DB
        existing = db.query(CategoryOverride).filter(CategoryOverride.merchant_pattern == cleaned_pattern).first()
        if existing:
            existing.assigned_category = req.new_category
        else:
            db.add(CategoryOverride(merchant_pattern=cleaned_pattern, assigned_category=req.new_category))

        categorizer.add_user_override(cleaned_pattern, req.new_category)

    db.commit()
    return {
        "status": "success",
        "transaction_id": tx.id,
        "old_category": old_cat,
        "new_category": tx.category,
        "override_cached": req.apply_to_future
    }

@app.post("/api/data/seed/{persona}")
def seed_data(persona: str, db: Session = Depends(get_db)):
    if persona not in ["salaried", "freelancer", "student"]:
        raise HTTPException(status_code=400, detail="Persona must be 'salaried', 'freelancer', or 'student'")
    seed_persona_data(db, persona)
    return {"status": "success", "persona": persona, "message": f"Successfully loaded {persona} persona profile."}

@app.get("/api/forecast/cashflow", response_model=ForecastResponse)
def get_cashflow_forecast(horizon_days: int = 60, db: Session = Depends(get_db)):
    profile = get_user_financial_profile(db)
    trajectory = forecaster.forecast_trajectory(
        current_liquid_balance=profile["liquid_cash"],
        horizon_days=horizon_days,
        start_date=date.today()
    )

    points = [ForecastPoint(**p) for p in trajectory]
    return {
        "horizon_days": horizon_days,
        "current_liquid_balance": profile["liquid_cash"],
        "methodology": "Conformalized Quantile Regression (CQR)",
        "coverage_level": "90% Distribution-Free Prediction Band",
        "trajectory": points,
        "historical_burn_rate_daily": round(forecaster.daily_historical_burn, 2)
    }

@app.get("/api/risk/stress", response_model=StressRiskResponse)
def get_financial_stress(db: Session = Depends(get_db)):
    profile = get_user_financial_profile(db)
    result = stress_analyzer.evaluate_stress(
        liquid_cash=profile["liquid_cash"],
        monthly_income=profile["monthly_income"],
        monthly_essential_burn=profile["monthly_essential"],
        monthly_discretionary_burn=profile["monthly_discretionary"],
        total_debt_payments=profile["monthly_debt"],
        history_days_observed=profile["history_days"]
    )
    return result

@app.get("/api/goals")
def list_goals(db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.is_active == True).all()

@app.post("/api/goals", response_model=GoalOut)
def create_goal(goal_in: GoalCreate, db: Session = Depends(get_db)):
    goal_id = f"goal_{date.today().strftime('%Y%m%d')}_{np.random.randint(1000, 9999)}"
    db_goal = Goal(
        id=goal_id,
        title=goal_in.title,
        target_amount=goal_in.target_amount,
        current_amount=goal_in.current_amount,
        deadline=goal_in.deadline,
        category=goal_in.category
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.get("/api/goals/{goal_id}/evaluate", response_model=GoalEvaluationResponse)
def evaluate_goal(goal_id: str, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    profile = get_user_financial_profile(db)

    # Monthly discretionary samples
    disc_monthly = [profile["monthly_discretionary"] * factor for factor in [0.85, 0.95, 1.05, 1.15, 1.0]]
    eval_res = goal_engine.evaluate_goal(
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        deadline=goal.deadline,
        monthly_income=profile["monthly_income"],
        monthly_essential_burn=profile["monthly_essential"],
        historical_monthly_discretionary=disc_monthly
    )

    recourse_profiles = recourse_optimizer.generate_recourse_profiles(
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        deadline=goal.deadline,
        monthly_income=profile["monthly_income"],
        monthly_essential_burn=profile["monthly_essential"],
        category_monthly_averages=profile["category_averages"]
    )

    return {
        "goal_id": goal.id,
        "title": goal.title,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "deadline": goal.deadline.isoformat(),
        "months_remaining": eval_res["months_remaining"],
        "deterministic_monthly_required": eval_res["deterministic_monthly_required"],
        "probabilistic_feasibility": eval_res["probabilistic_feasibility"],
        "shortfall_at_risk_90": eval_res["shortfall_at_risk_90"],
        "is_feasible": eval_res["is_feasible"],
        "recourse_profiles": recourse_profiles
    }

@app.post("/api/simulate/whatif", response_model=WhatIfSimulationResponse)
def simulate_whatif(req: WhatIfSimulationReq, db: Session = Depends(get_db)):
    profile = get_user_financial_profile(db)

    base_income = profile["monthly_income"]
    base_essential = profile["monthly_essential"]
    base_discretionary = profile["monthly_discretionary"]
    base_liquid = profile["liquid_cash"]

    # Apply adjustments
    new_discretionary = base_discretionary
    for cat, pct_change in req.spending_adjustments.items():
        if cat in profile["category_averages"]:
            cat_spend = profile["category_averages"][cat]
            delta = cat_spend * (pct_change / 100.0)
            new_discretionary += delta

    new_discretionary = max(100.0, new_discretionary)
    new_income = base_income + req.monthly_income_delta
    new_liquid = max(0.0, base_liquid - req.one_off_shock_amount)

    # Base feasibility
    base_margin = base_income - base_essential - base_discretionary
    sim_margin = new_income - base_essential - new_discretionary

    orig_feasibility = float(np.clip(0.50 + (base_margin / 2000.0), 0.10, 0.98))
    sim_feasibility = float(np.clip(0.50 + (sim_margin / 2000.0), 0.05, 0.99))

    daily_ess = max(base_essential / 30.0, 1.0)
    orig_liquidity_days = base_liquid / daily_ess
    sim_liquidity_days = new_liquid / daily_ess

    status = (
        f"Spending adjustment of {new_discretionary - base_discretionary:+.2f}/mo "
        f"and shock of ${req.one_off_shock_amount:.2f} results in "
        f"{sim_feasibility * 100:.1f}% goal feasibility (vs {orig_feasibility * 100:.1f}% baseline)."
    )

    return {
        "original_feasibility": round(orig_feasibility, 3),
        "simulated_feasibility": round(sim_feasibility, 3),
        "original_liquidity_days": round(orig_liquidity_days, 1),
        "simulated_liquidity_days": round(sim_liquidity_days, 1),
        "monthly_discretionary_before": round(base_discretionary, 2),
        "monthly_discretionary_after": round(new_discretionary, 2),
        "status_summary": status
    }

@app.get("/api/xai/stress-attributions")
def get_shap_attributions(db: Session = Depends(get_db)):
    profile = get_user_financial_profile(db)
    daily_ess = max(profile["monthly_essential"] / 30.0, 1.0)
    feat_dict = {
        "liquidity_days": profile["liquid_cash"] / daily_ess,
        "savings_margin": (profile["monthly_income"] - profile["monthly_essential"] - profile["monthly_discretionary"]) / max(profile["monthly_income"], 1.0),
        "dti": profile["monthly_debt"] / max(profile["monthly_income"], 1.0),
        "discretionary_ratio": profile["monthly_discretionary"] / max(profile["monthly_essential"] + profile["monthly_discretionary"], 1.0),
        "inflow": profile["monthly_income"],
        "burn": profile["monthly_essential"] + profile["monthly_discretionary"]
    }
    shap_vals = stability_tester.compute_shap_attributions(feat_dict)
    return {
        "method": "TreeSHAP Local Attribution",
        "features": feat_dict,
        "attributions": shap_vals
    }

@app.post("/api/xai/stability-test", response_model=StabilityBenchmarkResponse)
def run_stability_benchmark(noise_pct: float = Query(5.0, ge=1.0, le=25.0), db: Session = Depends(get_db)):
    profile = get_user_financial_profile(db)
    daily_ess = max(profile["monthly_essential"] / 30.0, 1.0)
    feat_dict = {
        "liquidity_days": profile["liquid_cash"] / daily_ess,
        "savings_margin": (profile["monthly_income"] - profile["monthly_essential"] - profile["monthly_discretionary"]) / max(profile["monthly_income"], 1.0),
        "dti": profile["monthly_debt"] / max(profile["monthly_income"], 1.0),
        "discretionary_ratio": profile["monthly_discretionary"] / max(profile["monthly_essential"] + profile["monthly_discretionary"], 1.0),
        "inflow": profile["monthly_income"],
        "burn": profile["monthly_essential"] + profile["monthly_discretionary"]
    }

    result = stability_tester.run_perturbation_stability_test(
        base_features=feat_dict,
        noise_level=noise_pct / 100.0,
        num_trials=20
    )
    return result

# ----------------------------------------------------
# FRONTEND SPA & STATIC ASSETS
# ----------------------------------------------------
frontend_dist = BASE_DIR / "frontend" / "dist"
if frontend_dist.exists():
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/")
    def serve_frontend_root():
        return FileResponse(frontend_dist / "index.html")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
