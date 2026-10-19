import React, { useState, useEffect } from 'react';
import { Sliders, Zap, TrendingUp, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

export default function SimulatorView() {
  const [diningPct, setDiningPct] = useState(-20);
  const [entPct, setEntPct] = useState(0);
  const [shockVal, setShockVal] = useState(0);

  const [simResults, setSimResults] = useState({
    simulated_feasibility: 0.99,
    original_feasibility: 0.98,
    simulated_liquidity_days: 174,
    original_liquidity_days: 174,
    status_summary: 'Spending adjustment of -$59.67/mo and emergency shock of $0.00 maintains 99% goal achievement runway.'
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
          one_off_shock_amount: shock,
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

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#090A0D]">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Interactive Budget & Shock Simulator</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-semibold">
            Live Preview
          </span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5 font-medium">
          Model discretionary spending adjustments or sudden one-off expenses and observe immediate runway impacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-[#13161C] border border-white/[0.07] rounded-xl p-5 text-white shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-xs font-semibold text-white flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>Simulation Levers</span>
            </h3>
            {isSimulating && (
              <span className="text-[11px] font-mono text-[#FF5722] animate-pulse">Computing recalculation...</span>
            )}
          </div>

          {/* Slider 1: Dining & Takeout */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium mb-1.5">
              <span className="text-zinc-300">Dining & Takeout Adjustment</span>
              <span className={`font-mono font-bold tabular-nums ${diningPct < 0 ? 'text-emerald-400' : diningPct > 0 ? 'text-[#FF5722]' : 'text-zinc-400'}`}>
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
              className="w-full accent-[#FF5722] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
              <span>-60% (Frugal)</span>
              <span>0% (Baseline)</span>
              <span>+60% (Increased)</span>
            </div>
          </div>

          {/* Slider 2: Entertainment & Subscriptions */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium mb-1.5">
              <span className="text-zinc-300">Entertainment & Leisure Adjustment</span>
              <span className={`font-mono font-bold tabular-nums ${entPct < 0 ? 'text-emerald-400' : entPct > 0 ? 'text-[#FF5722]' : 'text-zinc-400'}`}>
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
              className="w-full accent-[#FF5722] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
              <span>-60% (Frugal)</span>
              <span>0% (Baseline)</span>
              <span>+60% (Increased)</span>
            </div>
          </div>

          {/* Slider 3: One-off Emergency Expense */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium mb-1.5">
              <span className="text-zinc-300">Simulated Emergency Shock</span>
              <span className="font-mono font-bold text-[#FF5722] tabular-nums">
                -${shockVal.toLocaleString()}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="250"
              value={shockVal}
              onChange={(e) => setShockVal(Number(e.target.value))}
              className="w-full accent-[#FF5722] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
              <span>$0 (None)</span>
              <span>$5,000 (Major Repair)</span>
              <span>$10,000 (Severe Shock)</span>
            </div>
          </div>
        </div>

        {/* Live Comparison Delta Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#13161C] border border-white/[0.07] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>Before vs After Comparison</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-400">
                Instant Delta
              </span>
            </div>

            <div className="space-y-3">
              {/* Metric 1: Feasibility Delta */}
              <div className="bg-[#0E1015] p-3 rounded-lg border border-white/[0.06]">
                <span className="text-[11px] text-zinc-400 font-medium">Goal Completion Likelihood</span>
                <div className="flex items-baseline justify-between mt-1">
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-xs text-zinc-500 line-through">
                      {Math.round(simResults.original_feasibility * 100)}%
                    </span>
                    <span className="text-xl font-bold text-white">
                      {Math.round(simResults.simulated_feasibility * 100)}%
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
                    simResults.simulated_feasibility >= simResults.original_feasibility 
                      ? 'text-emerald-400 bg-emerald-500/10' 
                      : 'text-[#FF5722] bg-[#FF5722]/10'
                  }`}>
                    {simResults.simulated_feasibility >= simResults.original_feasibility ? '+' : ''}
                    {Math.round((simResults.simulated_feasibility - simResults.original_feasibility) * 100)}%
                  </span>
                </div>
              </div>

              {/* Metric 2: Liquidity Runway Delta */}
              <div className="bg-[#0E1015] p-3 rounded-lg border border-white/[0.06]">
                <span className="text-[11px] text-zinc-400 font-medium">Projected Liquidity Runway</span>
                <div className="flex items-baseline justify-between mt-1">
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-xs text-zinc-500 line-through">
                      {simResults.original_liquidity_days}D
                    </span>
                    <span className="text-xl font-bold text-white">
                      {simResults.simulated_liquidity_days} Days
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
                    simResults.simulated_liquidity_days >= simResults.original_liquidity_days 
                      ? 'text-emerald-400 bg-emerald-500/10' 
                      : 'text-[#FF5722] bg-[#FF5722]/10'
                  }`}>
                    {simResults.simulated_liquidity_days >= simResults.original_liquidity_days ? '+' : ''}
                    {simResults.simulated_liquidity_days - simResults.original_liquidity_days} Days
                  </span>
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-[11px] text-zinc-400 leading-relaxed p-3 bg-[#0E1015] rounded-lg border border-white/[0.06]">
                {simResults.status_summary}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] mt-3 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Profile remains resilient under simulated conditions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
