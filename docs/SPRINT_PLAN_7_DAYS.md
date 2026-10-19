# EXT-093: 7-Day 3-Person Implementation Sprint Plan

## 1. Team Allocation & Daily Overview

| Team Member | Role | Primary Responsibility | Key Tech Stack |
| :--- | :--- | :--- | :--- |
| **Person 1 (Backend & Data)** | Data & System Architect | Local SQLite Ledger, Data Ingestion, `SimFinEngine` Benchmark, FastAPI Core, API Routes | Python 3.14, FastAPI, SQLite, Pydantic, SQLAlchemy |
| **Person 2 (AI/ML & XAI)** | ML & Algorithmic Specialist | Tiered Categorizer, CQR Forecaster, Stress Classifier, CFRO Recourse, SHAP & Stability | Scikit-learn, SciPy, LightGBM, SHAP, NumPy |
| **Person 3 (Frontend & HCI)** | UI/UX & Interaction Lead | Modern Glassmorphic Dashboard, Uncertainty Visualization, What-If Simulator, CFF Friction | Modern Vanilla JS / HTML5, CSS3 Tokens, Chart.js, Lucide |

---

## 2. Day-by-Day Sprint Matrix (Day 1 to Day 7)

```
========================================================================================================================
DAY-BY-DAY 3-PERSON SPRINT MATRIX
========================================================================================================================
Day      Person 1 (Data & System)           Person 2 (ML & XAI Core)               Person 3 (Frontend & HCI)
------------------------------------------------------------------------------------------------------------------------
Day 1    Project scaffold, SQLite models,   Dataset benchmark synthesis,           Design tokens, CSS glassmorphism,
(Setup)  `SimFinEngine` baseline generator  Tier 1 Categorizer (TF-IDF + Calib)    App shell, navigation, mock views

Day 2    CRUD API endpoints for ledger,     Quantile Cash-Flow Forecaster          Transaction Ledger UI, category badges,
(Core)   accounts, and budget categories    + Conformal Quantile (CQR) bounds      1-click category override modal

Day 3    Recurring bill & income detector,  Stress & Solvency Classifier,          Forecast View with Conformal Fan Charts,
(Forec)  seed profiles (Student, Salaried)  ECE calibration, selective abstention  Cash-flow shortfall alert banner

Day 4    Goal storage, balance sheet math,  Goal Feasibility Engine                Goal Planning Screen with Monte Carlo
(Goals)  scenario perturbation endpoint     (Non-parametric Bootstrap Monte Carlo) probability gauge & target timelines

Day 5    FastAPI integration of all ML      CFRO Constrained Recourse Optimizer    Interactive What-If Scenario Simulator
(WhatIf) inference pipelines & caching      (3 diverse actionable paths: DiCE-Fin) with real-time sliders & Recourse Cards

Day 6    Explanation stability benchmark    TreeSHAP feature attribution module,   SHAP waterfall/bar charts, stability
(XAI)    runner, automated test suite       Relative Input Stability (RIS) tests   metrics display, CFF review modal

Day 7    End-to-end integration polish,     Final benchmark report & metrics,      Final UI polish, responsive checks,
(Demo)   local zero-knowledge validation    model export, presentation figures     presentation/demo dry run & recording
========================================================================================================================
```

---

## 3. Detailed Daily Work Breakdown

### Day 1: Foundation, Data Ingestion & Design Tokens
* **Person 1 (Backend):**
  - Initialize project structure (`backend/`, `frontend/`, `docs/`).
  - Implement SQLite local database with models: `Account`, `Transaction`, `Category`, `Goal`, `BudgetRule`.
  - Create `SimFinEngine`: generates realistic 12-month synthetic transaction histories for 3 distinct user personas (Salaried Professional, Freelancer with volatile income, College Student living paycheck-to-paycheck).
* **Person 2 (ML/XAI):**
  - Implement `Feature 1 (Categorizer)`: Preprocessing regex cleaner, character n-gram TF-IDF vectorizer, and Logistic Regression with Platt/Isotonic probability calibration.
  - Establish Tier 0 user override rule memory cache.
  - Implement evaluation harness computing Macro-F1, per-class Precision/Recall, and Expected Calibration Error (ECE).
* **Person 3 (Frontend):**
  - Build modern CSS design system: HSL color tokens, dark mode base, glassmorphism card utilities, responsive grid.
  - Set up application layout: Header, Sidebar, Metric Cards, Main Content viewport, Tab switcher.
  - Build mock dashboard layout showing empty states and responsive containers.

---

