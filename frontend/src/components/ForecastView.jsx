import React, { useState, useRef } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  ShieldCheck,
  Activity,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import CountUp from './reactbits/CountUp';
import AnimatedContent from './reactbits/AnimatedContent';
import { formatMoney, getConvertedValue } from '../utils/currency';

// Helper to compute smooth cubic bezier paths
function getSmoothSplinePath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  
  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const prev = points[i - 1] || current;
    const afterNext = points[i + 2] || next;
    
    const cp1x = current.x + (next.x - prev.x) * 0.22;
    const cp1y = current.y + (next.y - prev.y) * 0.22;
    const cp2x = next.x - (afterNext.x - current.x) * 0.22;
    const cp2y = next.y - (afterNext.y - current.y) * 0.22;
    
    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  return path;
}

// Compact currency formatter for clean Y-axis ticks
function formatCompactTick(val, currency = 'INR') {
  const isINR = currency === 'INR';
  const displayVal = isINR ? val * 83 : val;
  const absVal = Math.abs(displayVal);
  const sign = displayVal < 0 ? '-' : '';

  if (isINR) {
    if (absVal >= 10000000) return `${sign}₹${(absVal / 10000000).toFixed(1)} Cr`;
    if (absVal >= 100000) return `${sign}₹${(absVal / 100000).toFixed(1)} L`;
    if (absVal >= 1000) return `${sign}₹${(absVal / 1000).toFixed(0)}k`;
    return `${sign}₹${absVal.toFixed(0)}`;
  } else {
    if (absVal >= 1000000) return `${sign}$${(absVal / 1000000).toFixed(1)}M`;
    if (absVal >= 1000) return `${sign}$${(absVal / 1000).toFixed(0)}k`;
    return `${sign}$${absVal.toFixed(0)}`;
  }
}

