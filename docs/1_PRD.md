# Product Requirements Document (PRD)
## Project Name: EXT-093 FinGuard Assistant
**Subtitle:** Uncertainty-Aware Personal Finance Risk & Goal Planning Assistant with Constrained Recourse and Explainable AI  
**Project Code:** EXT-093 / Innotech-FinGuard  
**Document Version:** 1.0  
**Target Milestone:** Production MVP & Core Engine Release  
**Status:** Approved for Implementation  

---

## 1. Executive Summary

**EXT-093 FinGuard Assistant** is a local-first, privacy-preserving personal finance risk and goal planning platform engineered to transform personal budgeting from a passive recording tool into an active, uncertainty-aware decision-support system. Traditional consumer budgeting tools (e.g., Mint, YNAB, standard banking apps) rely on deterministic assumptions: they forecast next month's net worth as a single linear projection and treat goals as static arithmetic equations (`Target Amount / Months = Monthly Savings`). 

This deterministic paradigm fails catastrophically in real-world personal finance:
1. **Income and expenditure volatility** (especially for gig-workers, freelancers, and younger professionals) produces wide probability distributions, not single-point futures.
2. **Standard black-box ML advice** offers generic, unhelpful platitudes (*"spend less on dining out"*) without quantifying feasibility, downside risk, or psychological friction.
3. **Data privacy concerns:** Centralized cloud storage of high-resolution transactional ledgers creates unacceptable breach vectors and regulatory liabilities.