### Day 2: Ledger APIs, CQR Uncertainty Forecasting & Ledger UI
* **Person 1 (Backend):**
  - Build FastAPI REST routes:
    - `GET /api/accounts/summary`: Account balances and net worth.
    - `GET /api/transactions`: Paginated transaction list with category filters and confidence tags.
    - `POST /api/transactions/override`: User re-categorization override endpoint.
    - `POST /api/data/seed/{persona}`: One-click profile seeding.
* **Person 2 (ML/XAI):**
  - Implement `Feature 2 (Spending Forecaster)`: Daily/weekly cash-flow rolling aggregator with calendar features (day of week, month, payday lags).
  - Train Quantile LightGBM / Gradient Boosting regressors for quantiles $\alpha = 0.05, 0.50, 0.95$.
  - Implement **Conformalized Quantile Regression (CQR)**: compute non-conformity residuals on calibration split to guarantee finite-sample $(1-\alpha)$ coverage.
* **Person 3 (Frontend):**
  - Connect Transaction Ledger UI to `/api/transactions`.
  - Implement confidence badge styling: High Confidence (green, $>85\%$), Moderate (amber), Uncertain / Review Needed (red/pulse).
  - Build 1-click category edit modal that hits `/api/transactions/override` and updates local view immediately.

---

### Day 3: Financial Stress, Calibrated Risk & Forecast Visuals
* **Person 1 (Backend):**
  - Implement recurring income and bill detector (`RecurringDetector`): identifies monthly payrolls, rent dates, and subscriptions.
  - Build endpoints:
    - `GET /api/forecast/cashflow`: Returns 30/60/90-day trajectory with median and CQR 90% bounds.
    - `GET /api/risk/stress`: Returns solvency score, liquidity buffer days, and abstention status.
* **Person 2 (ML/XAI):**
  - Implement `Feature 3 (Stress Risk Classifier)`:
    - Calculate deterministic liquidity floor: $\text{Liquidity Days} = \frac{\text{Cash Balance}}{\text{Daily Essential Burn}}$.
    - Train calibrated risk classifier on rolling solvency indicators.
    - Implement **Dual-Trigger Selective Abstention**: If transaction history is $<45$ days or epistemic variance is high, output `ABSTAIN` with reason code.
* **Person 3 (Frontend):**
  - Build Forecast Chart using Chart.js:
    - Median projected trajectory (solid cyan line).
    - Conformal 90% prediction interval (translucent gradient band).
    - Historical actual balance (white solid line).
  - Build Financial Stress Gauge: Color-coded radial or meter display with Liquidity Buffer Days badge and selective abstention warning banner when active.

---

### Day 4: Goal Feasibility & Probabilistic Monte Carlo
* **Person 1 (Backend):**
  - Implement Goal endpoints:
    - `POST /api/goals`: Create new savings goal (target amount, target deadline, category).
    - `GET /api/goals`: List active goals with current progress.
    - `POST /api/goals/{id}/evaluate`: Trigger probabilistic simulation for goal feasibility.
* **Person 2 (ML/XAI):**
  - Implement `Feature 4 (Goal Feasibility Engine)`:
    - Baseline deterministic calculation: $S_{\text{monthly}} = (\text{Target} - \text{Current}) / M$.
    - Non-parametric **Bootstrap Monte Carlo Simulator**: Samples $N=5,000$ future balance paths by drawing from empirical historical discretionary spending distributions.
    - Output: $\hat{P}(\text{Success})$, 10th/50th/90th percentile final balance, and Value-at-Risk shortfall magnitude.
* **Person 3 (Frontend):**
  - Build Savings Goals Screen:
    - Goal progress cards (target vs saved vs deadline).
    - Probabilistic Feasibility Meter: "High Feasibility (>85%)", "At Risk (50-85%)", "Unlikely (<50%)".
    - Shortfall distribution histogram showing projected outcomes.

---

### Day 5: What-If Simulator & Constrained Recourse (CFRO)
* **Person 1 (Backend):**
  - Implement Simulation endpoint:
    - `POST /api/simulate/whatif`: Ingests hypothetical shocks (e.g. cut dining by $100, one-time $500 expense) and re-evaluates cash-flow and goal trajectories.
    - `POST /api/simulate/recourse`: Triggers CFRO to find optimal feasible spending adjustments.
