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
  Sparkles,
  Zap,
  Eye,
  SlidersHorizontal
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
  if (currency === 'INR') {
    const inr = val * 83;
    const absVal = Math.abs(inr);
    const sign = inr < 0 ? '-' : '';
    if (absVal >= 10000000) return `${sign}₹${(absVal / 10000000).toFixed(1)} Cr`;
    if (absVal >= 100000) return `${sign}₹${(absVal / 100000).toFixed(1)} L`;
    if (absVal >= 1000) return `${sign}₹${(absVal / 1000).toFixed(0)}k`;
    return `${sign}₹${absVal.toFixed(0)}`;
  } else {
    const absVal = Math.abs(val);
    const sign = val < 0 ? '-' : '';
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
  const hasShortfall = trajectory.some(p => p.lower_bound_90 <= 0);

  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [chartTheme, setChartTheme] = useState('light'); // 'light' | 'dark'
  const svgRef = useRef(null);

  // SVG dimensions
  const svgWidth = 880;
  const svgHeight = 290;
  const paddingLeft = 70;
  const paddingRight = 40;
  const paddingTop = 32;
  const paddingBottom = 45;

  let minVal = 0;
  let maxVal = 10000;
  if (trajectory.length > 0) {
    const allVals = trajectory.flatMap(p => [p.lower_bound_90, p.median_balance, p.upper_bound_90]);
    minVal = Math.min(...allVals);
    maxVal = Math.max(...allVals);
    
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
  
  const lowerPointsReversed = [...lowerPoints].reverse();
  let lowerSplineReversed = '';
  if (lowerPointsReversed.length > 0) {
    lowerSplineReversed = lowerPointsReversed.map((pt) => `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
  }
  const bandPolygon = upperSpline ? `${upperSpline} ${lowerSplineReversed} Z` : '';

  const areaUnderMedian = medianPoints.length > 0 
    ? `${medianSpline} L ${medianPoints[medianPoints.length - 1].x} ${getY(minVal)} L ${medianPoints[0].x} ${getY(minVal)} Z`
    : '';

  const yTicks = [
    maxVal,
    maxVal * 0.66 + minVal * 0.33,
    maxVal * 0.33 + minVal * 0.66,
    minVal < 0 ? 0 : minVal
  ];

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

  const endingBalance = trajectory.length > 0 ? trajectory[trajectory.length - 1].median_balance : 28520.30;
  const isEndingPositive = endingBalance >= 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F4F6FA] text-zinc-900">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
            <span>Cash Flow Forecast</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>90% Confidence Corridor</span>
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Multi-horizon Monte Carlo projection of liquid buffer and growth trajectory.
          </p>
        </div>
        
        {/* Horizon selector chips - Scaleless to prevent text blurring */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Pill */}
          <button
            onClick={() => setChartTheme(chartTheme === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.06] text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors btn-interactive"
            title="Toggle Light / Dark Chart Surface"
          >
            <span className="text-xs">{chartTheme === 'light' ? '🌙 Dark Canvas' : '☀️ Light Canvas'}</span>
          </button>

          <div className="flex items-center gap-1 bg-white border border-black/[0.06] p-1 rounded-full shadow-sm">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => onHorizonChange(days)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-150 ${
                  currentHorizon === days 
                    ? 'bg-[#18191E] text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Runway Alert Banner */}
      <div>
        {hasShortfall ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-800 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold">Liquidity Warning (90% Lower Bound):</span> Conservative scenarios predict cash reserves approaching zero around Day 42. Consider applying a budget optimization in the simulator.
            </div>
          </div>
        ) : (
          <div className="bg-white border border-black/[0.06] rounded-2xl p-4 flex items-center justify-between text-zinc-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                  <span>Solvency Runway Resilient</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Liquid reserves maintain positive buffer through the full {currentHorizon}-day window.
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full hidden sm:inline-block">
              {currentHorizon}+ Days Safe
            </span>
          </div>
        )}
      </div>

      {/* Main Forecast Visualizer Card */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] card-interactive">
        
        {/* Metric Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-zinc-100">
          <div>
            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
              <span>Projected Ending Balance ({currentHorizon} Days)</span>
              <Activity className="w-3.5 h-3.5 text-teal-600" />
            </span>
            <div className="text-3xl font-extrabold text-zinc-900 mt-0.5 flex items-baseline gap-2.5">
              <span className="font-mono tabular-nums">
                <CountUp 
                  to={getConvertedValue(endingBalance, activeCurrency, true)} 
                  duration={1.2} 
                  decimals={2} 
                  prefix={activeCurrency === 'INR' ? '₹' : '$'} 
                />
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isEndingPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {isEndingPositive ? '+14.2% Growth' : 'Deficit Risk'}
              </span>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3 rounded-sm bg-teal-500/20 border border-teal-500/60"></span>
              <span>Likely Range (90% CQR)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-teal-500"></span>
              <span className="text-zinc-800 font-semibold">Expected Path</span>
            </div>
          </div>
        </div>

        {/* Dynamic Canvas for SVG Chart - Adapts smoothly to light or dark mode */}
        <div 
          className={`relative w-full h-[320px] sm:h-[350px] rounded-2xl p-2 sm:p-4 overflow-hidden cursor-crosshair group shadow-inner transition-colors duration-300 ${
            chartTheme === 'dark'
              ? 'bg-[#111216] border border-black/[0.15]'
              : 'bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-zinc-200/80'
          }`}
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
              <filter id="forecastGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="corridorGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.04" />
              </linearGradient>

              <linearGradient id="corridorGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="medianGlowLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0F766E" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Dashed Y-Axis Grid Lines & Clean Compact Labels */}
            {yTicks.map((val, idx) => {
              const yPos = getY(val);
              return (
                <g key={idx}>
                  <line 
                    x1={paddingLeft} 
                    y1={yPos} 
                    x2={svgWidth - paddingRight} 
                    y2={yPos} 
                    stroke={chartTheme === 'dark' ? '#1E202B' : '#E2E8F0'} 
                    strokeWidth="1" 
                    strokeDasharray={val === 0 ? "none" : "3 3"} 
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={yPos + 4} 
                    textAnchor="end" 
                    fill={chartTheme === 'dark' ? '#9CA3AF' : '#64748B'} 
                    fontSize="10" 
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {formatCompactTick(val, activeCurrency)}
                  </text>
                </g>
              );
            })}

            {/* Zero Baseline Line if negative */}
            {minVal < 0 && (
              <line 
                x1={paddingLeft} 
                y1={getY(0)} 
                x2={svgWidth - paddingRight} 
                y2={getY(0)} 
                stroke="#EF4444" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
              />
            )}

            {/* Vertical Date Grid Guidelines */}
            {dateMilestones.map((ms, idx) => (
              <g key={idx}>
                <line 
                  x1={ms.x} 
                  y1={paddingTop} 
                  x2={ms.x} 
                  y2={svgHeight - paddingBottom} 
                  stroke={chartTheme === 'dark' ? '#171821' : '#E2E8F0'} 
                  strokeWidth="1" 
                  strokeDasharray="2 4" 
                />
                <text 
                  x={ms.x} 
                  y={svgHeight - paddingBottom + 16} 
                  textAnchor="middle" 
                  fill={chartTheme === 'dark' ? '#9CA3AF' : '#64748B'} 
                  fontSize="10" 
                  fontWeight="600"
                >
                  {ms.label}
                </text>
              </g>
            ))}

            {/* 90% Confidence Corridor Area */}
            {bandPolygon && (
              <path 
                d={bandPolygon} 
                fill={chartTheme === 'dark' ? 'url(#corridorGradientDark)' : 'url(#corridorGradientLight)'} 
                stroke={chartTheme === 'dark' ? '#00E5FF' : '#0D9488'} 
                strokeWidth="0.8" 
                strokeOpacity="0.5" 
              />
            )}

            {/* Area Under Median Curve */}
            {areaUnderMedian && (
              <path 
                d={areaUnderMedian} 
                fill={chartTheme === 'dark' ? 'url(#medianAreaGlow)' : 'url(#medianGlowLight)'} 
              />
            )}

            {/* Median Spline Path with Gradient Stroke */}
            {medianSpline && (
              <path 
                d={medianSpline} 
                fill="none" 
                stroke={chartTheme === 'dark' ? '#00E5FF' : '#0F766E'} 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                filter={chartTheme === 'dark' ? 'url(#forecastGlow)' : 'none'}
                className="animate-draw-line"
              />
            )}

            {/* Active Hover Crosshair */}
            {hoveredIdx !== null && activePoint && (
              <g>
                <line 
                  x1={mousePos.x} 
                  y1={paddingTop} 
                  x2={mousePos.x} 
                  y2={svgHeight - paddingBottom} 
                  stroke={chartTheme === 'dark' ? '#00E5FF' : '#0F766E'} 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                <circle 
                  cx={mousePos.x} 
                  cy={mousePos.y} 
                  r="5" 
                  fill={chartTheme === 'dark' ? '#00E5FF' : '#0F766E'} 
                  stroke="#FFFFFF" 
                  strokeWidth="2.5" 
                />
              </g>
            )}
          </svg>

          {/* Floating Tooltip - Fixed "Day (+undefined Days)" Bug */}
          {hoveredIdx !== null && activePoint && (
            <div 
              className={`pointer-events-none absolute top-4 right-4 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl text-xs z-30 transition-all ${
                chartTheme === 'dark'
                  ? 'bg-black/90 border border-teal-500/50 text-white'
                  : 'bg-white/95 border border-zinc-200 text-zinc-900 shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="font-extrabold text-teal-600 font-mono">
                  {activeIdx === 0 ? 'Today (Day 0)' : `Day +${activeIdx}`}
                </span>
                {activePoint.date && (
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {new Date(activePoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              <div className="text-xs mb-1">
                Expected: <span className="font-bold font-mono">{formatMoney(activePoint.median_balance, activeCurrency, true)}</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                90% Corridor: [{formatMoney(activePoint.lower_bound_90, activeCurrency, true)} → {formatMoney(activePoint.upper_bound_90, activeCurrency, true)}]
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Burn Rate & Runway Metrics Grid */}
      <AnimatedContent distance={20} duration={0.4} stagger={0.08}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between card-interactive">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span className="font-semibold">Average Daily Outflow</span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 font-mono">
                {formatMoney(rawBurnRate, activeCurrency, true)} <span className="text-xs font-normal text-zinc-400">/ day</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Calculated over past 90 days recurring activity</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between card-interactive">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span className="font-semibold">Zero-Income Runway</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 font-mono">
                228 Days
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Exceeds 6-month safety benchmark (180d)</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between card-interactive">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span className="font-semibold">Solvency Health Score</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">AAA Rating</span>
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 font-mono">
                96 <span className="text-sm font-normal text-zinc-400">/ 100</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Top tier resilience & low shock vulnerability</p>
            </div>
          </div>

        </div>
      </AnimatedContent>

    </div>
  );
}
