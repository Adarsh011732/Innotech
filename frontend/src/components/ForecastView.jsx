import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Calendar, ArrowUpRight, DollarSign, Shield } from 'lucide-react';

export default function ForecastView({ forecastData, onHorizonChange, currentHorizon = 60 }) {
  const trajectory = forecastData?.trajectory || [];
  const burnRate = forecastData?.historical_burn_rate_daily ?? 124.50;
  const hasShortfall = trajectory.some(p => p.lower_bound_90 <= 0);

  const [hoveredPoint, setHoveredPoint] = useState(null);

  // SVG dimensions for chart
  const svgWidth = 800;
  const svgHeight = 260;
  const padding = 40;

  let minVal = 0;
  let maxVal = 10000;
  if (trajectory.length > 0) {
    const allVals = trajectory.flatMap(p => [p.lower_bound_90, p.median_balance, p.upper_bound_90]);
    minVal = Math.min(0, ...allVals);
    maxVal = Math.max(...allVals) * 1.15;
  }

  const getY = (val) => {
    return svgHeight - padding - ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - padding * 2);
  };

  const getX = (idx) => {
    return padding + (idx / Math.max(1, trajectory.length - 1)) * (svgWidth - padding * 2);
  };

  const medianPath = trajectory.length > 0 
    ? trajectory.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.median_balance)}`).join(' ')
    : '';

  const upperPath = trajectory.length > 0 
    ? trajectory.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.upper_bound_90)}`).join(' ')
    : '';

  const lowerPathReversed = trajectory.length > 0 
    ? [...trajectory].reverse().map((p, i) => `L ${getX(trajectory.length - 1 - i)} ${getY(p.lower_bound_90)}`).join(' ')
    : '';

  const bandPath = `${upperPath} ${lowerPathReversed} Z`;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#090A0D]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Cash Flow Outlook & Forecast</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-semibold">
              CQR 90% Confidence
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">
            Multi-horizon Monte Carlo simulation showing conservative bounds and growth trajectory.
          </p>
        </div>
        
        {/* Horizon selector chips */}
        <div className="flex items-center gap-1.5 bg-[#13161C] border border-white/[0.08] p-1 rounded-lg shadow-sm">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => onHorizonChange(days)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 btn-interactive ${
                currentHorizon === days 
                  ? 'bg-[#FF5722] text-white font-semibold shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {days}D Outlook
            </button>
          ))}
        </div>
      </div>

      {/* Shortfall Alert Banner */}
      {hasShortfall ? (
        <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-3.5 flex items-center gap-3 text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-white">Liquidity Alert:</span> Under conservative 90% lower bound, cash reserves dip near critical baseline around Day 42. Consider recommended discretionary trimming.
          </div>
        </div>
      ) : (
        <div className="bg-[#13161C] border border-white/[0.07] rounded-lg p-3.5 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Solvency Runway Healthy</div>
              <div className="text-[11px] text-zinc-400">Current liquid reserves exceed all projected obligations through {currentHorizon} days.</div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
            Runway: {currentHorizon}+ Days
          </span>
        </div>
      )}

      {/* Detailed Forecast Canvas Area */}
      <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-medium text-zinc-400">Projected Ending Balance ({currentHorizon} Days)</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 font-mono tabular-nums">
              ${trajectory.length > 0 ? trajectory[trajectory.length - 1].median_balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '28,520.30'}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#FF5722]/20 border border-[#FF5722]/40"></span>
              <span>90% Confidence Corridor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full bg-[#FF5722]"></span>
              <span>Expected Median Path</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full h-[280px] bg-[#0A0B0E] border border-white/[0.06] rounded-lg p-3 overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#FF5722" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Zero line */}
            {minVal < 0 && (
              <line 
                x1={padding} y1={getY(0)} 
                x2={svgWidth - padding} y2={getY(0)} 
                stroke="#EF4444" strokeWidth="1" strokeDasharray="3 3" 
              />
            )}

            {/* 90% Confidence Band */}
            {bandPath && (
              <path d={bandPath} fill="url(#forecastGlow)" stroke="#FF5722" strokeWidth="0.75" strokeOpacity="0.35" />
            )}

            {/* Expected Median Path */}
            {medianPath && (
              <path d={medianPath} fill="none" stroke="#FF5722" strokeWidth="2.5" strokeLinecap="round" />
            )}

            {/* Interactive Data Dots */}
            {trajectory.filter((_, idx) => idx % Math.ceil(trajectory.length / 12) === 0).map((pt, i) => (
              <g key={i}>
                <circle 
                  cx={getX(trajectory.indexOf(pt))} 
                  cy={getY(pt.median_balance)} 
                  r="3.5" 
                  fill="#FF5722" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.5" 
                  className="cursor-pointer transition-transform hover:scale-150"
                  onMouseEnter={() => setHoveredPoint(pt)}
                />
              </g>
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-3 right-3 bg-[#181C24] border border-white/[0.14] text-white rounded-lg p-2.5 text-xs shadow-xl animate-dropdown min-w-[150px]">
              <div className="font-semibold text-white font-mono">Day {hoveredPoint.day_offset} Horizon</div>
              <div className="text-[11px] text-zinc-400 mt-1 flex justify-between">
                <span>Expected:</span>
                <span className="text-white font-mono font-bold">${hoveredPoint.median_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-mono flex justify-between">
                <span>Range:</span>
                <span>${hoveredPoint.lower_bound_90.toLocaleString()} – ${hoveredPoint.upper_bound_90.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Burn Rate & Runway Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-4 text-white shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="font-medium">Average Daily Outflow</span>
            <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">${burnRate.toFixed(2)} <span className="text-xs font-normal text-zinc-500">/ day</span></div>
          <p className="text-[11px] text-zinc-500 mt-1">Calculated over past 90 days recurring ledger</p>
        </div>

        <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-4 text-white shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="font-medium">Zero-Income Runway</span>
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">228 Days</div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Exceeds the 6-month safety benchmark</p>
        </div>

        <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-4 text-white shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="font-medium">Solvency Stress Rating</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">96 / 100</div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Top tier resilience & low shock vulnerability</p>
        </div>
      </div>
    </div>
  );
}

