import React, { useState, useEffect } from 'react';
import { Sliders, Zap, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, RotateCcw, ArrowRight } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import CountUp from './reactbits/CountUp';
import AnimatedContent from './reactbits/AnimatedContent';

export default function SimulatorView() {
  const [diningPct, setDiningPct] = useState(-20);
  const [entPct, setEntPct] = useState(0);
  const [shockVal, setShockVal] = useState(0);

  const [simResults, setSimResults] = useState({
    simulated_feasibility: 0.99,
    original_feasibility: 0.98,
    simulated_liquidity_days: 185,
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

  const handleResetSliders = () => {
    setDiningPct(0);
    setEntPct(0);
    setShockVal(0);
  };

  const deltaRunway = simResults.simulated_liquidity_days - simResults.original_liquidity_days;
  const deltaFeasibility = (simResults.simulated_feasibility - simResults.original_feasibility) * 100;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#08090C] relative">
      {/* Ambient Top Glow strictly in upper half */}
      <div className="pointer-events-none absolute top-0 left-1/3 right-1/3 h-[300px] bg-[#FF5722]/10 blur-[120px] rounded-full -translate-y-1/2"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Interactive Budget & Shock Simulator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-bold">
              Real-Time Sensitivity
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
            Test discretionary spending levers and unexpected one-off liquidity shocks with instant delta forecasting.
          </p>
        </div>

        <button 
          onClick={handleResetSliders}
          className="relative hover:z-20 flex items-center gap-2 bg-[#14161E] border border-[#232634] text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-[#1E202B] hover:border-[#FF5722]/40 transition-all active:scale-95 btn-interactive self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span>Reset Levers</span>
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-[#111217] border border-[#222530] rounded-3xl p-6 text-white shadow-xl card-interactive space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E202B]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#FF5722]" />
              <span>Budget Levers</span>
            </h3>
            {isSimulating ? (
              <span className="text-[11px] text-[#FF5722] animate-pulse font-semibold">Simulating model...</span>
            ) : (
              <span className="text-[11px] text-zinc-500 font-mono">Live Bound</span>
            )}
          </div>

          {/* Slider 1: Dining & Takeout */}
          <div className="bg-[#0C0D12] p-4 rounded-2xl border border-white/[0.05]">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#9CA3AF]">Dining & Takeout Adjustment</span>
              <span className={`font-mono font-bold text-sm ${diningPct < 0 ? 'text-emerald-400' : diningPct > 0 ? 'text-red-400' : 'text-white'}`}>
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
            <div className="flex justify-between text-[10px] text-[#6B7280] mt-1.5 font-mono">
              <span>-60% (Frugal)</span>
              <span>0% (Baseline)</span>
              <span>+60% (Expansion)</span>
            </div>
          </div>

          {/* Slider 2: Entertainment & Subscriptions */}
          <div className="bg-[#0C0D12] p-4 rounded-2xl border border-white/[0.05]">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#9CA3AF]">Entertainment & Leisure Adjustment</span>
              <span className={`font-mono font-bold text-sm ${entPct < 0 ? 'text-emerald-400' : entPct > 0 ? 'text-red-400' : 'text-white'}`}>
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
            <div className="flex justify-between text-[10px] text-[#6B7280] mt-1.5 font-mono">
              <span>-60% (Frugal)</span>
              <span>0% (Baseline)</span>
              <span>+60% (Expansion)</span>
            </div>
          </div>

          {/* Slider 3: One-off Emergency Expense */}
          <div className="bg-[#0C0D12] p-4 rounded-2xl border border-white/[0.05]">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#9CA3AF]">Simulated Out-of-Pocket Shock (Medical / Home / Auto)</span>
              <span className="font-mono font-bold text-sm text-red-400">
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
            <div className="flex justify-between text-[10px] text-[#6B7280] mt-1.5 font-mono">
              <span>$0 (No Shock)</span>
              <span>$5,000 (Major Incident)</span>
              <span>$10,000 (Catastrophic)</span>
            </div>
          </div>
        </div>

        {/* Live Impact Card (5 cols) with SpotlightCard & Visual Comparison Bars */}
        <div className="lg:col-span-5">
          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.16)"
            className="p-6 text-white shadow-2xl flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1E202B] mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF5722]" />
                  <span>Simulated Outcome Delta</span>
                </h3>
                <span className="text-xs font-mono font-bold text-[#FF5722] bg-[#FF5722]/10 px-2.5 py-0.5 rounded-full border border-[#FF5722]/20">
                  Model Output
                </span>
              </div>

              {/* Metric 1: Feasibility Comparison */}
              <div className="space-y-4 mb-5">
                <div className="bg-[#0C0D12] p-4 rounded-2xl border border-white/[0.05]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs text-[#9CA3AF]">Goal Completion Feasibility</span>
                      <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
                        {Math.round(simResults.simulated_feasibility * 100)}%
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${deltaFeasibility >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                      {deltaFeasibility >= 0 ? `+${deltaFeasibility.toFixed(0)}%` : `${deltaFeasibility.toFixed(0)}%`} vs Base
                    </span>
                  </div>

                  {/* Visual Bar Comparison */}
                  <div className="space-y-1.5 mt-3">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Baseline: {Math.round(simResults.original_feasibility * 100)}%</span>
                      <span>Scenario: {Math.round(simResults.simulated_feasibility * 100)}%</span>
                    </div>
                    <div className="w-full bg-[#181A22] h-2 rounded-full overflow-hidden border border-white/[0.05]">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${simResults.simulated_feasibility >= 0.9 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-red-500'}`}
                        style={{ width: `${Math.round(simResults.simulated_feasibility * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Metric 2: Liquidity Runway Comparison */}
                <div className="bg-[#0C0D12] p-4 rounded-2xl border border-white/[0.05]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs text-[#9CA3AF]">Projected Liquidity Runway</span>
                      <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
                        {simResults.simulated_liquidity_days} Days
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${deltaRunway >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                      {deltaRunway >= 0 ? `+${deltaRunway} Days` : `${deltaRunway} Days`}
                    </span>
                  </div>

                  {/* Visual Bar Comparison */}
                  <div className="space-y-1.5 mt-3">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Baseline: {simResults.original_liquidity_days}d</span>
                      <span>Scenario: {simResults.simulated_liquidity_days}d</span>
                    </div>
                    <div className="w-full bg-[#181A22] h-2 rounded-full overflow-hidden border border-white/[0.05]">
                      <div 
                        className="bg-gradient-to-r from-[#FF5722] to-[#FFA000] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((simResults.simulated_liquidity_days / 240) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary Recommendation Box */}
            <div className="bg-[#FF5722]/10 border border-[#FF5722]/30 rounded-2xl p-4 text-xs text-white">
              <div className="flex items-center gap-2 font-bold text-[#FF5722] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Simulation Recommendation</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                {simResults.status_summary || 'Applying this spending profile maintains safe cash reserves.'}
              </p>
            </div>
          </SpotlightCard>
        </div>

      </div>
    </div>
  );
}
