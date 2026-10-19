# Feature Ticket List & Sprint Breakdown
## Project Name: EXT-093 FinGuard Assistant
**Subtitle:** Engineering Tickets, Acceptance Criteria, and 7-Day Implementation Roadmap  
**Project Code:** EXT-093 / Innotech-FinGuard  
**Document Version:** 1.0  
**Target Milestone:** Production MVP & Core Engine Release  
**Status:** Approved for Implementation  

---

## 1. Feature Epics Overview

The development of **EXT-093 FinGuard Assistant** is segmented into six core engineering epics, designed for parallel execution across a 3-person engineering team:

| Epic ID | Epic Title | Focus Area | Primary Tech Stack |
| :--- | :--- | :--- | :--- |
| **EPIC-1** | Data Engine & Local Ledger | SQLite schema, SimFin synthetic benchmark, statement parsing | SQLite, SQLAlchemy, Pydantic |
| **EPIC-2** | ML & Conformal Forecasting | Platt-calibrated categorizer, CQR quantile forecasting (q10/q50/q90) | Scikit-learn, LightGBM, NumPy |
| **EPIC-3** | Stress & Recourse Engine | ECE-calibrated solvency scoring, CFRO constrained optimizer | SciPy Optimize, NumPy |
| **EPIC-4** | Explainability & Stability | TreeSHAP feature attribution, Kendall's tau perturbation tester | SHAP, SciPy Stats |
| **EPIC-5** | Glassmorphic UI & HCI | Vanilla CSS tokens, Chart.js fan charts, reactive sliders | Modern Vanilla JS, CSS3, HTML5 |
| **EPIC-6** | Integration & Verification | Automated REST test suite, cross-persona validation, audit logs | HTTPX, Pytest, Uvicorn |

---

## 2. Granular Feature Ticket Breakdown

### EPIC-1: Data Engine & Local Ledger Persistence

#### Ticket TKT-101: SQLite Relational Schema & ORM Initialization
* **Priority:** Critical | **Story Points:** 3 | **Assignee:** Person 1 (Backend)
* **Description:** Initialize local SQLite database with normalized schema for accounts, transactions, categories, goals, budget rules, and audit logs.
* **Acceptance Criteria:**
  - Foreign key cascading constraints enabled (`PRAGMA foreign_keys = ON;`).
  - Indexing applied on `transaction.date` and `transaction.category_id`.
  - Passing automated schema migration and teardown unit tests.

#### Ticket TKT-102: Synthetic Data Generator (`SimFinEngine`)
* **Priority:** High | **Story Points:** 5 | **Assignee:** Person 1 (Backend)
* **Description:** Build generator producing 12 months of realistic synthetic financial transactions for 3 user personas (Salaried, Freelancer, Student).
* **Acceptance Criteria:**
  - Accurately models payroll schedules, bi-weekly volatility, and seasonal expenditure spikes.
  - Generates over $1,500$ normalized ledger rows with realistic merchant naming tokens.

---

### EPIC-2: ML & Conformal Cash-Flow Forecasting

#### Ticket TKT-201: Tiered Transaction Categorizer with Platt Calibration
* **Priority:** High | **Story Points:** 5 | **Assignee:** Person 2 (ML Lead)
* **Description:** Develop two-tier classification pipeline combining deterministic regex rules with TF-IDF calibrated Logistic Regression.
* **Acceptance Criteria:**
  - Sub-5ms inference latency per transaction.
  - Platt calibration produces realistic epistemic confidence scores ($0.0 - 1.0$).
  - Classification accuracy $\ge 92\%$ on benchmark transaction corpus.

#### Ticket TKT-202: Conformal Quantile Regression (CQR) Engine
* **Priority:** Critical | **Story Points:** 8 | **Assignee:** Person 2 (ML Lead)
* **Description:** Implement multi-horizon (30/60/90 days) cash-flow forecasting producing 10th, 50th, and 90th percentile bounds with conformal coverage calibration.
* **Acceptance Criteria:**
  - Conformal calibration guarantees $\ge 80\%$ empirical coverage on test splits.
  - Flags liquidity shortfall warnings when lower bound $q_{10} \le \$0.00$.

---

### EPIC-3: Solvency Stress & Recourse Optimization

