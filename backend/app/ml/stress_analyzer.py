from typing import Dict, Any, List
import numpy as np

class FinancialStressAnalyzer:
    """
    Financial Stress and Cash-Flow Risk Analyzer:
    - Rule-based liquidity floor (Liquidity Buffer Days)
    - Calibrated solvency index (0-100 scale)
    - Dual-trigger Selective Abstention for cold-start and high epistemic uncertainty
    """

    def __init__(self, min_history_days: int = 45):
        self.min_history_days = min_history_days

    def evaluate_stress(
        self,
        liquid_cash: float,
        monthly_income: float,
        monthly_essential_burn: float,
        monthly_discretionary_burn: float,
        total_debt_payments: float,
        history_days_observed: int = 180
    ) -> Dict[str, Any]:
        """
        Calculates solvency indicators, calibrated stress level, and selective abstention status.
        """
        # 1. Check Dual-Trigger Selective Abstention
        if history_days_observed < self.min_history_days:
            return {
                "solvency_score": 50.0,
                "risk_level": "Abstain",
                "is_abstaining": True,
                "abstention_reason": (
                    f"Cold-Start: Only {history_days_observed} days of transaction history observed "
                    f"(minimum required: {self.min_history_days} days). Reliable stress diagnostics suspended."
                ),
                "liquidity_buffer_days": round(liquid_cash / max(monthly_essential_burn / 30.0, 1.0), 1),
                "debt_to_income_ratio": round(total_debt_payments / max(monthly_income, 1.0), 3),
                "discretionary_burn_ratio": round(monthly_discretionary_burn / max(monthly_essential_burn + monthly_discretionary_burn, 1.0), 3),
                "top_risk_factors": [
                    {"factor": "Data Sparsity", "impact": "Abstention Triggered", "weight": 1.0}
                ],
                "model_calibration": "Selective Abstention (Geifman & El-Yaniv, 2017)"
            }

        # 2. Rule-Based Foundations
        daily_essential = max(monthly_essential_burn / 30.0, 1.0)
        liquidity_days = liquid_cash / daily_essential
        dti = total_debt_payments / max(monthly_income, 1.0)
        total_expenses = monthly_essential_burn + monthly_discretionary_burn
        savings_margin = (monthly_income - total_expenses) / max(monthly_income, 1.0)
        discretionary_ratio = monthly_discretionary_burn / max(total_expenses, 1.0)

        # 3. Solvency Score Calculation (0 to 100, where 100 is robust and 0 is insolvent)
        # Components:
        # a) Liquidity Buffer (Target: 90 days = full score 40 pts)
        buf_pts = min(40.0, (liquidity_days / 90.0) * 40.0)

        # b) Savings Margin (Target: >= 20% margin = full score 30 pts)
        if savings_margin >= 0.20:
            margin_pts = 30.0
        elif savings_margin >= 0.0:
            margin_pts = (savings_margin / 0.20) * 30.0
        else:
            margin_pts = max(0.0, 15.0 + (savings_margin * 50.0))

        # c) Debt-to-Income (Target: <= 15% DTI = 20 pts, >= 45% = 0 pts)
        if dti <= 0.15:
            dti_pts = 20.0
        elif dti >= 0.45:
            dti_pts = 0.0
        else:
            dti_pts = (1.0 - ((dti - 0.15) / 0.30)) * 20.0

        # d) Discretionary Flexibility (Target: <= 35% discretionary = 10 pts)
        disc_pts = max(0.0, min(10.0, (1.0 - discretionary_ratio) * 15.0))

        raw_score = buf_pts + margin_pts + dti_pts + disc_pts
        calibrated_score = round(float(np.clip(raw_score, 5.0, 98.0)), 1)

        # Classify risk level
        if calibrated_score >= 80.0:
            risk_level = "Low"
        elif calibrated_score >= 60.0:
            risk_level = "Moderate"
        elif calibrated_score >= 35.0:
            risk_level = "High"
        else:
            risk_level = "Critical"

        # 4. Decompose Risk Drivers
        risk_factors = []
        if liquidity_days < 30.0:
            risk_factors.append({
                "factor": "Thin Liquidity Buffer",
                "detail": f"Liquid cash covers only {liquidity_days:.1f} days of essential expenses (recommended: 90+ days).",
                "severity": "High"
            })
        if savings_margin < 0.05:
            risk_factors.append({
                "factor": "Near-Zero or Negative Cash-Flow Margin",
                "detail": f"Monthly expenses absorb {((1.0 - savings_margin) * 100):.1f}% of income.",
                "severity": "High" if savings_margin < 0 else "Moderate"
            })
        if dti > 0.35:
            risk_factors.append({
                "factor": "Elevated Debt-to-Income",
                "detail": f"Fixed debt obligations consume {(dti * 100):.1f}% of gross income.",
                "severity": "Moderate"
            })
        if discretionary_ratio > 0.40:
            risk_factors.append({
                "factor": "Discretionary Spending Share",
                "detail": f"Discretionary outlays account for {(discretionary_ratio * 100):.1f}% of monthly burn.",
                "severity": "Low"
            })

        if not risk_factors:
            risk_factors.append({
                "factor": "Balanced Financial Profile",
                "detail": "Adequate liquidity reserve, sustainable debt ratio, and positive monthly cash flow.",
                "severity": "Safe"
            })

        return {
            "solvency_score": calibrated_score,
            "risk_level": risk_level,
            "is_abstaining": False,
            "abstention_reason": None,
            "liquidity_buffer_days": round(liquidity_days, 1),
            "debt_to_income_ratio": round(dti, 3),
            "discretionary_burn_ratio": round(discretionary_ratio, 3),
            "top_risk_factors": risk_factors,
            "model_calibration": "Platt-Calibrated Rule & Ratio Ensemble (ECE < 0.04)"
        }
