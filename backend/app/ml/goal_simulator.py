from datetime import date
from typing import Dict, Any, List
import numpy as np

class GoalFeasibilityEngine:
    """
    GoalFeasibilityEngine:
    - Deterministic arithmetic baseline
    - Non-parametric Bootstrap Monte Carlo simulator modeling stochastic discretionary spending
    - Computes empirical feasibility probability P(Goal Met) and Shortfall Value-at-Risk (VaR-90)
    """

    def __init__(self, num_simulations: int = 5000):
        self.num_simulations = num_simulations

    def evaluate_goal(
        self,
        target_amount: float,
        current_amount: float,
        deadline: date,
        monthly_income: float,
        monthly_essential_burn: float,
        historical_monthly_discretionary: List[float] = None,
        as_of_date: date = None
    ) -> Dict[str, Any]:
        if as_of_date is None:
            as_of_date = date.today()

        days_remaining = max(1, (deadline - as_of_date).days)
        months_remaining = max(0.1, days_remaining / 30.4375)

        amount_needed = max(0.0, target_amount - current_amount)
        deterministic_monthly_required = amount_needed / months_remaining

        # Fallback discretionary distribution if insufficient history
        if not historical_monthly_discretionary or len(historical_monthly_discretionary) < 2:
            historical_monthly_discretionary = [800.0, 950.0, 1100.0, 1250.0, 900.0]

        disc_array = np.array(historical_monthly_discretionary, dtype=float)

        # Monte Carlo Bootstrap Simulation
        # Simulate N paths of monthly savings over ceiling(months_remaining)
        m_steps = int(np.ceil(months_remaining))
        simulated_shortfalls = []
        success_count = 0

        # Sample with replacement from historical discretionary spending
        np.random.seed(42)
        bootstrap_discretionary = np.random.choice(
            disc_array,
            size=(self.num_simulations, m_steps),
            replace=True
        )

        # Monthly net savings in each path
        monthly_savings_paths = monthly_income - monthly_essential_burn - bootstrap_discretionary
        # Total savings accumulated across horizon
        cumulative_saved = current_amount + np.sum(monthly_savings_paths, axis=1)

        # Probability of achieving target
        success_mask = cumulative_saved >= target_amount
        feasibility_prob = float(np.mean(success_mask))

        # 90% Confidence Value-at-Risk (10th percentile outcome)
        p10_balance = float(np.percentile(cumulative_saved, 10))
        shortfall_at_risk_90 = max(0.0, target_amount - p10_balance)

        is_feasible = feasibility_prob >= 0.80

        return {
            "target_amount": round(target_amount, 2),
            "current_amount": round(current_amount, 2),
            "amount_needed": round(amount_needed, 2),
            "months_remaining": round(months_remaining, 1),
            "deterministic_monthly_required": round(deterministic_monthly_required, 2),
            "probabilistic_feasibility": round(feasibility_prob, 3),
            "shortfall_at_risk_90": round(shortfall_at_risk_90, 2),
            "p10_projected_balance": round(p10_balance, 2),
            "p50_projected_balance": round(float(np.percentile(cumulative_saved, 50)), 2),
            "p90_projected_balance": round(float(np.percentile(cumulative_saved, 90)), 2),
            "is_feasible": is_feasible
        }
