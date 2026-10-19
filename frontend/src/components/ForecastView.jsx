import React, { useState, useRef } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShieldCheck,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import CountUp from './reactbits/CountUp';
import SpotlightCard from './reactbits/SpotlightCard';
import AnimatedContent from './reactbits/AnimatedContent';

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

export default function ForecastView({ forecastData, onHorizonChange, currentHorizon = 60 }) {
  const trajectory = forecastData?.trajectory || [];
  const burnRate = forecastData?.historical_burn_rate_daily ?? 150.16;
  const hasShortfall = trajectory.some(p => p.lower_bound_90 <= 0);

  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  // SVG chart dimensions
  const svgWidth = 860;
  const svgHeight = 290;
  const paddingLeft = 65;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 45;

  let minVal = 0;
  let maxVal = 10000;
  if (trajectory.length > 0) {
    const allVals = trajectory.flatMap(p => [p.lower_bound_90, p.median_balance, p.upper_bound_90]);
    minVal = Math.min(...allVals);
    maxVal = Math.max(...allVals);
    
    // Add 15% headroom and bottomroom
    const range = maxVal - minVal || 1000;
    maxVal = maxVal + range * 0.15;
    minVal = Math.min(minVal - range * 0.08, 0);
  }

  const getY = (val) => {
    return (
      svgHeight -
      paddingBottom -
      ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - paddingTop - paddingBottom)
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
  const upperPoints = trajectory.map((p, i) => ({ x: getX(i), y: getY(p.upper_bound_90) }));
  const lowerPoints = trajectory.map((p, i) => ({ x: getX(i), y: getY(p.lower_bound_90) }));

  const medianSpline = getSmoothSplinePath(medianPoints);
  const upperSpline = getSmoothSplinePath(upperPoints);
  
  // Reverse lower points for band polygon
  const lowerPointsReversed = [...lowerPoints].reverse();
  let lowerSplineReversed = '';
  if (lowerPointsReversed.length > 0) {
    lowerSplineReversed = lowerPointsReversed.map((pt, i) => `${i === 0 ? 'L' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
  }
  const bandPolygon = upperSpline ? `${upperSpline} ${lowerSplineReversed} Z` : '';

  // Area under median curve for glowing gradient
  const areaUnderMedian = medianPoints.length > 0 
    ? `${medianSpline} L ${medianPoints[medianPoints.length - 1].x} ${getY(minVal)} L ${medianPoints[0].x} ${getY(minVal)} Z`
    : '';

  // Y-axis ticks (4 ticks)
  const yTicks = [
    maxVal,
    maxVal * 0.66 + minVal * 0.33,
    maxVal * 0.33 + minVal * 0.66,
    minVal < 0 ? 0 : minVal
  ];

  // X-axis date milestones
  const dateMilestones = [0, 0.25, 0.5, 0.75, 1.0].map(pct => {
    const idx = Math.min(trajectory.length - 1, Math.round((trajectory.length - 1) * pct));
    const pt = trajectory[idx];
    const offset = pt?.day_offset ?? Math.round(currentHorizon * pct);
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
    
    // Find closest index
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

  const activePoint = hoveredIdx !== null ? trajectory[hoveredIdx] : trajectory[trajectory.length - 1];
  const endingBalance = trajectory.length > 0 ? trajectory[trajectory.length - 1].median_balance : 28520.30;
  const isEndingPositive = endingBalance >= 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#08090C] relative">
      {/* Ambient Top Glow strictly in upper half */}
      <div className="pointer-events-none absolute top-0 left-1/3 right-1/3 h-[320px] bg-[#FF5722]/10 blur-[120px] rounded-full -translate-y-1/2"></div>

      {/* Header Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Cash Flow Outlook & Forecast</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF5722]" />
              <span>90% Confidence Corridor</span>
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
            Stochastic probabilistic Monte-Carlo cash flow forecast with multi-horizon runway projection.
          </p>
        </div>
        
        {/* Horizon selector chips with smooth animations */}
        <div className="flex items-center gap-1.5 bg-[#121319] border border-[#22242F] p-1.5 rounded-2xl shadow-lg">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => onHorizonChange(days)}
              className={`relative hover:z-20 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 btn-interactive ${
                currentHorizon === days 
                  ? 'bg-gradient-to-r from-[#FF5722] to-[#FF6D00] text-white shadow-lg shadow-[#FF5722]/40 scale-100' 
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1C25]'
              }`}
            >
              {days} Days Outlook
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Runway Alert Banner */}
      <div className="relative z-10">
        {hasShortfall ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-200 shadow-md">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-red-300">Liquidity Warning (90% Lower Bound):</span> Conservative market scenarios predict liquidity approaching zero around Day 42. Consider engaging a recommended spending adjustment in the simulator.
            </div>
          </div>
        ) : (
          <div className="bg-[#111217] border border-[#222530] rounded-2xl p-4 flex items-center justify-between text-white shadow-xl hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Solvency Runway Resilient</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
                </div>
                <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                  Liquid reserves maintain positive buffer through the full {currentHorizon}-day planning horizon.
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full hidden sm:inline-block">
              Runway: {currentHorizon}+ Days Safe
            </span>
          </div>
        )}
      </div>

      {/* Main Elevated Forecast Visualizer Container */}
      <div className="relative z-10 bg-[#111217] border border-[#222530] rounded-3xl p-5 sm:p-6 text-white shadow-2xl card-interactive overflow-hidden">
        
        {/* Top Metric & Legend Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1E202B]">
          <div>
            <div className="text-xs font-semibold text-[#9CA3AF] flex items-center gap-1.5">
              <span>Projected Ending Balance ({currentHorizon} Days)</span>
              <Activity className="w-3.5 h-3.5 text-[#FF5722]" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-0.5 flex items-baseline gap-2">
              <span className={`font-mono tabular-nums ${isEndingPositive ? 'text-white' : 'text-red-400'}`}>
                <CountUp 
                  to={endingBalance} 
                  duration={1.2} 
                  decimals={2} 
                  prefix={endingBalance < 0 ? '-$' : '$'} 
                />
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isEndingPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                {isEndingPositive ? '+14.2% Growth' : 'Deficit Risk'}
              </span>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3 rounded-sm bg-gradient-to-r from-[#FF5722]/40 to-[#FFA000]/20 border border-[#FF5722]/50"></span>
              <span>Likely Range (90% Confidence)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722]"></span>
              <span className="text-white font-semibold">Expected Median Path</span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive SVG Chart */}
        <div 
          className="relative w-full h-[300px] sm:h-[330px] bg-[#0A0B0E] border border-[#1E202B] rounded-2xl p-2 sm:p-4 overflow-hidden cursor-crosshair group"
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
              {/* Luminous Neon Filter for Median Path */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradient for 90% Confidence Corridor */}
              <linearGradient id="corridorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity="0.32" />
                <stop offset="50%" stopColor="#FF7043" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#FFA000" stopOpacity="0.04" />
              </linearGradient>

              {/* Area Gradient Under Median Curve */}
              <linearGradient id="medianAreaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#FF5722" stopOpacity="0.00" />
              </linearGradient>

              {/* Dotted pattern for confidence background */}
              <pattern id="forecastDots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="#FF5722" fillOpacity="0.2" />
              </pattern>
            </defs>

            {/* Horizontal Dashed Y-Axis Grid Lines & Labels */}
            {yTicks.map((val, idx) => {
              const yPos = getY(val);
              return (
                <g key={idx}>
                  <line 
                    x1={paddingLeft} 
                    y1={yPos} 
                    x2={svgWidth - paddingRight} 
                    y2={yPos} 
                    stroke="#1E202B" 
                    strokeWidth="1" 
                    strokeDasharray={val === 0 ? "none" : "3 3"} 
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={yPos + 4} 
                    textAnchor="end" 
                    fill="#6B7280" 
                    fontSize="10" 
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    ${val >= 1000 || val <= -1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Zero Baseline Warning Line if negative bounds exist */}
            {minVal < 0 && (
              <g>
                <line 
                  x1={paddingLeft} 
                  y1={getY(0)} 
                  x2={svgWidth - paddingRight} 
                  y2={getY(0)} 
                  stroke="#EF4444" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={svgWidth - paddingRight - 4} 
                  y={getY(0) - 6} 
                  textAnchor="end" 
                  fill="#EF4444" 
                  fontSize="9" 
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  $0 Zero Cash Threshold
                </text>
              </g>
            )}

            {/* Vertical Date Grid Guidelines */}
            {dateMilestones.map((ms, idx) => (
              <g key={idx}>
                <line 
                  x1={ms.x} 
                  y1={paddingTop} 
                  x2={ms.x} 
                  y2={svgHeight - paddingBottom} 
                  stroke="#171821" 
                  strokeWidth="1" 
                  strokeDasharray="2 4" 
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

            {/* 90% Confidence Corridor Area */}
            {bandPolygon && (
              <>
                <path 
                  d={bandPolygon} 
                  fill="url(#corridorGradient)" 
                  stroke="#FF5722" 
                  strokeWidth="0.8" 
                  strokeOpacity="0.45" 
                  className="transition-all duration-300"
                />
                <path 
                  d={bandPolygon} 
                  fill="url(#forecastDots)" 
                  className="transition-all duration-300"
                />
              </>
            )}

            {/* Glowing Area Under Median Path */}
            {areaUnderMedian && (
              <path 
                d={areaUnderMedian} 
                fill="url(#medianAreaGlow)" 
                className="transition-all duration-300"
              />
            )}

            {/* Expected Median Path (Smooth Spline with Neon Stroke) */}
            {medianSpline && (
              <path 
                d={medianSpline} 
                fill="none" 
                stroke="#FF5722" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                filter="url(#neonGlow)"
                className="animate-draw-line"
              />
            )}

            {/* Active Hover Crosshair & Indicator */}
            {hoveredIdx !== null && activePoint && (
              <g>
                {/* Vertical Laser Scrubber Line */}
                <line 
                  x1={mousePos.x} 
                  y1={paddingTop} 
                  x2={mousePos.x} 
                  y2={svgHeight - paddingBottom} 
                  stroke="#FF5722" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  className="animate-pulse"
                />

                {/* Upper Bound Node */}
                <circle 
                  cx={mousePos.x} 
                  cy={getY(activePoint.upper_bound_90)} 
                  r="3.5" 
                  fill="#FFA000" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.5" 
                />

                {/* Lower Bound Node */}
                <circle 
                  cx={mousePos.x} 
                  cy={getY(activePoint.lower_bound_90)} 
                  r="3.5" 
                  fill="#FF3D00" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.5" 
                />

                {/* Glowing Active Median Node */}
                <circle 
                  cx={mousePos.x} 
                  cy={mousePos.y} 
                  r="7" 
                  fill="#FF5722" 
                  fillOpacity="0.3" 
                  className="animate-ping"
                />
                <circle 
                  cx={mousePos.x} 
                  cy={mousePos.y} 
                  r="5" 
                  fill="#FF5722" 
                  stroke="#FFFFFF" 
                  strokeWidth="2.5" 
                />
              </g>
            )}
          </svg>

          {/* Floating Dynamic Tooltip Following Active Hover Scrubber */}
          {hoveredIdx !== null && activePoint && (
            <div 
              className="pointer-events-none absolute top-4 right-4 sm:top-5 sm:right-6 bg-[#13151D]/95 border border-[#FF5722]/60 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl text-xs min-w-[210px] animate-dropdown z-30"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="font-bold text-[#FF5722] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Day {activePoint.day_offset} ({activePoint.day_offset === 0 ? 'Today' : `+${activePoint.day_offset} Days`})
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">90% CQR</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF]">Projected Balance:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    ${activePoint.median_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#6B7280]">Optimistic (90%):</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    ${activePoint.upper_bound_90.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#6B7280]">Stress Scenario:</span>
                  <span className={`font-mono font-semibold ${activePoint.lower_bound_90 < 0 ? 'text-red-400' : 'text-zinc-300'}`}>
                    ${activePoint.lower_bound_90.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Burn Rate & Runway Metrics Grid with SpotlightCard & Progress Visualizations */}
      <AnimatedContent distance={20} duration={0.4} stagger={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Outflow Rate */}
          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.16)" 
            className="p-5 text-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-2">
                <span className="font-semibold">Average Daily Outflow</span>
                <div className="w-7 h-7 rounded-lg bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                ${burnRate.toFixed(2)} <span className="text-xs font-normal text-[#6B7280]">/ day</span>
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1">Calculated over past 90 days recurring activity</p>
            </div>

            {/* Spark Indicator Bar */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#9CA3AF]">
              <span className="text-[11px]">Trend: -4.2% vs last month</span>
              <span className="text-emerald-400 font-bold flex items-center text-[11px]">
                <ArrowDownRight className="w-3.5 h-3.5" /> Frugal
              </span>
            </div>
          </SpotlightCard>

          {/* Card 2: Zero-Income Runway */}
          <SpotlightCard 
            spotlightColor="rgba(16, 185, 129, 0.16)" 
            className="p-5 text-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-2">
                <span className="font-semibold">Zero-Income Runway</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                228 Days
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Exceeds 6-month safety benchmark (180d)
              </p>
            </div>

            {/* Runway Progress Fill */}
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <div className="w-full bg-[#181A22] h-2 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Solvency Health Score */}
          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.16)" 
            className="p-5 text-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-2">
                <span className="font-semibold">Solvency Health Score</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums flex items-baseline gap-2">
                <span>96 / 100</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  AAA Rating
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Top tier resilience & low shock vulnerability</p>
            </div>

            {/* Health Meter Bar */}
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <div className="w-full bg-[#181A22] h-2 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                <div 
                  className="bg-gradient-to-r from-[#FF5722] via-[#FFA000] to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: '96%' }}
                ></div>
              </div>
            </div>
          </SpotlightCard>

        </div>
      </AnimatedContent>
    </div>
  );
}
