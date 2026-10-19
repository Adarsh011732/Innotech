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
    <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-9 lg:py-8 space-y-6 select-none bg-[#08090C]">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Interactive Budget & Shock Simulator</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-bold">
            Live Preview
          </span>
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
          Test potential budget cuts or unexpected one-off expenses and observe instant shifts in financial runway and target completion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-[#111217] border border-[#222530] rounded-3xl p-6 text-white shadow-xl card-interactive space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E202B]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#FF5722]" />
              <span>Budget Levers</span>
            </h3>
            {isSimulating && (
              <span className="text-[11px] text-[#FF5722] animate-pulse font-semibold">Updating projections...</span>
            )}
          </div>

          {/* Slider 1: Dining & Takeout */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#9CA3AF]">Dining & Takeout Adjustment</span>
              <span className={`font-mono font-bold ${diningPct < 0 ? 'text-emerald-400' : diningPct > 0 ? 'text-red-400' : 'text-white'}`}>
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
            <div className="flex justify-between text-[10px] text-[#6B7280] mt-1">
              <span>-60% (Frugal)</span>
              <span>0% (No change)</span>
              <span>+60% (Increased)</span>
            </div>
          </div>

          {/* Slider 2: Entertainment & Subscriptions */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#9CA3AF]">Entertainment & Leisure Adjustment</span>
              <span className={`font-mono font-bold ${entPct < 0 ? 'text-emerald-400' : entPct > 0 ? 'text-red-400' : 'text-white'}`}>
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
            <div className="flex justify-between text-[10px] text-[#6B7280] mt-1">
              <span>-60% (Frugal)</span>
              <span>0% (No change)</span>
              <span>+60% (Increased)</span>
            </div>
          </div>

          {/* Slider 3: One-off Emergency Expense */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#9CA3AF]">Simulated Emergency Expense (Car/Medical/Home)</span>
              <span className="font-mono font-bold text-red-400">
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
            <div className="flex justify-between text-[10px] text-[#6B7280] mt-1">
              <span>$0 (None)</span>
              <span>$5,000 (Major Repair)</span>
              <span>$10,000 (Severe Emergency)</span>
            </div>
          </div>
        </div>

        {/* Live Impact Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#111217] border border-[#222530] rounded-3xl p-6 text-white shadow-xl card-interactive flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E202B] mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF5722]" />
                <span>Simulated Outcomes</span>
              </h3>
              <span className="text-xs font-bold text-[#FF5722] bg-[#FF5722]/10 px-2.5 py-0.5 rounded-full border border-[#FF5722]/20">
                Real-Time
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0E0F14] p-4 rounded-2xl border border-[#1E202B]">
                <span className="text-xs text-[#9CA3AF]">Goal Completion Likelihood</span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {Math.round(simResults.simulated_feasibility * 100)}%
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">
                  Baseline: {Math.round(simResults.original_feasibility * 100)}%
                </div>
              </div>

              <div className="bg-[#0E0F14] p-4 rounded-2xl border border-[#1E202B]">
                <span className="text-xs text-[#9CA3AF]">Projected Liquidity Runway</span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {simResults.simulated_liquidity_days} Days
                </div>
                <div className="text-xs text-[#9CA3AF] mt-1">
                  Baseline: {simResults.original_liquidity_days} Days
                </div>
              </div>

              <p className="text-xs text-[#9CA3AF] leading-relaxed p-3 bg-[#0E0F14] rounded-2xl border border-[#1E202B]">
                {simResults.status_summary}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E202B] flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Financially sustainable profile under tested conditions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
