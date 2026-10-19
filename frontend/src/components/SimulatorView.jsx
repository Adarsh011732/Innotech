import React, { useState, useEffect } from 'react';
import { Sliders, Zap, TrendingUp, AlertTriangle, ShieldCheck, RotateCcw } from 'lucide-react';
import { formatMoney } from '../utils/currency';

export default function SimulatorView({ activeCurrency = 'INR' }) {
  const [diningPct, setDiningPct] = useState(-20);
  const [entPct, setEntPct] = useState(0);
  const [shockVal, setShockVal] = useState(0);

  const [simResults, setSimResults] = useState({
    simulated_feasibility: 0.99,
    original_feasibility: 0.98,
    simulated_liquidity_days: 185,
    original_liquidity_days: 174,
    status_summary: 'Spending adjustment maintains 99% goal achievement runway with comfortable emergency liquidity.'
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async (dining, ent, shock) => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/simulate/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spending_adjustments: {
            'Dining & Takeout': dining,
            'Entertainment': ent
          },
          one_off_shock_amount: activeCurrency === 'INR' ? shock / 83 : shock,
          monthly_income_delta: 0
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimResults(data);
      }
    } catch (e) {
      console.error('Simulation error', e);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation(diningPct, entPct, shockVal);
    }, 150);
    return () => clearTimeout(timer);
  }, [diningPct, entPct, shockVal]);

  const handleResetSliders = () => {
    setDiningPct(0);
    setEntPct(0);
    setShockVal(0);
  };

  const deltaRunway = simResults.simulated_liquidity_days - simResults.original_liquidity_days;
  const deltaFeasibility = (simResults.simulated_feasibility - simResults.original_feasibility) * 100;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F4F6FA] text-zinc-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
            <span>Budget Simulator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-bold">
              Real-Time Sensitivity
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Test discretionary spending adjustments and unexpected liquidity shocks with instant delta forecasting.
          </p>
        </div>

        <button 
          onClick={handleResetSliders}
          className="flex items-center gap-2 bg-white border border-black/[0.08] text-zinc-800 text-xs font-semibold px-4 py-2 rounded-full hover:bg-zinc-100 shadow-sm transition-all active:scale-95 btn-interactive self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
          <span>Reset Levers</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] card-interactive space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Budget Levers</span>
            </h3>
            {isSimulating ? (
              <span className="text-[11px] text-teal-600 animate-pulse font-semibold">Simulating model...</span>
            ) : (
              <span className="text-[11px] text-zinc-400 font-mono">Live Bound</span>
            )}
          </div>

          {/* Slider 1: Dining & Takeout */}
          <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-zinc-600">Dining & Takeout (Swiggy / Zomato)</span>
              <span className={`font-mono font-bold text-sm ${diningPct < 0 ? 'text-emerald-600' : diningPct > 0 ? 'text-red-500' : 'text-zinc-900'}`}>
                {diningPct > 0 ? `+${diningPct}%` : `${diningPct}%`}
              </span>
            </div>
            <input 
              type="range" 
              min="-60" 
              max="60" 
              step="5"
              value={diningPct}
              onChange={(e) => setDiningPct(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
              <span>-60% (Frugal)</span>
              <span>0% (Baseline)</span>
              <span>+60% (Expansion)</span>
            </div>
          </div>

          {/* Slider 2: Entertainment & Subscriptions */}
          <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-zinc-600">Entertainment & Leisure</span>
              <span className={`font-mono font-bold text-sm ${entPct < 0 ? 'text-emerald-600' : entPct > 0 ? 'text-red-500' : 'text-zinc-900'}`}>
                {entPct > 0 ? `+${entPct}%` : `${entPct}%`}
              </span>
            </div>
            <input 
              type="range" 
              min="-60" 
              max="60" 
              step="5"
              value={entPct}
              onChange={(e) => setEntPct(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
              <span>-60% (Frugal)</span>
              <span>0% (Baseline)</span>
              <span>+60% (Expansion)</span>
            </div>
          </div>

          {/* Slider 3: One-off Emergency Expense */}
          <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-zinc-600">Simulated Emergency Out-of-Pocket Expense</span>
              <span className="font-mono font-bold text-sm text-red-600">
                -{formatMoney(shockVal, activeCurrency, false)}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={activeCurrency === 'INR' ? 500000 : 6000} 
              step={activeCurrency === 'INR' ? 10000 : 250}
              value={shockVal}
              onChange={(e) => setShockVal(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
              <span>{formatMoney(0, activeCurrency, false)} (None)</span>
              <span>{formatMoney(activeCurrency === 'INR' ? 250000 : 3000, activeCurrency, false)} (Major Repair)</span>
              <span>{formatMoney(activeCurrency === 'INR' ? 500000 : 6000, activeCurrency, false)} (Emergency)</span>
            </div>
          </div>
        </div>

        {/* Live Impact Card (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] card-interactive flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-5">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-600" />
                <span>Simulated Outcome Delta</span>
              </h3>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Model Output
              </span>
            </div>

            {/* Metric 1: Feasibility Comparison */}
            <div className="space-y-4 mb-5">
              <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-zinc-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-zinc-500">Goal Completion Feasibility</span>
                    <div className="text-3xl font-extrabold text-zinc-900 font-mono mt-0.5">
                      {Math.round(simResults.simulated_feasibility * 100)}%
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${deltaFeasibility >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {deltaFeasibility >= 0 ? `+${deltaFeasibility.toFixed(0)}%` : `${deltaFeasibility.toFixed(0)}%`} vs Base
                  </span>
                </div>

                <div className="space-y-1 mt-3">
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Baseline: {Math.round(simResults.original_feasibility * 100)}%</span>
                    <span>Scenario: {Math.round(simResults.simulated_feasibility * 100)}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${simResults.simulated_feasibility >= 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.round(simResults.simulated_feasibility * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Metric 2: Liquidity Runway Comparison */}
              <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-zinc-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-zinc-500">Projected Liquidity Runway</span>
                    <div className="text-3xl font-extrabold text-zinc-900 font-mono mt-0.5">
                      {simResults.simulated_liquidity_days} Days
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${deltaRunway >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {deltaRunway >= 0 ? `+${deltaRunway} Days` : `${deltaRunway} Days`}
                  </span>
                </div>

                <div className="space-y-1 mt-3">
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Baseline: {simResults.original_liquidity_days}d</span>
                    <span>Scenario: {simResults.simulated_liquidity_days}d</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((simResults.simulated_liquidity_days / 240) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900">
            <div className="flex items-center gap-2 font-bold text-teal-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Simulation Recommendation</span>
            </div>
            <p className="text-teal-700 leading-relaxed text-[11px]">
              {simResults.status_summary || 'Applying this spending profile maintains safe cash reserves.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
