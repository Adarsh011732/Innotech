# Security, Privacy & Access Control Specification
## Project Name: EXT-093 FinGuard Assistant
**Subtitle:** Local-First Zero-Knowledge Architecture, Threat Modeling, and Regulatory Compliance  
**Project Code:** EXT-093 / Innotech-FinGuard  
**Document Version:** 1.0  
**Target Milestone:** Production MVP & Core Engine Release  
**Status:** Approved for Implementation  

---

## 1. Security Philosophy & The Zero-Knowledge Imperative

Consumer financial data constitutes one of the most sensitive digital footprints in existence. Breaches of financial transaction records expose intimate details including healthcare copays, relationship statuses, physical locations, political donations, and emergency distress indicators.

**EXT-093 FinGuard Assistant** is designed from the ground up around a **Zero-Knowledge, Local-First Architecture**. By strictly decoupling high-performance financial intelligence from cloud surveillance:
1. **Zero External Data Transmission:** No transaction amounts, merchant names, account balances, or goal milestones are ever transmitted over external networks.
2. **Device-Bound Computation:** Machine learning inference (CQR forecasting, Platt-calibrated categorizers, TreeSHAP attributions) executes purely on host CPU/memory.
3. **No Centralized Honey-Pot:** There is no centralized server or cloud bucket containing user credentials or transaction histories that malicious actors can target.

---

## 2. Threat Modeling & STRIDE Risk Assessment

| STRIDE Threat Category | Threat Description | Severity | EXT-093 Countermeasure & Defense Implementation |
| :--- | :--- | :--- | :--- |
| **Spoofing Identity** | Unauthorized process impersonating the legitimate user or UI to query financial metrics. | Medium | Localhost binding restricted strictly to `127.0.0.1`. CORS policies disallow external origins. |
| **Tampering with Data** | Malicious injection or modification of transaction history in SQLite ledger. | High | Parameterized queries via SQLAlchemy ORM; strict Pydantic type validation; SQLite integrity checks. |
| **Repudiation** | User or automated subsystem disputes a transaction reclassification or budget adjustment. | Low | Immutable `audit_logs` table recording all override actions, timestamps, and previous values. |
| **Information Disclosure** | Memory scraping, disk inspection, or exfiltration of plaintext bank statements. | High | Local database encrypted via host OS file access controls (EFS / BitLocker); memory scrubbing post-import. |
| **Denial of Service (DoS)** | Malformed synthetic files or huge CSV imports causing memory exhaustion. | Medium | Strict streaming chunk sizes ($5,000$ rows max per ingestion batch); process memory ceiling at $250\text{ MB}$. |
| **Elevation of Privilege** | Exploit in Python dependencies or web view gaining elevated host system privileges. | High | Operates with unprivileged user permissions; zero reliance on root/admin daemons. |

---

## 3. Data Protection Architecture & Cryptographic Controls

```
+-----------------------------------------------------------------------------------+
|                     DATA PROTECTION & STORAGE BOUNDARIES                          |
+-----------------------------------------------------------------------------------+
|  [ Ingestion Ingress ]                                                            |
|  - Raw CSV/JSON statements parsed in-memory with strict Pydantic schema validation|
|  - Immediate scrubbing of raw ingestion buffers after database insertion          |
+------------------------------------------+----------------------------------------+
                                           |
+------------------------------------------v----------------------------------------+
|  [ Local Persistence: SQLite Database ]                                           |
|  - Stored on host OS at: `data/personal_finance.db`                               |
|  - Protected by OS Discretionary Access Control (ACL: current user only)           |
|  - Foreign key integrity enforcement: `PRAGMA foreign_keys = ON;`                 |
|  - Write-Ahead Logging (WAL) enabled: `PRAGMA journal_mode = WAL;`                |
+------------------------------------------+----------------------------------------+
                                           |
+------------------------------------------v----------------------------------------+
|  [ Runtime Boundary: 127.0.0.1:8000 ]                                             |
|  - FastAPI ASGI server bound exclusively to IPv4 Loopback (`127.0.0.1`)           |
|  - Rejects incoming packets originating from non-loopback network adapters       |
+-----------------------------------------------------------------------------------+
```

---

## 4. Input Sanitization & Application Security Defenses

### 4.1 SQL Injection Prevention
Direct SQL string concatenation is strictly prohibited across all repositories and backend handlers. Every query is executed either through:
1. **SQLAlchemy ORM** session queries utilizing parameterized bound parameters:
   ```python
   # Enforced Pattern
   session.query(Transaction).filter(Transaction.account_id == account_id).all()
   ```
2. **Pydantic Type Guards:** Ingress payload properties (e.g., `amount`, `category_id`, `target_date`) undergo cryptographic type enforcement before reaching the persistence layer.

### 4.2 Cross-Origin Resource Sharing (CORS) & Host Filtering
The FastAPI application strictly constrains accepted origins:
* Permitted origins: `["http://127.0.0.1:8000", "http://localhost:8000"]`
* Wildcard `*` origin access is completely disabled in production builds.

---

## 5. Explainable AI (XAI) Governance & Regulatory Compliance

### 5.1 GDPR Article 22 (Automated Decision-Making & Right to Explanation)
Under European and international privacy frameworks, individuals subjected to automated algorithmic assessments (such as financial stress scoring or credit-adjacent risk profiling) possess the legal right to receive meaningful information regarding the logic involved.

* **Compliant Implementation:** The TreeSHAP engine computes exact additive Shapley values for all risk tier determinations. For every solvency assessment, the UI provides a transparent waterfall chart depicting the exact positive and negative drivers (e.g., *"+14 points due to 60-day cash buffer; -18 points due to discretionary spending spike"*).

### 5.2 Algorithmic Recourse Integrity & Non-Discriminatory Constraints
Automated recourse recommendations generated by the CFRO engine are subject to ethical constraints:
* **No Infeasible Hard Shocks:** Essential expense floors (rent, utilities) cannot be manipulated by optimization routines to force mathematical convergence.
* **Predictable Monotonicity:** Reducing discretionary spending must never result in a deteriorated solvency or feasibility score.
* **Perturbation Auditability:** All model stability metrics (Kendall's $\tau$, Jaccard index) are exposed via `/api/xai/stability-test` for independent inspection.