#### Ticket TKT-301: Solvency Stress & Expected Calibration Error (ECE) Model
* **Priority:** High | **Story Points:** 5 | **Assignee:** Person 2 (ML Lead)
* **Description:** Build financial stress classifier computing Solvency Score ($0 - 100$), Runway Days, and Risk Tier (Low/Moderate/Critical).
* **Acceptance Criteria:**
  - ECE error optimized to $\le 0.04$ against historical insolvency indicators.
  - Emits selective abstention signal when confidence falls below certainty threshold.

#### Ticket TKT-302: Constrained Financial Recourse Optimizer (CFRO)
* **Priority:** Critical | **Story Points:** 8 | **Assignee:** Person 2 (ML Lead)
* **Description:** Formulate goal feasibility as a constrained optimization problem, yielding 3 actionable Pareto-optimal recourse profiles.
* **Acceptance Criteria:**
  - Profile A (Balanced), Profile B (Aggressive), and Profile C (Horizon Extension) generated in $<100\text{ ms}$.
  - Strict mathematical invariance enforced for essential spending categories (rent, utilities).

---

### EPIC-4: Explainability & Perturbation Stability

#### Ticket TKT-401: Exact TreeSHAP Attribution Pipeline
* **Priority:** High | **Story Points:** 5 | **Assignee:** Person 2 (ML Lead)
* **Description:** Compute exact additive feature contributions for every solvency risk assessment.
* **Acceptance Criteria:**
  - Outputs signed feature importance scores for top financial indicators.
  - Perfectly satisfies local accuracy and additivity efficiency properties.

#### Ticket TKT-402: Adversarial Perturbation Stability Engine
* **Priority:** Medium | **Story Points:** 3 | **Assignee:** Person 2 (ML Lead)
* **Description:** Implement stability verification injecting $5\%-10\%$ synthetic Gaussian noise into feature vectors and calculating Kendall's $\tau$.
* **Acceptance Criteria:**
  - Kendall's $\tau \ge 0.85$ under $5\%$ noise.
  - Top-3 feature Jaccard similarity index $\ge 0.75$.

---

### EPIC-5: Glassmorphic UI & Interactive HCI Workflows

#### Ticket TKT-501: Design Token System & Glassmorphic Shell
* **Priority:** High | **Story Points:** 5 | **Assignee:** Person 3 (Frontend Lead)
* **Description:** Implement pure CSS3 design token system, frosted glass components, responsive typography, and layout shell.
* **Acceptance Criteria:**
  - Zero external CSS frameworks (clean Vanilla CSS architecture).
  - High-contrast accessibility compliance across light and dark tokens.

#### Ticket TKT-502: Real-Time Uncertainty Fan Charts (Chart.js)
* **Priority:** Critical | **Story Points:** 5 | **Assignee:** Person 3 (Frontend Lead)
* **Description:** Integrate responsive canvas fan charts displaying $q_{10}, q_{50}, q_{90}$ forecast bands with liquidity shortfall highlight regions.
* **Acceptance Criteria:**
  - Smooth animation transitions between 30, 60, and 90-day time horizons.
  - Accessible tooltip inspectors showing exact confidence intervals on hover.

#### Ticket TKT-503: Interactive What-If Scenario Simulator & Recourse Cards
* **Priority:** High | **Story Points:** 5 | **Assignee:** Person 3 (Frontend Lead)
* **Description:** Build reactive slider controls for expense/income shocks and 3-column recourse action cards.
* **Acceptance Criteria:**
  - Sub-50ms client-side recomputation as sliders are manipulated.
  - 1-click recourse profile application updating local budget targets.

---

### EPIC-6: Integration, E2E Testing & Audit Verification

#### Ticket TKT-601: Automated REST API Verification Suite (`test_api.py`)
* **Priority:** High | **Story Points:** 3 | **Assignee:** Person 1 (Backend)
* **Description:** Develop comprehensive integration test suite verifying all REST endpoints and data contracts.
* **Acceptance Criteria:**
  - End-to-end verification of `/api/health`, `/api/accounts/summary`, `/api/forecast/cashflow`, `/api/risk/stress`, `/api/goals`, and `/api/xai/stability-test`.
  - Zero failed assertions across full test suite execution.

#### Ticket TKT-602: Human-in-the-Loop Override & Audit Trail Logging
* **Priority:** Medium | **Story Points:** 3 | **Assignee:** Person 1 (Backend)
* **Description:** Implement category override endpoint with immutable audit trail logging in SQLite `audit_logs`.
* **Acceptance Criteria:**
  - Instantaneous category reclassification reflected across all ledger views.
  - Complete historical log preserved with timestamp, user action, and previous category.
