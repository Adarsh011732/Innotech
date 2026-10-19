# Innotech | Fintrixity Financial Intelligence Platform

An intelligent, full-stack personal finance and liquidity management platform engineered with a modern **React 19 + Vite + Tailwind CSS** frontend and a high-performance **Python FastAPI** analytical backend.

---

## 🌟 Key Features

- **Modern Executive Dashboard:**
  - Black + Radiant Orange aesthetic (`#08090C` / `#111217` / `#FF5722`) inspired by modern fintech command centers.
  - Interactive productivity goals tracker, progress rings, and scheduled financial tasks.
  - Smooth micro-interactions, card hover lifts, animated checklists, and context menus.

- **Multi-Horizon Cash Flow Forecast:**
  - 30, 60, and 90-day trajectory modeling with 90% confidence intervals.
  - Early liquidity warning detection and zero-income solvency runway estimations.

- **Goals & Constrained Recourse Optimization:**
  - Feasibility evaluations for primary financial milestones (e.g. 6-Month Emergency Reserve).
  - Pareto-optimal recourse profiles (*Accelerated Target*, *Balanced Pace*, *Smart Optimization*) with actionable monthly category adjustments.

- **Interactive What-If Simulator:**
  - Real-time debounced simulation of category expenditure adjustments and emergency financial shocks.
  - Instant visibility into liquidity runway impact.

- **Explainability & Factor Attribution:**
  - Feature impact rankings identifying primary buffers and solvency risks.
  - Robustness verification across market noise and volatility perturbations.

- **Transaction Ledger & 1-Click Category Override:**
  - Filterable, searchable transaction ledger with persistent category reclassification.

---

## 🏗️ Project Architecture

```
Innotech/
├── backend/                  # FastAPI Python backend & analytics
│   ├── app/
│   │   ├── api/              # REST API endpoints (accounts, forecast, goals, simulate, xai)
│   │   ├── core/             # Configuration & logging
│   │   ├── db/               # SQLite database session & models
│   │   ├── ml/               # Cashflow regression, recourse optimization, TreeSHAP
│   │   └── main.py           # FastAPI entrypoint
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React 19 + Vite + Tailwind CSS application
│   ├── src/
│   │   ├── components/       # Dashboard, ForecastView, GoalsView, SimulatorView, etc.
│   │   ├── App.jsx           # Main application state & view routing
│   │   ├── index.css         # Custom animations & Tailwind base
│   │   └── main.jsx          # React DOM entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── data/                     # Data stores
├── docs/                     # Specifications, PRD, and Technical Architecture
├── run.py                    # Server startup script
└── test_api.py               # API verification suite
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** & **npm**

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server (from repository root)
cd ..
python run.py
```
The API server will run at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```

To compile production assets:
```bash
npm run build
```
The FastAPI backend automatically serves the built static assets from `frontend/dist`.

---

## 📄 Documentation

Comprehensive product and technical documentation is available in the [`docs/`](./docs) directory:
- [1_PRD.md](./docs/1_PRD.md) - Product Requirements Document
- [2_TECHNICAL_ARCHITECTURE.md](./docs/2_TECHNICAL_ARCHITECTURE.md) - System Architecture & ML Specifications
- [3_SECURITY_AND_ACCESS.md](./docs/3_SECURITY_AND_ACCESS.md) - Security, Access Controls & Privacy Policies
- [4_FRONTEND_SPEC.md](./docs/4_FRONTEND_SPEC.md) - Frontend Architecture & Design System Spec
- [5_FEATURE_TICKET_LIST.md](./docs/5_FEATURE_TICKET_LIST.md) - Sprint Task & Implementation Backlog

---

## 📜 License

MIT License.
