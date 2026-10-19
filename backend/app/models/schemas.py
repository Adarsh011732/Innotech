from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date, datetime

class TransactionBase(BaseModel):
    account_id: str
    date: date
    description: str
    amount: float
    tx_type: str
    category: str
    confidence: float = 1.0
    needs_review: bool = False
    is_recurring: bool = False
    is_user_overridden: bool = False

class TransactionOut(TransactionBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionOverrideReq(BaseModel):
    transaction_id: str
    new_category: str
    apply_to_future: bool = True

class AccountOut(BaseModel):
    id: str
    name: str
    account_type: str
    balance: float
    currency: str

    class Config:
        from_attributes = True

class AccountsSummaryOut(BaseModel):
    total_liquid_cash: float
    total_debt: float
    net_worth: float
    accounts: List[AccountOut]

class ForecastPoint(BaseModel):
    date: str
    median_balance: float
    lower_bound_90: float
    upper_bound_90: float
    projected_net_cashflow: float

class ForecastResponse(BaseModel):
    horizon_days: int
    current_liquid_balance: float
    methodology: str
    coverage_level: str
    trajectory: List[ForecastPoint]
    historical_burn_rate_daily: float

class StressRiskResponse(BaseModel):
    solvency_score: float  # 0 to 100 (100 = very safe, 0 = critical risk)
    risk_level: str        # "Low", "Moderate", "High", "Critical", or "Abstain"
    is_abstaining: bool
    abstention_reason: Optional[str] = None
    liquidity_buffer_days: float
    debt_to_income_ratio: float
    discretionary_burn_ratio: float
    top_risk_factors: List[Dict[str, Any]]
    model_calibration: str

class GoalCreate(BaseModel):
    title: str
    target_amount: float
    current_amount: float = 0.0
    deadline: date
    category: str = "Emergency Fund"

class GoalOut(GoalCreate):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RecourseChange(BaseModel):
    category: str
    current_monthly_spend: float
    recommended_monthly_spend: float
    delta_monthly: float
    is_immutable: bool = False

class RecourseProfile(BaseModel):
    profile_id: str
    title: str
    feasibility_probability: float
    description: str
    proposed_changes: List[RecourseChange]
    revised_deadline: Optional[str] = None
    expected_surplus_or_shortfall: float

class GoalEvaluationResponse(BaseModel):
    goal_id: str
    title: str
    target_amount: float
    current_amount: float
    deadline: str
    months_remaining: float
    deterministic_monthly_required: float
    probabilistic_feasibility: float
    shortfall_at_risk_90: float
    is_feasible: bool
    recourse_profiles: List[RecourseProfile]

class WhatIfSimulationReq(BaseModel):
    goal_id: Optional[str] = None
    spending_adjustments: Dict[str, float] = {}  # category -> percentage change (e.g. -20 for -20%)
    one_off_shock_amount: float = 0.0            # e.g. 500 for emergency expense
    monthly_income_delta: float = 0.0

class WhatIfSimulationResponse(BaseModel):
    original_feasibility: float
    simulated_feasibility: float
    original_liquidity_days: float
    simulated_liquidity_days: float
    monthly_discretionary_before: float
    monthly_discretionary_after: float
    status_summary: str

class StabilityMetricOut(BaseModel):
    explainer_name: str
    kendall_tau_rank_correlation: float
    spearman_rho: float
    relative_input_stability: float
    stability_assessment: str

class StabilityBenchmarkResponse(BaseModel):
    noise_level_pct: float
    tested_instances: int
    metrics: List[StabilityMetricOut]
    summary_verdict: str
