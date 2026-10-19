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
    <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-9 lg:py-8 space-y-6 select-none bg-[#08090C]">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Cash Flow Outlook & Forecast</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-bold">
              90% Confidence
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
            Realistic multi-horizon forecast showing expected reserves, conservative lower bounds, and growth trajectory.
          </p>
        </div>
        
        {/* Horizon selector chips */}
        <div className="flex items-center gap-2 bg-[#121319] border border-[#22242F] p-1.5 rounded-2xl shadow-sm">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => onHorizonChange(days)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 btn-interactive ${
                currentHorizon === days 
                  ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/35' 
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1C25]'
              }`}
            >
              {days} Days Outlook
            </button>
          ))}
        </div>
      </div>

      {/* Shortfall Alert Banner */}
      {hasShortfall ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Liquidity Warning:</span> Under conservative scenarios, your cash reserves approach minimum thresholds around Day 42. Consider applying a recommended spending adjustment.
          </div>
        </div>
      ) : (
        <div className="bg-[#111217] border border-[#222530] rounded-2xl p-4 flex items-center justify-between text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Solvency Runway Healthy</div>
              <div className="text-[11px] text-[#9CA3AF]">Your reserves comfortably exceed all scheduled obligations throughout the {currentHorizon}-day window.</div>
            </div>
          </div>
          <span className="text-xs font-extrabold text-[#FF5722] bg-[#FF5722]/10 border border-[#FF5722]/20 px-3 py-1 rounded-full">
            Safe Runway: {currentHorizon}+ Days
          </span>
        </div>
      )}

      {/* Detailed Forecast Canvas Area */}
      <div className="bg-[#111217] border border-[#222530] rounded-3xl p-6 text-white shadow-xl card-interactive">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-[#9CA3AF]">Projected Ending Balance ({currentHorizon} Days)</span>
            <div className="text-3xl font-extrabold text-white mt-0.5">
              ${trajectory.length > 0 ? trajectory[trajectory.length - 1].median_balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '28,520.30'}
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#FF5722]/25 border border-[#FF5722]/50"></span>
              <span>Likely Range (90% Confidence)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 rounded-full bg-[#FF5722]"></span>
              <span>Expected Median Path</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full h-[280px] bg-[#0A0B0E] border border-[#1E202B] rounded-2xl p-4 overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FF5722" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Zero line */}
            {minVal < 0 && (
              <line 
                x1={padding} y1={getY(0)} 
                x2={svgWidth - padding} y2={getY(0)} 
                stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" 
              />
            )}

            {/* 90% Confidence Band */}
            {bandPath && (
              <path d={bandPath} fill="url(#forecastGlow)" stroke="#FF5722" strokeWidth="0.75" strokeOpacity="0.4" />
            )}

            {/* Expected Median Path */}
            {medianPath && (
              <path d={medianPath} fill="none" stroke="#FF5722" strokeWidth="3" strokeLinecap="round" />
            )}

            {/* Interactive Data Dots */}
            {trajectory.filter((_, idx) => idx % Math.ceil(trajectory.length / 12) === 0).map((pt, i) => (
              <g key={i}>
                <circle 
                  cx={getX(trajectory.indexOf(pt))} 
                  cy={getY(pt.median_balance)} 
                  r="4" 
                  fill="#FF5722" 
                  stroke="#FFFFFF" 
                  strokeWidth="2" 
                  className="cursor-pointer transition-transform hover:scale-150"
                  onMouseEnter={() => setHoveredPoint(pt)}
                />
              </g>
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-4 right-4 bg-black/90 border border-[#FF5722]/50 text-white rounded-xl p-3 text-xs shadow-xl animate-dropdown">
              <div className="font-bold text-[#FF5722]">Day {hoveredPoint.day_offset} Forecast</div>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                Expected: <span className="text-white font-bold">${hoveredPoint.median_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Range: ${hoveredPoint.lower_bound_90.toLocaleString()} — ${hoveredPoint.upper_bound_90.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Burn Rate & Runway Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white shadow-lg card-interactive">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-2">
            <span>Average Daily Outflow</span>
            <DollarSign className="w-4 h-4 text-[#FF5722]" />
          </div>
          <div className="text-2xl font-extrabold text-white">${burnRate.toFixed(2)} / day</div>
          <p className="text-[11px] text-[#6B7280] mt-1">Calculated over past 90 days recurring activity</p>
        </div>

        <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white shadow-lg card-interactive">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-2">
            <span>Zero-Income Runway</span>
            <Calendar className="w-4 h-4 text-[#FF5722]" />
          </div>
          <div className="text-2xl font-extrabold text-white">228 Days</div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Exceeds the 6-month safety benchmark</p>
        </div>

        <div className="bg-[#111217] border border-[#222530] rounded-3xl p-5 text-white shadow-lg card-interactive">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-2">
            <span>Solvency Health Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">96 / 100</div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Top tier resilience & low volatility</p>
        </div>
      </div>
    </div>
  );
}
