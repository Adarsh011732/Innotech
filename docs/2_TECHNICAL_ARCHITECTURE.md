# Technical Architecture Document
## Project Name: EXT-093 FinGuard Assistant
**Subtitle:** End-to-End System Design, Algorithmic Engines, and Mathematical Formulations  
**Project Code:** EXT-093 / Innotech-FinGuard  
**Document Version:** 1.0  
**Target Milestone:** Production MVP & Core Engine Release  
**Status:** Approved for Implementation  

---

## 1. Architectural Principles & High-Level Topology

**EXT-093 FinGuard Assistant** is engineered as a **Local-First, Zero-Knowledge Intelligence System**. Unlike standard consumer financial applications that offload sensitive bank transactions to multi-tenant cloud databases, EXT-093 executes the entire machine learning inference, mathematical optimization, and transactional ledger pipeline on the user's host machine.

```
+-----------------------------------------------------------------------------------+
|                           EXT-093 SYSTEM TOPOLOGY                                 |
+-----------------------------------------------------------------------------------+
|  [ Client Layer: Modern Glassmorphic Web UI ]                                     |
|  - Vanilla HTML5 / CSS3 Tokens / ES6 Modules / Chart.js Canvas                    |
|  - Real-Time Uncertainty Fan Charts / Dynamic What-If Recourse Sliders            |
+------------------------------------------^----------------------------------------+
                                           | HTTP REST / JSON (Localhost 127.0.0.1:8000)
+------------------------------------------v----------------------------------------+
|  [ Application Layer: FastAPI Async Micro-Framework ]                             |
|  - Pydantic Validation / Static File Serving / CORS Local Whitelist              |
|  - Dependency Injection / Database Session Pooling                                |
+-----------------------+----------------------------------+------------------------+
                        |                                  |
+-----------------------v----------------+  +--------------v------------------------+
|  [ Core Intelligence Engines (ML/XAI) ]|  |  [ Persistence Layer: Local SQLite ]  |
|  - SimFinEngine Synthetic Benchmark    |  |  - SQLite 3 with Foreign Key Cascades  |
|  - Tiered Categorizer (Platt Calib)    |  |  - Accounts, Transactions, Categories |
|  - CQR Quantile Cash-Flow Forecaster   |  |  - Goals, BudgetRules, AuditLogs       |
|  - Solvency Stress & ECE Classifier   |  +---------------------------------------+
|  - CFRO Constrained Recourse Optimizer |
|  - TreeSHAP & Stability Engine (Noise) |
+----------------------------------------+
```

---

## 2. Core Algorithmic & Mathematical Specifications

### 2.1 Conformal Quantile Regression (CQR) Cash-Flow Forecaster
To quantify cash-flow uncertainty without making unrealistic Gaussian assumptions, the forecaster implements **Conformal Quantile Regression**. Given historical daily net balance changes $y_t$ and feature vector $x_t$ (calendar cycle, recurring paydays, rolling variance), the engine estimates three pinball loss quantiles:

$$\mathcal{L}_{\alpha}(y, \hat{y}) = \max(\alpha(y - \hat{y}), (1 - \alpha)(\hat{y} - y))$$

For quantiles $\alpha \in \{0.10, 0.50, 0.90\}$:
1. **Model Backbone:** Quantile Gradient Boosted Trees producing point forecasts $[\hat{q}_{0.10}(x), \hat{q}_{0.50}(x), \hat{q}_{0.90}(x)]$.
2. **Conformal Nonconformity Score:** Computed on a calibration set $(x_i, y_i) \in \mathcal{D}_{\text{calib}}$:
   $$E_i = \max(\hat{q}_{0.10}(x_i) - y_i,\; y_i - \hat{q}_{0.90}(x_i))$$
3. **Calibrated Prediction Interval:** With target coverage $1 - \epsilon = 0.80$:
   $$Q = \text{Quantile}\left(1 - \epsilon;\, \{E_i\}\right)$$
   $$\mathcal{C}(x_{\text{test}}) = \left[ \hat{q}_{0.10}(x_{\text{test}}) - Q,\; \hat{q}_{0.90}(x_{\text{test}}) + Q \right]$$

This mathematical guarantee ensures that the true future cash trajectory falls within the generated prediction fan with $\ge 80\%$ empirical confidence.

---

### 2.2 Constrained Financial Recourse Optimization (CFRO)
When a user sets a target goal $G$ (target amount $A$, horizon $T$ months) and current monthly savings $S_{\text{current}} < A / T$, the engine computes the optimal counterfactual spending adjustment vector $\mathbf{\delta}^* \in \mathbb{R}^K$ across $K$ discretionary categories.

$$\min_{\mathbf{\delta}} \; \sum_{k=1}^K w_k \cdot \phi_k(\delta_k) + \lambda \cdot \|\mathbf{\delta}\|_2^2$$

