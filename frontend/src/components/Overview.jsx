import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  SlidersHorizontal, 
  ChevronRight, 
  HelpCircle, 
  Sparkles,
  Layers,
  Circle,
  MoreHorizontal,
  Landmark,
  ShieldCheck,
  Wallet,
  Send,
  Zap,
  Bot
} from 'lucide-react';
import CountUp from './reactbits/CountUp';
import AnimatedContent from './reactbits/AnimatedContent';
import { REGIONS } from './LoginPage';

export default function Overview({ 
  accountsSummary, 
  setActiveTab,
  activeRegion = 'IN'
}) {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(3);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiCustomQuery, setAiCustomQuery] = useState('');
  const [selectedAiPrompt, setSelectedAiPrompt] = useState('performance');

  const region = REGIONS.find(r => r.code === activeRegion) || REGIONS[0];
  const symbol = region.symbol;
  const isIndia = region.code === 'IN';
  const multiplier = isIndia ? 83 : 1;

  // Monthly Bars (modeled exactly from middle card in reference image)
  const barData = [
    { period: '1 Dec', height: '42%', value: 2150, date: 'Dec 01, 2025' },
    { period: '8 Dec', height: '62%', value: 3200, date: 'Dec 08, 2025' },
    { period: '15 Dec', height: '50%', value: 2800, date: 'Dec 15, 2025' },
    { period: '22 Dec', height: '86%', value: 4250.69, date: 'Jan 25, 2026' }, // Highlighted active mint bar
    { period: '29 Dec', height: '68%', value: 3600, date: 'Dec 29, 2025' },
    { period: '5 Jan', height: '78%', value: 3950, date: 'Jan 05, 2026' },
    { period: '12 Jan', height: '48%', value: 2450, date: 'Jan 12, 2026' },
  ];

  const activeBar = barData[hoveredBarIndex] || barData[3];

  const formatVal = (usdVal, decimals = 2) => {
    const val = usdVal * multiplier;
    if (isIndia) {
      return `${symbol}${val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    }
    return `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F3F4F7] ambient-dashboard-glow text-zinc-900">
      
      {/* Subheader: "Portfolio", Overview / Holding pills, Invest sign, + Add (Exact from image.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Page Title + Pills */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Portfolio
          </h1>
          
          <div className="flex items-center bg-white p-1 rounded-full border border-black/[0.04] shadow-sm">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSubTab === 'overview'
                  ? 'bg-[#18191E] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSubTab === 'holding'
                  ? 'bg-[#18191E] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Holding
            </button>
          </div>
        </div>

        {/* Right: Invest sign & + Add pills from image.png */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setActiveTab('forecast')}
            className="flex items-center gap-2 bg-white hover:bg-zinc-50 border border-black/[0.08] text-zinc-800 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all btn-interactive"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-600" />
            <span>Invest sign</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('transactions')}
            className="flex items-center gap-1.5 bg-white hover:bg-zinc-50 border border-black/[0.08] text-zinc-800 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all btn-interactive"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-600" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Sleek Account Cards */}
      <AnimatedContent distance={15} duration={0.35} stagger={0.06}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Coinbase (Charcoal surface with clean stepped line) */}
          <div className="bg-white rounded-[26px] p-5 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-250 card-interactive group">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-teal-400 shadow-sm border border-zinc-700/40">
                  <Landmark className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-zinc-700">Coinbase</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
                  {formatVal(42.50)}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                  ↗ +5.99
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto font-medium">56s ago</span>
              </div>
            </div>

            {/* Inner Dark Graphic Container with Stepped Line */}
            <div className="bg-[#16171B] rounded-2xl p-3 text-white relative h-28 flex flex-col justify-between overflow-hidden shadow-inner border border-white/[0.06]">
              <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible">
                <path 
                  d="M 5,28 L 22,26 L 36,33 L 48,16 L 62,22 L 78,12 L 95,20" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <circle cx="78" cy="12" r="3.5" fill="#35D9C5" />
                <line x1="78" y1="12" x2="78" y2="40" stroke="#35D9C5" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
              </svg>
              <div className="absolute bottom-2.5 right-3 text-right">
                <span className="text-[11px] font-mono text-zinc-200 font-bold block">{formatVal(25.00)}</span>
                <span className="text-[8px] text-zinc-400 font-mono">Fri, Dec 31</span>
              </div>
            </div>
          </div>

          {/* Card 2: Trust wallet (Turquoise/Mint Equalizer Bars) */}
          <div className="bg-white rounded-[26px] p-5 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-250 card-interactive group">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-teal-900 to-zinc-900 flex items-center justify-center text-teal-400 shadow-sm border border-teal-700/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-zinc-700">Trust wallet</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
                  {formatVal(56.20)}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                  ↗ +5.99
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto font-medium">56s ago</span>
              </div>
            </div>

            {/* Inner Cyan/Teal Gradient Container with Bars */}
            <div className="bg-gradient-to-tr from-[#6EE7B7] via-[#2DD4BF] to-[#06B6D4] rounded-2xl p-3 text-white relative h-28 flex items-end justify-between overflow-hidden shadow-inner">
              <div className="flex items-end gap-1.5 w-full h-full pb-1">
                {[25, 45, 20, 65, 35, 75, 45, 88, 30, 60, 92, 40, 50].map((h, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-t-sm transition-all ${i === 8 ? 'bg-white shadow-sm' : 'bg-white/45'}`} 
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
              <div className="absolute top-2.5 right-3 bg-[#16171B]/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[9px] font-mono text-white flex flex-col items-center shadow-md border border-white/[0.1]">
                <span className="font-bold">{formatVal(16.24)}</span>
                <span className="text-[7px] text-zinc-400">Fri, Dec 31</span>
              </div>
            </div>
          </div>

          {/* Card 3: Trust wallet (Purple Spectrum Equalizer) */}
          <div className="bg-white rounded-[26px] p-5 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-250 card-interactive group">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-900 to-zinc-900 flex items-center justify-center text-purple-300 shadow-sm border border-purple-700/40">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-zinc-700">Trust wallet</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
                  {formatVal(82.25)}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                  ↗ +3.99
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto font-medium">42s ago</span>
              </div>
            </div>

            {/* Inner Dark Spectrum Container with Purple Pill */}
            <div className="bg-[#16171B] rounded-2xl p-3 text-white relative h-28 flex items-center px-4 overflow-hidden shadow-inner border border-white/[0.06]">
              <div className="flex items-center gap-1.5 w-full">
                <div className="w-10 h-8 rounded-xl bg-gradient-to-r from-[#DDD6FE] to-[#C4B5FD] shadow-md flex items-center justify-center text-purple-900 font-extrabold text-xs">
                  <Layers className="w-3.5 h-3.5 text-purple-900" />
                </div>
                {[...Array(18)].map((_, idx) => (
                  <div 
                    key={idx} 
                    className="w-1 rounded-full bg-white/25 transition-all" 
                    style={{ height: `${12 + (idx % 4) * 4}px` }}
                  ></div>
                ))}
              </div>
              <div className="absolute top-2.5 right-3 text-right">
                <span className="text-[11px] font-mono text-zinc-200 font-bold block">{formatVal(20.16)}</span>
                <span className="text-[8px] text-zinc-400 font-mono">Fri, Dec 31</span>
              </div>
            </div>
          </div>

          {/* Card 4: Crypto (Royal Blue Trending Curve) */}
          <div className="bg-white rounded-[26px] p-5 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-250 card-interactive group">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-900 to-zinc-900 flex items-center justify-center text-blue-400 shadow-sm border border-blue-700/40">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-zinc-700">Crypto</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
                  {formatVal(120.25)}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                  ↗ +4.99
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto font-medium">42s ago</span>
              </div>
            </div>

            {/* Inner Royal Blue Gradient Container */}
            <div className="bg-gradient-to-tr from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-2xl p-3 text-white relative h-28 flex flex-col justify-between overflow-hidden shadow-inner">
              <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible">
                <path 
                  d="M 5,34 L 38,32 L 62,14 L 95,12" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <circle cx="62" cy="14" r="3.5" fill="#FFFFFF" />
              </svg>
              <div className="absolute top-2.5 right-3 bg-white text-blue-900 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-md">
                {formatVal(20.16)}
              </div>
              <div className="absolute bottom-2.5 right-3 text-[9px] font-mono text-white/70">
                16 Dec
              </div>
            </div>
          </div>


        </div>
      </AnimatedContent>

      {/* Row 2: 3 Major Modules (Depth & Personality) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Module 1: "Ask AI" Card with 3D Animated Iris / Flower (3 cols on lg) */}
        <div className="lg:col-span-3 bg-white rounded-[28px] p-5 border border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between card-interactive relative overflow-hidden group">
          
          <div>
            {/* Top Tag: ✦ Ask AI */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/60 text-indigo-700 text-[11px] font-bold mb-3 shadow-xs">
              <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
              <span>Ask AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse ml-0.5"></span>
            </div>

            {/* 3D Iris / Flower Graphic with Purple/Indigo AI aesthetic */}
            <div className="relative w-full h-36 flex items-center justify-center my-1 select-none">
              <div className="absolute w-28 h-28 rounded-full bg-indigo-500/20 blur-xl"></div>
              
              {/* Petals */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-6 h-16 rounded-full bg-gradient-to-t from-[#6366F1] via-[#8B5CF6] to-[#38BDF8] opacity-80 shadow-md origin-bottom transform-gpu"
                    style={{ transform: `rotate(${deg}deg) translateY(-6px)` }}
                  ></div>
                ))}
                <div className="w-10 h-10 rounded-full bg-white shadow-xl z-10 flex items-center justify-center text-indigo-600 text-sm font-bold border border-indigo-100/80">
                  ✦
                </div>
              </div>
            </div>

            {/* Frosted Royal-Blue Interactive Prompt Card */}
            <div 
              onClick={() => {
                setSelectedAiPrompt('performance');
                setShowAiModal(true);
              }}
              className="bg-gradient-to-b from-[#3B82F6]/95 to-[#2563EB] backdrop-blur-md p-4 rounded-2xl text-white shadow-lg text-center mt-2 cursor-pointer group-hover:shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              <p className="text-xs sm:text-sm font-bold leading-snug">
                "How did my investments perform over the last 3 months?"
              </p>
              
              <div className="flex items-center justify-center gap-2 mt-3 opacity-90 text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-white/20 flex items-center gap-1 font-semibold text-[10px]">
                  <Sparkles className="w-2.5 h-2.5 text-teal-300" />
                  <span>Portfolio Yield</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 flex items-center gap-1 font-semibold text-[10px]">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-300" />
                  <span>Solvency</span>
                </span>
              </div>
            </div>
          </div>

          {/* Black Pill: ★ Ask AI Assistant */}
          <button 
            onClick={() => {
              setSelectedAiPrompt('performance');
              setShowAiModal(true);
            }}
            className="w-full bg-[#16171B] hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-full shadow-md flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 btn-interactive mt-4 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Ask AI Assistant</span>
          </button>
        </div>


        {/* Module 2: "Total balance $25,000.69" Hero Card (6 cols on lg) */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-6 border border-black/[0.05] shadow-[0_6px_28px_rgba(0,0,0,0.04)] flex flex-col justify-between card-interactive relative overflow-hidden">
          
          <div>
            {/* Top row: Total balance + Big amount + action icons */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-zinc-400">Total balance</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono tracking-tight mt-0.5">
                  <CountUp 
                    to={25000.69 * multiplier} 
                    decimals={2} 
                    prefix={symbol} 
                    duration={1.2} 
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setActiveTab('forecast')}
                  title="View Cash Flow Outlook"
                  className="w-8 h-8 rounded-xl bg-[#F3F4F7] hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  title="View Spending Velocity"
                  className="w-8 h-8 rounded-xl bg-[#F3F4F7] hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Bar Chart with Vertical Axis Labels */}
            <div className="relative w-full h-48 sm:h-56 flex items-end justify-between gap-3 sm:gap-4 pt-8 pb-3 px-2 border-b border-zinc-100">
              
              {/* Dynamic Tooltip on Active Mint Bar */}
              <div 
                className="absolute top-2 transition-all duration-200 bg-[#16171B] text-white rounded-xl px-3 py-1.5 text-xs shadow-xl z-20 pointer-events-none text-center border border-white/[0.08]"
                style={{ left: `${(hoveredBarIndex / (barData.length - 1)) * 72 + 6}%` }}
              >
                <div className="font-mono font-bold text-teal-300">{formatVal(activeBar.value)}</div>
                <div className="text-[10px] text-zinc-400 font-medium">{activeBar.date}</div>
              </div>

              {/* Background Reference Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-zinc-200 w-full text-[9px] text-zinc-400 font-mono">
                  {formatVal(3600, 0)}
                </div>
                <div className="border-b border-dashed border-zinc-200 w-full text-[9px] text-zinc-400 font-mono">
                  {formatVal(2700, 0)}
                </div>
                <div className="border-b border-dashed border-zinc-200 w-full text-[9px] text-zinc-400 font-mono">
                  {formatVal(1800, 0)}
                </div>
                <div className="border-b border-dashed border-zinc-200 w-full text-[9px] text-zinc-400 font-mono">
                  {formatVal(900, 0)}
                </div>
                <div className="border-b border-zinc-200 w-full text-[9px] text-zinc-400 font-mono">
                  {symbol}0
                </div>
              </div>

              {/* Bars */}
              {barData.map((bar, idx) => {
                const isActive = hoveredBarIndex === idx;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end h-full z-10 cursor-pointer group"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                  >
                    <div 
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-t from-[#5EEAD4] to-[#2DD4BF] shadow-lg shadow-teal-500/30'
                          : 'bg-zinc-100 group-hover:bg-zinc-200'
                      }`}
                      style={{ height: bar.height }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center justify-between pt-4 text-xs font-semibold">
            {['1W', '1M', '3M', '6M', 'YTD', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeframe(t)}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTimeframe === t
                    ? 'bg-[#16171B] text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

        </div>

        {/* Module 3: "Holding" Card (Deep Charcoal #16171B with High Contrast - 3 cols on lg) */}
        <div className="lg:col-span-3 bg-[#16171B] text-white rounded-[28px] p-5 shadow-xl flex flex-col justify-between card-interactive border border-white/[0.08]">
          
          <div>
            {/* Top row: Holding + See all holding > */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.08]">
              <h2 className="text-sm font-bold text-white tracking-tight">Holding</h2>
              <button 
                onClick={() => setActiveTab('transactions')}
                className="text-[11px] text-zinc-400 hover:text-teal-400 font-medium flex items-center gap-0.5 transition-colors"
              >
                <span>See all holding</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Asset Allocation Section */}
            <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-2">Portfolio Assets</div>
            
            <div className="space-y-2 mb-4">
              {/* Row 1: Near protocol */}
              <div 
                onClick={() => setActiveTab('transactions')}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#00E5FF] text-zinc-950 flex items-center justify-center font-bold text-xs shadow-sm">
                    N
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                      Near
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Near protocol
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-white">
                  {formatVal(1.98)}
                </div>
              </div>

              {/* Row 2: BTC */}
              <div 
                onClick={() => setActiveTab('transactions')}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    ₿
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                      BTC
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Bitcoin
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-white">
                  {formatVal(1.44)}
                </div>
              </div>
            </div>

            {/* Real-time Performance Section (distinct from Asset Allocation) */}
            <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-2 pt-2 border-t border-white/[0.08]">
              Real-time Performance
            </div>

            <div className="space-y-2">
              {/* Row 3: Near with Equalizer & 6.5% */}
              <div 
                onClick={() => setActiveTab('transactions')}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#00E5FF] text-zinc-950 flex items-center justify-center font-bold text-xs shadow-sm">
                    N
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                      Near
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Near protocol
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-emerald-400 rounded-full"></span>
                    <span className="w-0.5 h-3 bg-emerald-400 rounded-full"></span>
                    <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  </span>
                  <span>6.5%</span>
                </div>
              </div>

              {/* Row 4: BTC with Equalizer & 6.5% */}
              <div 
                onClick={() => setActiveTab('transactions')}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    ₿
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                      BTC
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Bitcoin
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-emerald-400 rounded-full"></span>
                    <span className="w-0.5 h-3 bg-emerald-400 rounded-full"></span>
                    <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  </span>
                  <span>6.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Feed Indicator */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-400">
            <span>Synchronized Holding Feed</span>
            <span className="flex items-center gap-1.5 text-[#35D9C5] font-semibold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35D9C5] animate-pulse"></span>
              <span>Active</span>
            </span>
          </div>

        </div>

      </div>

      {/* AI Assistant Modal: Fully Functional Financial Intelligence */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl text-zinc-900 border border-black/[0.08] animate-dropdown space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#18191E] to-zinc-800 text-teal-400 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
                    Fintrixity AI Financial Intelligence
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Live Portfolio & Cashflow Audit</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Prompt Selectors */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'performance', label: '3M Performance' },
                { id: 'affordability', label: 'SIP & Affordability' },
                { id: 'runway', label: 'Runway & Solvency' }
              ].map(prompt => (
                <button
                  key={prompt.id}
                  onClick={() => setSelectedAiPrompt(prompt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedAiPrompt === prompt.id 
                      ? 'bg-zinc-900 text-white shadow-sm' 
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* Dynamic AI Response Box */}
            <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-zinc-200/80 space-y-3">
              {selectedAiPrompt === 'performance' && (
                <>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    Over the last 90 days, your portfolio generated <strong className="text-emerald-600">+14.2% annualized returns</strong>. Your highest yield asset was <strong className="text-zinc-900">Equity & Crypto (+5.99%)</strong>, outperforming benchmark fixed deposits by 7.1%.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                      <span className="text-[10px] text-zinc-400 block font-semibold">Net Unrealized Gain</span>
                      <span className="font-mono font-bold text-emerald-600">+{formatVal(3420)}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                      <span className="text-[10px] text-zinc-400 block font-semibold">Sharpe Ratio</span>
                      <span className="font-mono font-bold text-zinc-900">2.41 (Optimal)</span>
                    </div>
                  </div>
                </>
              )}

              {selectedAiPrompt === 'affordability' && (
                <>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    Based on your average monthly inflow vs fixed outflow, you retain a liquid surplus of <strong className="text-emerald-600">+{formatVal(2850)}/month</strong>. You can safely allocate an additional <strong className="text-zinc-900">{formatVal(1500)}/mo</strong> to SIP investments without compromising your safety runway.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                      <span className="text-[10px] text-zinc-400 block font-semibold">Safe Monthly Allocation</span>
                      <span className="font-mono font-bold text-teal-600">{formatVal(1500)}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                      <span className="text-[10px] text-zinc-400 block font-semibold">Burn Velocity</span>
                      <span className="font-mono font-bold text-zinc-900">0.42 (Low Risk)</span>
                    </div>
                  </div>
                </>
              )}

              {selectedAiPrompt === 'runway' && (
                <>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    Your current liquid reserves stand at <strong className="text-zinc-900">{formatVal(18200)}</strong>. Under zero-income conditions, your liquid runway covers <strong className="text-emerald-600">228 days</strong> of essential expenses, comfortably exceeding the 180-day baseline recommendation.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                      <span className="text-[10px] text-zinc-400 block font-semibold">Zero-Income Runway</span>
                      <span className="font-mono font-bold text-emerald-600">228 Days</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-zinc-100">
                      <span className="text-[10px] text-zinc-400 block font-semibold">Solvency Score</span>
                      <span className="font-mono font-bold text-teal-600">98 / 100</span>
                    </div>
                  </div>
                </>
              )}

              {selectedAiPrompt === 'custom' && (
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  Analysis for <em>"{aiCustomQuery}"</em>: Your cash balance, spending habits, and asset distribution indicate safe operational bandwidth. Total liquid capital is {formatVal(25000.69)}.
                </p>
              )}
            </div>

            {/* Interactive Query Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (aiCustomQuery.trim()) {
                  setSelectedAiPrompt('custom');
                }
              }}
              className="flex items-center gap-2"
            >
              <input 
                type="text" 
                placeholder="Ask any question about your assets, runway, or bills..."
                value={aiCustomQuery}
                onChange={(e) => setAiCustomQuery(e.target.value)}
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-400"
              />
              <button 
                type="submit"
                className="bg-zinc-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-teal-400" />
                <span>Ask</span>
              </button>
            </form>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setShowAiModal(false);
                  setActiveTab('forecast');
                }}
                className="w-full bg-[#18191E] hover:bg-black text-white text-xs font-bold py-2.5 rounded-full shadow-md transition-all btn-interactive text-center"
              >
                Inspect Full Forecast & Outlook →
              </button>
            </div>

          </div>
        </div>
      )}


    </div>
  );
}
