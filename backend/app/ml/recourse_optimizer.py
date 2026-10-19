from datetime import date, timedelta
from typing import Dict, Any, List
import numpy as np

class ConstrainedFinancialRecourseOptimizer:
    """
    CFRO: Constrained Financial Recourse Optimizer
    Generates actionable, structurally valid counterfactual financial plans
    while respecting immutable obligations and producing diverse options.
    """

    IMMUTABLE_CATEGORIES = {"Housing & Rent", "Debt & Loans"}
    SUBSISTENCE_FLOORS = {"Groceries": 0.70}  # Cannot cut groceries by more than 30%

    @classmethod
    def generate_recourse_profiles(
        cls,
        target_amount: float,
        current_amount: float,
        deadline: date,
        monthly_income: float,
        monthly_essential_burn: float,
        category_monthly_averages: Dict[str, float]
    ) -> List[Dict[str, Any]]:
        days_remaining = max(1, (deadline - date.today()).days)
        months_remaining = max(0.1, days_remaining / 30.4375)
        amount_needed = max(0.0, target_amount - current_amount)

        # Baseline monthly savings rate under current spending
        current_monthly_spend = sum(category_monthly_averages.values())
        current_monthly_savings = max(0.0, monthly_income - current_monthly_spend)

        # Monthly shortfall to reach goal
        target_monthly_savings = amount_needed / months_remaining
        monthly_savings_gap = max(0.0, target_monthly_savings - current_monthly_savings)

        discretionary_categories = {
            k: v for k, v in category_monthly_averages.items()
            if k not in cls.IMMUTABLE_CATEGORIES and k not in cls.SUBSISTENCE_FLOORS
        }

        profiles = []

        # ----------------------------------------------------
        # PROFILE 1: Aggressive Frugality (Hit original deadline)
        # ----------------------------------------------------
        p1_changes = []
        total_p1_cut = 0.0

        # Prioritize cuts: Dining -> Entertainment -> Shopping -> Subscriptions
        priority_order = ["Dining & Takeout", "Entertainment", "Shopping & Lifestyle", "Subscriptions"]
        remaining_gap = monthly_savings_gap

        for cat in priority_order:
            if cat in discretionary_categories and remaining_gap > 0:
                current_val = discretionary_categories[cat]
                # Can cut up to 60% of this category
                max_cut = current_val * 0.60
                cut = min(remaining_gap, max_cut)
                if cut > 5.0:
                    p1_changes.append({
                        "category": cat,
                        "current_monthly_spend": round(current_val, 2),
                        "recommended_monthly_spend": round(current_val - cut, 2),
                        "delta_monthly": -round(cut, 2),
                        "is_immutable": False
                    })
                    total_p1_cut += cut
                    remaining_gap -= cut

        # Calculate revised feasibility
        p1_feasibility = 0.88 if remaining_gap <= 20.0 else round(0.60 + (total_p1_cut / max(monthly_savings_gap, 1.0)) * 0.28, 2)
        profiles.append({
            "profile_id": "profile_frugality",
            "title": "Aggressive Frugality (Target Met on Time)",
            "feasibility_probability": min(0.96, p1_feasibility),
            "description": "Reduces non-essential dining and entertainment to hit your exact original deadline.",
            "proposed_changes": p1_changes,
            "revised_deadline": deadline.isoformat(),
            "expected_surplus_or_shortfall": round(total_p1_cut - monthly_savings_gap, 2)
        })

        # ----------------------------------------------------
        # PROFILE 2: Timeline Extension (Zero lifestyle cuts)
        # ----------------------------------------------------
        # Keep spending unchanged, calculate needed months
        safe_monthly_savings = max(100.0, current_monthly_savings)
        needed_months = amount_needed / safe_monthly_savings
        revised_days = int(needed_months * 30.4375)
        p2_deadline = date.today() + timedelta(days=max(days_remaining + 30, revised_days))

        profiles.append({
            "profile_id": "profile_timeline_flex",
            "title": "Flexible Timeline (Preserve Current Lifestyle)",
            "feasibility_probability": 0.90,
            "description": "Leaves your day-to-day budget intact, extending your deadline so savings accumulate naturally.",
            "proposed_changes": [],
            "revised_deadline": p2_deadline.isoformat(),
            "expected_surplus_or_shortfall": 0.0
        })

        # ----------------------------------------------------
        # PROFILE 3: Balanced Hybrid (Moderate cut + minor extension)
        # ----------------------------------------------------
        p3_changes = []
        total_p3_cut = 0.0
        # Moderate 15-20% cut across all discretionary
        for cat, val in discretionary_categories.items():
            mod_cut = val * 0.18
            if mod_cut > 8.0:
                p3_changes.append({
                    "category": cat,
                    "current_monthly_spend": round(val, 2),
                    "recommended_monthly_spend": round(val - mod_cut, 2),
                    "delta_monthly": -round(mod_cut, 2),
                    "is_immutable": False
                })
                total_p3_cut += mod_cut

        # Add modest 30 to 45 day extension
        p3_deadline = deadline + timedelta(days=45)
        p3_months = months_remaining + 1.5
        new_monthly_capacity = current_monthly_savings + total_p3_cut
        p3_feasibility = min(0.94, (new_monthly_capacity * p3_months) / max(amount_needed, 1.0))

        profiles.append({
            "profile_id": "profile_balanced",
            "title": "Balanced Recourse (Moderate Cuts + Minor Flex)",
            "feasibility_probability": round(float(np.clip(p3_feasibility, 0.75, 0.94)), 2),
            "description": "Applies gentle 18% reductions across entertainment and shopping, pairing with a 45-day buffer.",
            "proposed_changes": p3_changes,
            "revised_deadline": p3_deadline.isoformat(),
            "expected_surplus_or_shortfall": round((new_monthly_capacity * p3_months) - amount_needed, 2)
        })

        return profiles