Subject to:
1. **Attainment Feasibility:** $S_{\text{current}} + \sum_{k=1}^K \delta_k \ge \frac{A}{T}$
2. **Category Hard Floors:** $0 \le \delta_k \le C_k^{\text{current}} - C_k^{\text{floor}}$
3. **Essential Invariance:** $\delta_m = 0 \quad \forall m \in \text{Essential Categories (Rent, Utilities, Insurance)}$
4. **Friction Weighting:** $w_k$ corresponds to the empirical lifestyle disruption metric (e.g., Dining has lower friction weight than Health/Fitness).

The optimizer emits three distinct Pareto-optimal recourse profiles:
* **Balanced Recourse (Profile A):** Minimizes maximum individual category disruption ($\|\mathbf{\delta}\|_{\infty}$).
* **Aggressive Savings (Profile B):** Prioritizes immediate goal fulfillment with higher discretionary cuts.
* **Horizon Extension (Profile C):** Solves for extended time horizon $T' > T$ such that $\mathbf{\delta} = \mathbf{0}$.

---

### 2.3 Solvency Stress Classifier & ECE Calibration
The solvency engine evaluates bankruptcy risk and emergency reserve durability using an ECE-calibrated risk model:
* **Feature Vector:** [Liquidity Ratio, Debt-to-Income, Cash Burn Rate, 30-day Volatility, Discretionary Ratio].
* **Expected Calibration Error (ECE):**
  $$\text{ECE} = \sum_{m=1}^M \frac{|B_m|}{N} \left| \text{acc}(B_m) - \text{conf}(B_m) \right| \le 0.04$$
* **Selective Abstention:** If $\max_c P(y=c|x) < 0.60$ and epistemic variance across trees exceeds $\sigma_{\text{threshold}}$, the model emits an `abstain=true` flag to prevent high-confidence erroneous warnings.

---

### 2.4 Explainability & Perturbation Stability (TreeSHAP)
Feature attributions are generated using exact TreeSHAP:
$$f(x) = \phi_0 + \sum_{j=1}^M \phi_j(x)$$
To guarantee forensic integrity against adversarial input noise, the engine executes a local perturbation test:
* Adds Gaussian noise $\eta \sim \mathcal{N}(0, \sigma^2 \mathbf{I})$ with $\sigma = 0.05 \cdot \text{std}(X)$.
* Calculates Kendall's Tau rank correlation $\tau(\mathbf{\phi}(x), \mathbf{\phi}(x + \eta))$:
  $$\tau = \frac{P - Q}{\frac{1}{2} n (n - 1)} \ge 0.85$$

---

## 3. Database Schema & Entity Relationships

The local SQLite database (`data/personal_finance.db`) is structured around 6 relational tables:

| Table Name | Primary Key | Foreign Keys | Key Columns | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `accounts` | `id` (VARCHAR) | None | `name`, `type`, `balance`, `currency` | Tracks checking, savings, and credit balances. |
| `categories` | `id` (VARCHAR) | None | `name`, `type` (Essential/Discretionary), `budget_limit` | Categorical classification and budget caps. |
| `transactions` | `id` (VARCHAR) | `account_id`, `category_id` | `date`, `amount`, `description`, `confidence`, `is_recurring` | Granular financial ledger records. |
| `goals` | `id` (VARCHAR) | None | `title`, `target_amount`, `current_amount`, `target_date` | Multi-month savings and investment milestones. |
| `budget_rules` | `id` (VARCHAR) | `category_id` | `rule_type`, `threshold_amount`, `is_active` | Real-time threshold monitoring alerts. |
| `audit_logs` | `id` (VARCHAR) | None | `timestamp`, `action`, `actor`, `details` | Local forensic history for category overrides. |

---

## 4. API Specification & Core Endpoints

| Method | Endpoint | Parameters | Response Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | None | `{status: "ok", version: "1.0"}` | Service health and engine status. |
| `GET` | `/api/accounts/summary` | None | `{total_net_worth, liquidity, monthly_burn}` | Balance sheet and liquidity metrics. |
| `GET` | `/api/forecast/cashflow` | `horizon_days` (30/60/90) | `{trajectory: [{date, q10, q50, q90}], shortfall}` | CQR quantile fan chart time-series. |
| `GET` | `/api/risk/stress` | None | `{solvency_score, runway_days, risk_level, drivers}` | Calibrated stress analysis and key risk drivers. |
| `GET` | `/api/goals` | None | `[{id, title, target_amount, current_amount, ...}]` | Active user savings and investment goals. |
| `GET` | `/api/goals/{id}/evaluate` | Goal ID | `{feasibility, recourse_profiles: [A, B, C]}` | CFRO constrained recourse optimization. |
| `POST`| `/api/xai/stability-test` | `noise_pct` (float) | `{kendall_tau, top_k_jaccard, metrics}` | Mathematical perturbation stability validation. |
| `POST`| `/api/transactions/override`| `{tx_id, new_category_id}`| `{status: "success", tx_id, updated_category}` | 1-click human-in-the-loop category update. |
