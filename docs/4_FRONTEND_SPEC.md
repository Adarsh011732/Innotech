# Frontend UI/UX Specification & Design Tokens
## Project Name: EXT-093 FinGuard Assistant
**Subtitle:** Glassmorphic Interface Design, Visual Design Tokens, and Interactive HCI Workflows  
**Project Code:** EXT-093 / Innotech-FinGuard  
**Document Version:** 1.0  
**Target Milestone:** Production MVP & Core Engine Release  
**Status:** Approved for Implementation  

---

## 1. UI/UX Design Philosophy & Technology Stack

The frontend interface of **EXT-093 FinGuard Assistant** is engineered as a high-performance **Single Page Application (SPA)** using **React 19, Vite, and Tailwind CSS v3.4**, directly mirroring the visual design, typography, spacing, and micro-interactions of the reference design specification (`image.png`) with the colorway of `image copy.png`.

Key technology foundations:
* **Core Framework:** React 19 + Vite (instant HMR, sub-15ms dev rebuilds, 296 kB production bundle).
* **Styling Engine:** Tailwind CSS with custom dark tokens (`#0D0F12`, `#111216`, `#17191E`, `#1C1E24`) and hardware-accelerated animations.
* **Component Architecture:**
  - `src/components/Sidebar.jsx`: Navigation, search box (`⌘K`), feature badges, and Zero-Knowledge verification card.
  - `src/components/Header.jsx`: Breadcrumbs, persona switcher, notification icons, and quick action buttons.
  - `src/components/Overview.jsx`: 3-card metric hero row, 2×2 wallet grid, interactive bar flow chart with floating tooltips, and recent activities table.
  - `src/components/ForecastView.jsx`: Conformal Quantile Regression (CQR) fan chart with 90% confidence bands.
  - `src/components/GoalsView.jsx`: Goal progress gauge + 3 Pareto-optimal CFRO recourse profiles.
  - `src/components/SimulatorView.jsx`: What-If interactive sliders with live debounced impact recalculation.
  - `src/components/XaiView.jsx`: TreeSHAP waterfall feature contributions and perturbation stability tests.
  - `src/components/CategoryOverrideModal.jsx`: 1-click human-in-the-loop category reclassification modal.
* **Iconography:** Lucide React icons.
* **Zero Cognitive Fatigue:** Deep obsidian surfaces, subtle frosted borders, high-contrast typography, and zero continuous CPU loop rendering.

---

## 2. Design System & CSS Token Specifications

The UI is implemented in vanilla CSS3 using standardized custom properties (CSS variables) to ensure unified theming, rapid maintainability, and zero runtime bundler overhead.

```css
:root {
  /* Color Palette - Core System */
  --bg-primary: #0b0f19;          /* Deep Obsidian Void */
  --bg-secondary: #111827;        /* Rich Slate Base */
  --bg-card: rgba(17, 24, 39, 0.75); /* Frosted Glass Layer */
  --border-glass: rgba(255, 255, 255, 0.08); /* Specular Edge Highlight */
  
  /* Text & Contrast Tokens */
  --text-primary: #f9fafb;        /* High-Contrast Crisp White */
  --text-secondary: #9ca3af;      /* Muted Steel Gray */
  --text-tertiary: #6b7280;       /* Subdued Slate */
  
  /* Accent & State Tokens */
  --accent-cyan: #06b6d4;         /* Electric Cyan (Forecasting / Median) */
  --accent-blue: #3b82f6;         /* Primary Brand Blue */
  --accent-purple: #8b5cf6;       /* Recourse & Optimizer Highlights */
  --status-success: #10b981;      /* Emerald Green (Solvent / Safe) */
  --status-warning: #f59e0b;      /* Warm Amber (Moderate Uncertainty) */
  --status-danger: #ef4444;       /* Crimson Red (Liquidity Shortfall / Risk) */
  
  /* Typography & Layout Spacing */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --shadow-elevation: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
}
```

---

## 3. Global Layout Architecture & App Shell

