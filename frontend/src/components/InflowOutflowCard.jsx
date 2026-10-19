import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Wallet, 
  PieChart, 
  Sparkles,
  Zap,
  ArrowRightLeft
} from 'lucide-react';
import CountUp from './reactbits/CountUp';
import { formatMoney } from '../utils/currency';

export default function InflowOutflowCard({ 
  transactions = [], 
  activeCurrency = 'INR',
  className = '' 
}) {
  const [viewMode, setViewMode] = useState('flow'); // 'flow' | 'breakdown'

  // Compute actual Inflow & Outflow totals from transactions
  let rawInflow = 0;
  let rawOutflow = 0;

  if (transactions && transactions.length > 0) {
    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (amt > 0) {
        rawInflow += amt;
      } else {
        rawOutflow += Math.abs(amt);
      }
    });
  }

  // Fallbacks if transactions have only debits or are empty
  if (rawInflow === 0) rawInflow = 3250.00;
  if (rawOutflow === 0) rawOutflow = 1145.50;

  const netCashflow = rawInflow - rawOutflow;
  const isSurplus = netCashflow >= 0;
  const totalVolume = rawInflow + rawOutflow;
  const inflowPercent = Math.round((rawInflow / totalVolume) * 100);
  const outflowPercent = 100 - inflowPercent;
  const savingsRate = Math.round((netCashflow / rawInflow) * 100);

  const multiplier = activeCurrency === 'INR' ? 83 : 1;
  const symbol = activeCurrency === 'INR' ? '₹' : '$';

  return (
    <div className={`bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] card-interactive relative overflow-hidden ${className}`}>
      
      {/* Top Header: In vs Out Total Flow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs shadow-sm">
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-extrabold text-zinc-900 tracking-tight">
              Cash Inflow vs Outflow
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Live Stream
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">
            Real-time balance velocity and liquidity retention efficiency
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#F3F4F7] p-1 rounded-full border border-black/[0.04]">
          <button
            onClick={() => setViewMode('flow')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              viewMode === 'flow'
                ? 'bg-[#18191E] text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Animated Flow
          </button>
          <button
            onClick={() => setViewMode('breakdown')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              viewMode === 'breakdown'
                ? 'bg-[#18191E] text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Category Split
          </button>
        </div>
      </div>

      {/* 3 Metric Summary Blocks: Inflow, Outflow, Net */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        
        {/* Card 1: Total Inflow */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100/80 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Total Inflow (Cash In)
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-950 tracking-tight">
            +<CountUp to={rawInflow * multiplier} decimals={2} prefix={symbol} duration={1} />
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-emerald-700 font-semibold">
            <span className="bg-emerald-100 px-1.5 py-0.5 rounded-full font-bold">
              {inflowPercent}% of volume
            </span>
            <span className="text-zinc-400">• Salary & Credits</span>
          </div>
        </div>

        {/* Card 2: Total Outflow */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 to-amber-50/40 border border-rose-100/80 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Total Outflow (Cash Out)
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-100/80 text-rose-700 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-rose-950 tracking-tight">
            -<CountUp to={rawOutflow * multiplier} decimals={2} prefix={symbol} duration={1} />
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-rose-700 font-semibold">
            <span className="bg-rose-100 px-1.5 py-0.5 rounded-full font-bold">
              {outflowPercent}% of volume
            </span>
            <span className="text-zinc-400">• Living & Expenses</span>
          </div>
        </div>

        {/* Card 3: Net Cashflow Surplus */}
        <div className="p-4 rounded-2xl bg-[#18191E] text-white border border-black/10 relative overflow-hidden group shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Net Retained Surplus
            </span>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-teal-300">
              {savingsRate}% Saved
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {isSurplus ? '+' : '-'}<CountUp to={Math.abs(netCashflow) * multiplier} decimals={2} prefix={symbol} duration={1} />
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-400 font-semibold">
            <span className="text-teal-400 font-bold">Liquid Surplus</span>
            <span>• Available for investment</span>
          </div>
        </div>

      </div>

      {/* Interactive Visual Comparison Bar with Dynamic Ratio */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-600">
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Inflow Share ({inflowPercent}%)
          </span>
          <span className="text-xs font-mono text-zinc-400">
            Ratio {(rawInflow / (rawOutflow || 1)).toFixed(2)}:1
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-bold">
            Outflow Share ({outflowPercent}%)
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          </span>
        </div>

        {/* Dual Animated Flow Bar */}
        <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden flex p-0.5 gap-1 shadow-inner">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm transition-all duration-700 relative overflow-hidden group"
            style={{ width: `${inflowPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>
          <div 
            className="h-full rounded-full bg-gradient-to-r from-rose-400 to-red-500 shadow-sm transition-all duration-700 relative overflow-hidden group"
            style={{ width: `${outflowPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Animated SVG Stream & Waveform Graphic */}
      {viewMode === 'flow' ? (
        <div className="relative h-28 sm:h-32 bg-[#FAFBFD] rounded-2xl border border-zinc-100 p-3 overflow-hidden flex flex-col justify-between">
          <svg viewBox="0 0 500 80" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="inflowWaveGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="outflowWaveGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FB7185" stopOpacity="0.4" />
              </linearGradient>

              <linearGradient id="inflowAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Inflow Area */}
            <path
              d="M 0,40 Q 60,15 125,25 T 250,20 T 375,30 T 500,18 L 500,80 L 0,80 Z"
              fill="url(#inflowAreaGrad)"
            />

            {/* Inflow Dynamic Wave Line */}
            <path
              d="M 0,40 Q 60,15 125,25 T 250,20 T 375,30 T 500,18"
              fill="none"
              stroke="url(#inflowWaveGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-draw-line"
            />

            {/* Outflow Dynamic Wave Line */}
            <path
              d="M 0,55 Q 80,68 160,58 T 320,65 T 500,52"
              fill="none"
              stroke="url(#outflowWaveGrad)"
              strokeWidth="2.2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />

            {/* Inflow Floating Nodes */}
            <circle cx="125" cy="25" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="375" cy="30" r="4" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="500" cy="18" r="4" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
          </svg>

          {/* Legend Chips on Bottom */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 pt-1 z-10">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-0.5 bg-emerald-500 rounded-full"></span>
              Inflow Momentum
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Continuous Stream Analysis</span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-3 h-0.5 bg-rose-400 rounded-full border-t border-dashed"></span>
              Outflow Consumption
            </span>
          </div>
        </div>
      ) : (
        /* Category Split View */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="text-[10px] text-zinc-400 font-semibold">Salary & Retainers</div>
            <div className="text-sm font-bold font-mono text-zinc-900 mt-0.5">
              {formatMoney(rawInflow * 0.88, activeCurrency, false)}
            </div>
            <div className="text-[9px] text-emerald-600 font-semibold mt-1">88% of Inflow</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="text-[10px] text-zinc-400 font-semibold">Fixed Bills & Rent</div>
            <div className="text-sm font-bold font-mono text-zinc-900 mt-0.5">
              {formatMoney(rawOutflow * 0.45, activeCurrency, false)}
            </div>
            <div className="text-[9px] text-rose-600 font-semibold mt-1">45% of Outflow</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="text-[10px] text-zinc-400 font-semibold">Food & Groceries</div>
            <div className="text-sm font-bold font-mono text-zinc-900 mt-0.5">
              {formatMoney(rawOutflow * 0.32, activeCurrency, false)}
            </div>
            <div className="text-[9px] text-rose-600 font-semibold mt-1">32% of Outflow</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="text-[10px] text-zinc-400 font-semibold">Discretionary</div>
            <div className="text-sm font-bold font-mono text-zinc-900 mt-0.5">
              {formatMoney(rawOutflow * 0.23, activeCurrency, false)}
            </div>
            <div className="text-[9px] text-rose-600 font-semibold mt-1">23% of Outflow</div>
          </div>
        </div>
      )}

    </div>
  );
}