EXT-093 solves these fundamental challenges through a **four-pillar architecture**:
* **Local-First Zero-Knowledge Architecture:** SQLite embedded ledger engine executing 100% on-device with zero cloud telemetry or centralized data persistence.
* **Conformal Quantile Regression (CQR) Cash-Flow Forecasting:** Non-parametric quantile forecasting generating rigorous prediction intervals ($q_{10}, q_{50}, q_{90}$) that mathematically guarantee coverage levels under extreme distribution shifts.
* **Constrained Financial Recourse Optimization (CFRO):** Counterfactual optimization that produces actionable, bounded adjustments across flexible budget categories while enforcing hard constraints on essential living expenses.
* **Explainable AI (XAI) & Attributions Stability:** Exact TreeSHAP feature importance paired with local perturbation testing (Kendall's $\tau$ correlation) ensuring recommendations remain consistent under everyday transactional noise.

---

## 2. Problem Statement & User Pain Points

### 2.1 The Pitfalls of Deterministic Financial Tools
* **False Precision and the Mirage of Certainty:** Linear forecasting ignores tail-risk events (sudden car repairs, medical copays, seasonal utility spikes). When a single adverse shock occurs, deterministic plans collapse, leaving users demotivated.
* **The "Black-Box" Advice Trap:** Existing robo-advisors fail to explain why a user's risk score was downgraded or which specific category overspend triggered an insolvency warning.
* **Friction-Blind Recommendations:** Generic budgeting engines propose unrealistic lifestyle cuts (e.g., cutting grocery spending by 60%) that violate user tolerance and result in rapid attrition.
* **Surveillance Capitalism in Consumer Fintech:** Cloud-based apps monetize user financial data through targeted loan advertising, behavioral profiling, and third-party data broker syndication.

---

## 3. Product Vision & Target Personas

EXT-093 is built to serve users across the spectrum of income predictability and liquidity depth:

| Persona Profile | Primary Pain Points | EXT-093 Target Workflow | Key Target Metric |
| :--- | :--- | :--- | :--- |
| **Persona A: Salaried Professional** | Lifestyle inflation, complex multi-goal trade-offs (home down payment vs. vacation), high discretionary leakage. | CFRO recourse profiles optimizing savings allocation across competing goals with minimal sacrifice. | $>85\%$ Probabilistic Goal Attainment within target month. |
| **Persona B: Volatile Freelancer** | Irregular lump-sum contract payouts, seasonal dry spells, unpredictable cash-flow deficits. | CQR 90-day lower-bound ($q_{10}$) cash-flow forecast with early liquidity shortfall warning triggers. | Zero unexpected overdrafts; $>45$ days of projected runway. |
| **Persona C: Student (Paycheck-to-Paycheck)** | Low reserve capital, high sensitivity to minor expense spikes, high cognitive stress. | Solvency Stress Engine with ECE-calibrated risk alerts and immediate discretionary spending caps. | Real-time Runway Days countdown; high-confidence categorization. |

---

## 4. Key Functional Requirements

### 4.1 Local Data Ingestion & Synthesis Engine (`SimFinEngine`)
* **FR-1.1:** Support zero-cloud ingestion of structured CSV/JSON bank statements into a normalized local SQLite schema (`accounts`, `transactions`, `categories`, `goals`, `budget_rules`).
* **FR-1.2:** Synthetic transaction generator (`SimFinEngine`) providing 12 months of daily transaction histories ($1,500+$ transactions) parameterized for the 3 target personas.
* **FR-1.3:** Recurring bill and payroll detection algorithm capable of identifying cadence, median variance, and next expected execution date.

### 4.2 Tiered Transaction Categorization
* **FR-2.1:** Tier 1 deterministic rule-based regex engine for instant sub-millisecond assignment of common merchant patterns.
* **FR-2.2:** Tier 2 machine-learning classifier (TF-IDF + Platt-calibrated SGD/Logistic Regression) assigning transactions to 8 standard categories with calibrated confidence scores.
* **FR-2.3:** User-in-the-loop override modal allowing instantaneous 1-click category reclassification that updates local training buffers.

### 4.3 Quantile Cash-Flow Forecaster (CQR)
* **FR-3.1:** Multi-horizon forecast generation (30, 60, and 90 days) producing 10th percentile (worst-case), 50th percentile (median), and 90th percentile (optimistic) daily balance paths.
* **FR-3.2:** Conformal calibration guaranteeing 80% empirical prediction interval coverage over holdout test splits.
* **FR-3.3:** Real-time liquidity shortfall detection flagging any date where $q_{10} \le 0$ as a critical cash-flow hazard.

### 4.4 Solvency Stress & Risk Classifier
* **FR-4.1:** Continuous computation of composite Solvency Score ($0 - 100$), Net Runway Days, and Risk Tier (Low, Moderate, Critical).
* **FR-4.2:** ECE (Expected Calibration Error) optimization ensuring predicted probabilities match true default/insolvency frequencies within $\pm 4\%$.
* **FR-4.3:** Selective abstention fallback when epistemic uncertainty is excessive, prompting the user for manual validation instead of providing false guidance.

### 4.5 Constrained Financial Recourse Optimizer (CFRO)
* **FR-5.1:** Formulation of user financial goals (e.g., $5,000 Emergency Fund in 6 months) as a constrained optimization problem.
* **FR-5.2:** Generation of 3 distinct, actionable recourse profiles:
  - *Profile A (Balanced):* Uniform low-friction cuts across flexible discretionary categories.
  - *Profile B (Aggressive Cut):* Maximum savings rate prioritizing fastest goal achievement.
  - *Profile C (Horizon Extension):* Preservation of current monthly budget with target date deferral.
* **FR-5.3:** Hard boundary enforcement: strict non-reduction of fixed essentials (rent, utilities, insurance, loan minimums).

### 4.6 Explainability (XAI) & Perturbation Stability
* **FR-6.1:** Exact TreeSHAP feature attribution calculating the precise numerical contribution of each financial metric to the user's Solvency Score.
* **FR-6.2:** Stability verification module subjecting the input vector to $5\% - 10\%$ synthetic Gaussian perturbation and reporting Kendall's $\tau$ rank correlation ($>0.85$ required).

---

## 5. Non-Functional Requirements & System Constraints

| Dimension | Specification | Verification Mechanism |
| :--- | :--- | :--- |
| **Latency (API Response)** | $p_{95} \le 35\text{ ms}$ for ledger/summary queries; $p_{95} \le 120\text{ ms}$ for CQR & CFRO simulation. | Automated endpoint benchmark (`test_api.py`). |
| **Privacy & Security** | Zero external network calls for financial data processing. SQLite stored locally on disk. | Network packet inspection during test runs. |
| **Platform Footprint** | Local server memory usage $\le 120\text{ MB}$; storage footprint $\le 25\text{ MB}$ (excluding local model cache). | System process monitor (`psutil`). |
| **Browser Compatibility** | Chrome, Edge, Firefox, Safari (desktop and mobile responsive viewport). | Multi-viewport DOM verification. |

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

* **Forecast Reliability:** Conformal coverage $\ge 78\%$ on holdout testing windows across all 3 persona datasets.
* **Actionable Recourse Quality:** $100\%$ of generated recourse profiles respect immutable essential expense constraints.
* **Explanation Stability:** Kendall's $\tau \ge 0.85$ and Top-3 Feature Jaccard Similarity $\ge 0.75$ under $5\%$ noise.
* **User Efficiency:** Sub-2-second end-to-end evaluation for any new goal or "what-if" scenario adjustment.