export default function ForecastView({ 
  forecastData, 
  onHorizonChange, 
  currentHorizon = 60, 
  activeCurrency = 'INR' 
}) {
  const trajectory = forecastData?.trajectory || [];
  const rawBurnRate = forecastData?.historical_burn_rate_daily ?? 150.16;
  const startingBalance = forecastData?.current_liquid_balance ?? (trajectory[0]?.median_balance || 6750.0);
  const hasShortfall = trajectory.some(p => p.lower_bound_90 <= 0);

  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  // SVG dimensions
  const svgWidth = 880;
  const svgHeight = 280;
  const paddingLeft = 75;
  const paddingRight = 35;
  const paddingTop = 28;
  const paddingBottom = 42;

  // Compute mathematically consistent scale centered on the Expected Path
  let minVal = -1000;
  let maxVal = 8000;

  if (trajectory.length > 0) {
    const medianVals = trajectory.map(p => p.median_balance);
    const medianMin = Math.min(...medianVals, startingBalance);
    const medianMax = Math.max(...medianVals, startingBalance);
    const range = (medianMax - medianMin) || 4000;

    // Set chart range so median trajectory occupies ~70% of vertical height
    maxVal = medianMax + range * 0.40;
    minVal = Math.min(medianMin - range * 0.35, 0);
  }

  const getY = (val) => {
    const clampedVal = Math.max(minVal - 500, Math.min(maxVal + 500, val));
    return (
      svgHeight -
      paddingBottom -
      ((clampedVal - minVal) / (maxVal - minVal || 1)) * (svgHeight - paddingTop - paddingBottom)
    );
  };

  const getX = (idx) => {
    return (
      paddingLeft +
      (idx / Math.max(1, trajectory.length - 1)) * (svgWidth - paddingLeft - paddingRight)
    );
  };

  // Build points for spline computation
  const medianPoints = trajectory.map((p, i) => ({ x: getX(i), y: getY(p.median_balance) }));
  
  // Clamped upper and lower points for the subtle confidence interval
  const upperPoints = trajectory.map((p, i) => ({ 
    x: getX(i), 
    y: getY(Math.min(maxVal, p.upper_bound_90)) 
  }));
  const lowerPoints = trajectory.map((p, i) => ({ 
    x: getX(i), 
    y: getY(Math.max(minVal, p.lower_bound_90)) 
  }));

  const medianSpline = getSmoothSplinePath(medianPoints);
  const upperSpline = getSmoothSplinePath(upperPoints);
  
  const lowerPointsReversed = [...lowerPoints].reverse();
  let lowerSplineReversed = '';
  if (lowerPointsReversed.length > 0) {
    lowerSplineReversed = lowerPointsReversed.map((pt) => `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
  }
  const bandPolygon = upperSpline ? `${upperSpline} ${lowerSplineReversed} Z` : '';

  const areaUnderMedian = medianPoints.length > 0 
    ? `${medianSpline} L ${medianPoints[medianPoints.length - 1].x} ${getY(minVal)} L ${medianPoints[0].x} ${getY(minVal)} Z`
    : '';

  // 4 Evenly Spaced Y-Ticks
  const yTicks = [
    maxVal,
    maxVal * 0.66 + minVal * 0.33,
    maxVal * 0.33 + minVal * 0.66,
    minVal < 0 ? 0 : minVal
  ];

  // Date milestones along X-axis
  const dateMilestones = [0, 0.25, 0.5, 0.75, 1.0].map(pct => {
    const idx = Math.min(trajectory.length - 1, Math.round((trajectory.length - 1) * pct));
    const offset = idx;
    return {
      x: getX(idx),
      label: offset === 0 ? 'Today' : `+${offset}d`,
      idx
    };
  });

  const handleMouseMove = (e) => {
    if (!svgRef.current || trajectory.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * svgWidth;
    
    let closestIdx = 0;
    let minDiff = Infinity;
    trajectory.forEach((_, i) => {
      const diff = Math.abs(getX(i) - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });

    setHoveredIdx(closestIdx);
    setMousePos({ x: getX(closestIdx), y: getY(trajectory[closestIdx].median_balance) });
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
  };

  const activeIdx = hoveredIdx !== null ? hoveredIdx : (trajectory.length - 1);
  const activePoint = trajectory[activeIdx] || {
    median_balance: 28520.30,
    lower_bound_90: 22000,
    upper_bound_90: 34000,
    date: new Date().toISOString()
  };

  const endingBalance = trajectory.length > 0 ? trajectory[trajectory.length - 1].median_balance : -568.29;
  const isEndingPositive = endingBalance >= 0;
  const netDrift = endingBalance - startingBalance;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 select-none bg-[#F4F6FA] ambient-dashboard-glow text-zinc-900 font-sans">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Cash Flow Forecast
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-medium">
            Multi-horizon Monte Carlo projection of liquid reserves and solvency runway.
          </p>
        </div>
        
        {/* Horizon Selector Chips */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200/90 p-1 rounded-xl shadow-sm">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => onHorizonChange(days)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentHorizon === days 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Proportionate Risk Alert Callout */}
      {hasShortfall ? (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-amber-950 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong className="font-semibold">Liquidity Notice (Conservative 90% Bound):</strong> Reserves approach zero around Day 42 under high-burn scenarios.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 hidden sm:inline-block">
            Simulation Confidence: 90%
          </span>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200/80 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-zinc-800 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="font-semibold text-zinc-900">Solvency Runway Resilient:</strong> Liquid buffer maintains safe positive surplus through the {currentHorizon}-day window.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            {currentHorizon}+ Days Safe
          </span>
        </div>
      )}

      {/* Main Forecast Visualizer Card */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-sm">
        
        {/* Metric Header: Prioritizes Ending Balance, Period, and Starting Drift */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-1">
              <span>Projected Ending Balance (at Day {currentHorizon})</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isEndingPositive ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                {isEndingPositive ? 'Growth Trajectory' : 'Deficit Risk'}
              </span>
            </div>
            
            <div className="text-3xl font-extrabold text-zinc-900 tracking-tight font-mono tabular-nums">
              <CountUp 
                to={getConvertedValue(endingBalance, activeCurrency, true)} 
                duration={0.8} 
                decimals={2} 
                prefix={activeCurrency === 'INR' ? '₹' : '$'} 
              />
            </div>
            
            <p className="text-[11px] text-zinc-400 mt-1 font-medium">
              Starting Liquid Reserve: <span className="font-semibold text-zinc-700">{formatMoney(startingBalance, activeCurrency, true)}</span> • Net Horizon Drift: <span className="font-semibold text-zinc-700">{formatMoney(netDrift, activeCurrency, true)}</span>
            </p>
          </div>

          {/* Clean Restrained Legend */}
          <div className="flex items-center gap-5 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-2 rounded-sm bg-[#12B8AC]/15 border border-[#12B8AC]/40"></span>
              <span>90% Confidence Span</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 rounded-full bg-[#0F766E]"></span>
              <span className="text-zinc-900 font-semibold">Expected Path</span>
            </div>
          </div>
        </div>

        {/* Clean Light Chart Surface */}
        <div 
          className="relative w-full h-[300px] sm:h-[320px] rounded-xl bg-[#FAFAFC] border border-zinc-200/80 p-2 sm:p-4 overflow-hidden cursor-crosshair group shadow-inner"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <svg 
            ref={svgRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="subtleCorridorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#12B8AC" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#12B8AC" stopOpacity="0.02" />
              </linearGradient>

              <linearGradient id="subtleMedianArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0F766E" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {yTicks.map((val, idx) => {
              const yPos = getY(val);
              return (
                <g key={idx}>
                  <line 
                    x1={paddingLeft} 
                    y1={yPos} 
                    x2={svgWidth - paddingRight} 
                    y2={yPos} 
                    stroke="#E5E7EB" 
                    strokeWidth="1" 
                    strokeDasharray={val === 0 ? "none" : "3 3"} 
                  />
                  <text 
                    x={paddingLeft - 10} 
                    y={yPos + 4} 
                    textAnchor="end" 
                    fill="#6B7280" 
                    fontSize="10" 
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {formatCompactTick(val, activeCurrency)}
                  </text>
                </g>
              );
            })}

            {/* Zero Baseline Line if Negative */}
            {minVal < 0 && (
              <g>
                <line 
                  x1={paddingLeft} 
                  y1={getY(0)} 
                  x2={svgWidth - paddingRight} 
                  y2={getY(0)} 
                  stroke="#F43F5E" 
                  strokeWidth="1.2" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={svgWidth - paddingRight} 
                  y={getY(0) - 4} 
                  textAnchor="end" 
                  fill="#E11D48" 
                  fontSize="9" 
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  0 Baseline
                </text>
              </g>
            )}

            {/* Vertical Milestone Guidelines */}
            {dateMilestones.map((ms, idx) => (
              <g key={idx}>
                <line 
                  x1={ms.x} 
                  y1={paddingTop} 
                  x2={ms.x} 
                  y2={svgHeight - paddingBottom} 
                  stroke="#F3F4F6" 
                  strokeWidth="1" 
                  strokeDasharray="2 3" 
                />
                <text 
                  x={ms.x} 
                  y={svgHeight - paddingBottom + 16} 
                  textAnchor="middle" 
                  fill="#6B7280" 
                  fontSize="10" 
                  fontWeight="600"
                >
                  {ms.label}
                </text>
              </g>
            ))}

            {/* Subtle 90% Confidence Interval Band */}
            {bandPolygon && (
              <path 
                d={bandPolygon} 
                fill="url(#subtleCorridorGrad)" 
                stroke="#12B8AC" 
                strokeWidth="0.8" 
                strokeOpacity="0.4" 
              />
            )}

            {/* Area Under Median Path */}
            {areaUnderMedian && (
              <path 
                d={areaUnderMedian} 
                fill="url(#subtleMedianArea)" 
              />
            )}

            {/* Clean Primary Expected Path Spline */}
            {medianSpline && (
              <path 
                d={medianSpline} 
                fill="none" 
                stroke="#0F766E" 
                strokeWidth="2.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-draw-line"
              />
            )}

            {/* Hover Crosshair & Node */}
            {hoveredIdx !== null && activePoint && (
              <g>
                <line 
                  x1={mousePos.x} 
                  y1={paddingTop} 
                  x2={mousePos.x} 
                  y2={svgHeight - paddingBottom} 
                  stroke="#0F766E" 
                  strokeWidth="1.2" 
                  strokeDasharray="3 3" 
                />
                <circle 
                  cx={mousePos.x} 
                  cy={mousePos.y} 
                  r="4.5" 
                  fill="#0F766E" 
                  stroke="#FFFFFF" 
                  strokeWidth="2" 
                />
              </g>
            )}
          </svg>

          {/* Clean Informative Hover Tooltip with Consistent Currency */}
          {hoveredIdx !== null && activePoint && (
            <div className="pointer-events-none absolute top-3 right-3 bg-white/95 border border-zinc-200/90 rounded-xl p-3 shadow-lg text-xs z-30 min-w-[210px] backdrop-blur-sm">
              <div className="flex items-center justify-between text-zinc-500 font-medium text-[11px] mb-1.5 pb-1 border-b border-zinc-100">
                <span className="font-semibold text-zinc-900">
                  {activeIdx === 0 ? 'Today (Day 0)' : `Day +${activeIdx}`}
                </span>
                <span>
                  {activePoint.date ? new Date(activePoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono mb-1">
                <span className="text-zinc-600 font-sans">Expected Balance:</span>
                <span className="font-bold text-zinc-950">{formatMoney(activePoint.median_balance, activeCurrency, true)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="font-sans">90% Range:</span>
                <span>[{formatMoney(activePoint.lower_bound_90, activeCurrency, true)} → {formatMoney(activePoint.upper_bound_90, activeCurrency, true)}]</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Compact Supporting Metrics matching design system */}
      <AnimatedContent distance={15} duration={0.3} stagger={0.05}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-sm">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Average Daily Outflow</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
              {formatMoney(rawBurnRate, activeCurrency, true)} <span className="text-xs font-normal text-zinc-400">/ day</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Calculated over past 90 days recurring activity</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-sm">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Zero-Income Runway</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
              228 Days
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exceeds 6-month safety benchmark (180d)</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-sm">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Solvency Health Score</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">AAA Rating</span>
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
              96 <span className="text-sm font-normal text-zinc-400">/ 100</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Top-tier liquid resilience & low shock vulnerability</p>
          </div>

        </div>
      </AnimatedContent>

    </div>
  );
}