* **Person 2 (ML/XAI):**
  - Implement `Feature 5 (CFRO — Constrained Financial Recourse Optimizer)`:
    - Formulate SciPy / SLSQP optimization problem minimizing perturbation cost subject to:
      1. Immutable expenses: Rent, loan EMIs, child care ($\Delta x = 0$).
      2. Subsistence minimums: Food $\ge \$200$.
      3. Balance sheet conservation: Net change equals savings improvement.
    - Generate 3 distinct profiles using diversity penalties:
      - **Profile A (Frugal / Quick):** Aggressive discretionary spending reduction.
      - **Profile B (Extended Timeline):** Minimal spending change, extends goal by $K$ months.
      - **Profile C (Balanced Hybrid):** Moderate cuts across dining, shopping, and entertainment.
* **Person 3 (Frontend):**
  - Build What-If Simulator Screen:
    - Interactive sliders for major discretionary categories (Dining, Shopping, Entertainment).
    - Dynamic recalculation of goal feasibility in real-time.
    - 3 Actionable Recourse Cards with 1-click "Apply Scenario" buttons.

---

### Day 6: XAI Feature Attribution, Stability & Cognitive Forcing
* **Person 1 (Backend):**
  - Build explanation endpoints:
    - `GET /api/xai/stress-attributions`: TreeSHAP feature contributions for stress score.
    - `POST /api/xai/stability-test`: Runs perturbation benchmark and returns Relative Input Stability (RIS) and Kendall's $\tau$.
* **Person 2 (ML/XAI):**
  - Integrate TreeSHAP on the gradient-boosted stress classifier.
  - Implement Explanation Stability Test Suite:
    - Injects synthetic financial noise $\delta \sim \mathcal{N}(0, \sigma^2)$ into transaction inputs.
    - Measures Kendall's rank correlation $\tau$ and Relative Input Stability (RIS) comparing TreeSHAP vs LIME.
* **Person 3 (Frontend):**
  - Build XAI Dashboard widgets:
    - Horizontal bi-directional SHAP bar charts showing positive (risk-increasing) and negative (risk-decreasing) features.
    - Explanation Stability indicator badge: "Stability Verified: Kendall's $\tau = 0.92$".
  - Implement **Cognitive Forcing Functions (CFFs)**:
    - Before unlocking an automated AI financial plan, display an interactive reflection checkpoint requiring the user to confirm their non-negotiable fixed expenses.

---

### Day 7: Integration, Verification, Polish & Demo Presentation
* **Person 1 (Backend):**
  - Run end-to-end integration and load tests.
  - Verify 100% local operation (runs offline, zero outbound cloud calls).
  - Package 1-click startup script (`python run.py`).
* **Person 2 (ML/XAI):**
  - Generate final benchmark evaluation metrics table (Macro-F1, CQR PICP, Brier score, RIS).
  - Produce high-resolution charts for research presentation / paper submission.
* **Person 3 (Frontend):**
  - Visual polish: smooth transitions, micro-animations, tooltips, responsive layout fixes.
  - Conduct full end-to-end user journey dry run for presentation.

---

## 4. Shared API Contracts (FastAPI & JSON Schema)

### Contract 1: `GET /api/transactions`
```json
{
  "transactions": [
    {
      "id": "tx_001",
      "date": "2026-10-14",
      "description": "TST* SWEETGREEN 4295 NY",
      "amount": 16.45,
      "type": "debit",
      "category": "Food & Dining",
      "confidence": 0.94,
      "is_recurring": false,
      "is_user_overridden": false
    }
  ],
  "total_count": 142
}
```

### Contract 2: `GET /api/forecast/cashflow`
```json
{
  "horizon_days": 60,
  "trajectory": [
    {
      "date": "2026-10-16",
      "median_balance": 4250.00,
      "lower_bound_90": 3950.00,
      "upper_bound_90": 4480.00,
      "projected_spend": 85.00
    }
  ],
  "coverage_guarantee": "90% Conformalized Quantile Regression (CQR)"
}
```

### Contract 3: `POST /api/simulate/recourse`
```json
{
  "goal_id": "goal_emergency_fund",
  "target_amount": 5000.00,
  "current_amount": 2800.00,
  "deadline": "2026-12-31",
  "recourse_profiles": [
    {
      "profile_name": "Aggressive Frugality",
      "feasibility_probability": 0.92,
      "proposed_changes": [
        {"category": "Dining Out", "current_monthly": 450, "recommended_monthly": 200, "delta": -250},
        {"category": "Entertainment", "current_monthly": 180, "recommended_monthly": 80, "delta": -100}
      ],
      "immutable_preserved": ["Rent", "Car Loan", "Insurance"],
      "shortfall_at_risk_90": 0.00
    },
    {
      "profile_name": "Timeline Extension",
      "feasibility_probability": 0.90,
      "proposed_changes": [],
      "extended_deadline": "2027-02-15",
      "shortfall_at_risk_90": 0.00
    }
  ]
}
```