```
+-----------------------------------------------------------------------------------+
|  [ TOP APPLICATION HEADER ]                                                       |
|  - Brand Badge: [EXT-093] | Title: Personal Finance Risk & Goal Planning Assistant|
|  - Interactive Persona Selector: [Salaried Tech Pro | Volatile Freelancer | Student]|
|  - Security Pill: [Local-First / Zero Cloud Storage (Verified)]                   |
+-----------------------------------------------------------------------------------+
|  [ SIDEBAR NAV ]    |  [ MAIN CONTENT CONTAINER ]                                 |
|  - Overview         |  (Dynamically rendered interactive tab panels)              |
|  - Cash-Flow        |                                                             |
|  - Goals & Recourse |  Active Viewport Content:                                   |
|  - What-If Sim      |  - Metric KPI Grids & Stat Cards                            |
|  - Transactions     |  - High-Resolution Canvas Charts (Chart.js)                 |
|  - Explainability   |  - Reactive Recourse Profiles & Action Buttons              |
+---------------------+-------------------------------------------------------------+
```

---

## 4. Component Specifications across 6 Core Tabs

### 4.1 Tab 1: Overview & Solvency Dashboard
* **Solvency Score Gauge:** Circular progress visual ($0 - 100$) dynamically colored according to risk bracket (Emerald: $75+$, Amber: $50-74$, Red: $<50$).
* **Runway Days Counter:** Real-time liquidity exhaustion estimate based on current cash burn rate.
* **Balance Sheet Summary Cards:** Total Liquid Cash, Monthly Discretionary Outflow, and 30-Day Net Inflow.
* **Key Risk Drivers Card:** Highlights top 3 algorithmic vulnerabilities (e.g., *"Elevated dining volatility"*, *"Upcoming quarterly tax liability"*).

### 4.2 Tab 2: Cash-Flow Forecast (CQR Conformal Fan Charts)
* **Time-Horizon Switcher:** Segmented control for 30-day, 60-day, and 90-day predictive windows.
* **Conformal Fan Visualization:**
  - **Upper Bound ($q_{90}$):** Semi-transparent cyan fill representing best-case balance trajectory.
  - **Median ($q_{50}$):** Solid electric cyan line displaying expected balance trajectory.
  - **Worst-Case ($q_{10}$):** Semi-transparent crimson/amber fill displaying lower 10th percentile safety floor.
* **Shortfall Alert Banner:** Conditional banner triggered automatically whenever $\min(q_{10}) \le \$0.00$, warning user of imminent deficit risk with exact predicted date.

### 4.3 Tab 3: Goals & Constrained Recourse (CFRO)
* **Goal Overview Card:** Displays goal title, target dollar milestone, accumulated savings, and estimated progress percentage.
* **Feasibility Meter:** Probabilistic Monte Carlo feasibility score ($\ge 80\%$ required for sustainable attainment).
* **3-Column Recourse Cards:**
  - **Profile A (Balanced Recourse):** Low-friction across-the-board trims.
  - **Profile B (Aggressive Cut):** High-impact discretionary austerity.
  - **Profile C (Horizon Extension):** Extended calendar timeline with existing monthly spend.
* **1-Click Apply Recourse Button:** Commits chosen profile to local database budget constraints.

### 4.4 Tab 4: Interactive What-If Scenario Simulator
* **Emergency Expense Slider:** Sliders ranging from $\$0$ to $\$5,000$ to simulate sudden car/medical repairs.
* **Income Shock Slider:** Sliders ranging from $-50\%$ to $+50\%$ to simulate freelance contract dropouts or overtime bonuses.
* **Live Re-calculation:** Instantly recomputes Solvency Score, Runway Days, and Goal Feasibility without database mutations.

### 4.5 Tab 5: Transaction Ledger & Human-in-the-Loop Override
* **Data Grid:** Sortable table displaying date, merchant description, account, amount, category badge, and AI confidence score.
* **Category Badge Styler:** Distinct color tokens for Essential (Indigo) vs. Discretionary (Teal).
* **1-Click Override Modal:** Allows user to click any miscategorized transaction and instantly reassign it, automatically recording an entry in `audit_logs`.

### 4.6 Tab 6: Explainability & Stability (XAI)
* **TreeSHAP Feature Waterfall:** Horizontal bar chart illustrating positive and negative feature weights on the solvency prediction.
* **Perturbation Stability Runner:** Interactive test button injecting $5\%-10\%$ synthetic noise into financial vectors and verifying Kendall's $\tau$ rank correlation in real time.
