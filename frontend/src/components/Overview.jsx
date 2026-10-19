import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Plus, 
  SlidersHorizontal, 
  ChevronRight, 
  Search, 
  HelpCircle, 
  CreditCard, 
  Wallet,
  Activity,
  Layers,
  CheckCircle,
  MoreHorizontal
} from 'lucide-react';
import CountUp from './reactbits/CountUp';
import AnimatedContent from './reactbits/AnimatedContent';
import { formatMoney, getConvertedValue, INDIAN_PERSONAS } from '../utils/currency';

export default function Overview({ 
  accountsSummary, 
  stressData, 
  forecastData, 
  transactions = [], 
  onResetData, 
  onOpenOverrideModal,
  setActiveTab,
  activeCurrency = 'INR',
  currentPersona = 'salaried'
}) {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(3);
  const [showAiModal, setShowAiModal] = useState(false);

  const persona = INDIAN_PERSONAS[currentPersona] || INDIAN_PERSONAS.salaried;

  // Monthly Cash Flow Bar Data (modeled from the reference image)
  const barData = [
    { period: 'Sep', height: '42%', value: 18500, label: 'Sep 25, 2026' },
    { period: 'Oct', height: '65%', value: 24200, label: 'Oct 25, 2026' },
    { period: 'Nov', height: '54%', value: 21000, label: 'Nov 25, 2026' },
    { period: 'Dec', height: '88%', value: 35420, label: 'Dec 25, 2026' }, // Highlighted active
    { period: 'Jan', height: '58%', value: 22800, label: 'Jan 25, 2027' },
    { period: 'Feb', height: '72%', value: 28400, label: 'Feb 25, 2027' },
    { period: 'Mar', height: '48%', value: 19600, label: 'Mar 25, 2027' },
  ];

  const activeBar = barData[hoveredBarIndex] || barData[3];

  // Baseline net balance
  const rawTotalBalance = accountsSummary?.total_balance ?? 25000.69;
  const totalBalanceDisplay = formatMoney(rawTotalBalance, activeCurrency);

  // Indian merchants for the high-contrast Recent Activity module
  const recentActivitiesList = [
    {
      id: 1,
      name: 'Zerodha Nifty 50 SIP',
      subtext: 'Auto Mutual Fund Debit',
      amount: activeCurrency === 'INR' ? 15000 : 180,
      isIncome: false,
      gain: '+14.2%',
      category: 'Investments',
      color: 'bg-emerald-500',
      sparkline: [20, 35, 45, 60, 50, 75, 90]
    },
    {
      id: 2,
      name: 'Employer Salary Deposit',
      subtext: 'Monthly Payroll ACH',
      amount: activeCurrency === 'INR' ? persona.salaryMonthly : persona.salaryMonthly / 83,
      isIncome: true,
      gain: 'Credited',
      category: 'Income',
      color: 'bg-teal-500',
      sparkline: [30, 40, 50, 60, 70, 80, 95]
    },
    {
      id: 3,
      name: 'Koramangala Residency',
      subtext: 'Monthly Rent Payment',
      amount: activeCurrency === 'INR' ? 24500 : 295,
      isIncome: false,
      gain: 'Scheduled',
      category: 'Housing',
      color: 'bg-indigo-500',
      sparkline: [60, 50, 55, 40, 45, 30, 20]
    },
    {
      id: 4,
      name: 'Swiggy Gourmet Orders',
      subtext: 'UPI Instant Debit',
      amount: activeCurrency === 'INR' ? 840 : 10.50,
      isIncome: false,
      gain: '-2.4%',
      category: 'Dining',
      color: 'bg-amber-500',
      sparkline: [30, 45, 60, 35, 50, 40, 25]
    },
    {
      id: 5,
      name: 'Blinkit Instant Groceries',
      subtext: 'UPI Quick Pay',
      amount: activeCurrency === 'INR' ? 1420 : 17.20,
      isIncome: false,
      gain: '-1.1%',
      category: 'Groceries',
      color: 'bg-yellow-500',
      sparkline: [25, 30, 45, 40, 55, 45, 35]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F4F6FA] text-zinc-900">
      
      {/* Subheader Row: Page Title + Tab Pills + Action Buttons (Exact from image.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Title + Overview/Holding switch pills */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Portfolio
          </h1>
          
          <div className="flex items-center bg-white p-1 rounded-full border border-black/[0.05] shadow-sm">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSubTab === 'overview'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSubTab === 'activity'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Right Action Pills */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setActiveTab('forecast')}
            className="flex items-center gap-2 bg-white hover:bg-zinc-50 border border-black/[0.06] text-zinc-800 text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-all active:scale-95 btn-interactive"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Invest sign</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('transactions')}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all active:scale-95 btn-interactive"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Sleek Rounded Cards from image.png */}
      <AnimatedContent distance={20} duration={0.4} stagger={0.08}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: HDFC Bank / Checking (Coinbase style) */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all card-interactive group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-800">
                  ●
                </div>
                <span className="text-xs font-bold text-zinc-700">HDFC Primary A/c</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
                  {formatMoney(42.50 * 300, activeCurrency, false)}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ↗ +5.99
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto">56s ago</span>
              </div>
            </div>

            {/* Inner Dark Container with Line Graph (from image.png) */}
            <div className="bg-[#14151B] rounded-2xl p-3 text-white relative h-24 flex flex-col justify-between overflow-hidden shadow-inner">
              <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible">
                <path 
                  d="M 5,28 L 20,24 L 35,32 L 50,18 L 65,24 L 80,12 L 95,20" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <circle cx="80" cy="12" r="3.5" fill="#FFFFFF" />
                <line x1="80" y1="12" x2="80" y2="40" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
              </svg>
              <div className="absolute bottom-2 right-3 text-right">
                <span className="text-[10px] font-mono text-zinc-300 font-bold block">{activeCurrency === 'INR' ? '₹25,000' : '$25.00'}</span>
                <span className="text-[8px] text-zinc-500 font-mono">Fri, Dec 31</span>
              </div>
            </div>
          </div>

          {/* Card 2: Zerodha Mutual Funds (Trust wallet cyan style) */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all card-interactive group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-600">
                  ✦
                </div>
                <span className="text-xs font-bold text-zinc-700">Zerodha Growth SIP</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
                  {formatMoney(56.20 * 300, activeCurrency, false)}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ↗ +5.99
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto">56s ago</span>
              </div>
            </div>

            {/* Inner Cyan/Teal Gradient Container with Bars (from image.png) */}
            <div className="bg-gradient-to-tr from-[#00E5FF] to-[#00B4D8] rounded-2xl p-3 text-white relative h-24 flex items-end justify-between overflow-hidden shadow-inner">
              <div className="flex items-end gap-1.5 w-full h-full pb-1">
                {[30, 45, 20, 60, 40, 75, 50, 85, 30, 65, 90, 45, 55].map((h, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-t-sm transition-all ${i === 8 ? 'bg-white shadow-sm' : 'bg-white/40'}`} 
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
              <div className="absolute top-2 right-3 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[9px] font-mono text-white">
                {activeCurrency === 'INR' ? '₹16,240' : '$16.24'}
              </div>
            </div>
          </div>

          {/* Card 3: ICICI Emergency Fixed Deposit (Spectrum dark style) */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all card-interactive group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-800">
                  ∞
                </div>
                <span className="text-xs font-bold text-zinc-700">ICICI Emergency FD</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
                  {formatMoney(82.25 * 300, activeCurrency, false)}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ↗ +3.99
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto">42s ago</span>
              </div>
            </div>

            {/* Inner Dark Spectrum Container (from image.png) */}
            <div className="bg-[#14151B] rounded-2xl p-3 text-white relative h-24 flex items-center justify-between overflow-hidden shadow-inner">
              <div className="flex items-center gap-1 w-full">
                <div className="w-10 h-7 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-300"></div>
                {[...Array(20)].map((_, idx) => (
                  <div 
                    key={idx} 
                    className="w-1 rounded-full bg-white/20" 
                    style={{ height: `${14 + (idx % 4) * 4}px` }}
                  ></div>
                ))}
              </div>
              <div className="absolute top-2 right-3 text-[10px] font-mono text-zinc-300 font-bold">
                {activeCurrency === 'INR' ? '₹20,160' : '$20.16'}
              </div>
            </div>
          </div>

          {/* Card 4: UPI & Digital Wallet (Royal Blue style) */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all card-interactive group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                  🛡
                </div>
                <span className="text-xs font-bold text-zinc-700">UPI & Liquid Wallet</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
                  {formatMoney(120.25 * 300, activeCurrency, false)}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ↗ +4.99
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto">42s ago</span>
              </div>
            </div>

            {/* Inner Royal Blue Gradient Container (from image.png) */}
            <div className="bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] rounded-2xl p-3 text-white relative h-24 flex flex-col justify-between overflow-hidden shadow-inner">
              <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible">
                <path 
                  d="M 5,35 L 35,32 L 60,15 L 95,12" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <circle cx="60" cy="15" r="4" fill="#FFFFFF" />
              </svg>
              <div className="absolute top-2 right-3 bg-white text-blue-900 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-sm">
                {activeCurrency === 'INR' ? '₹20,160' : '$20.16'}
              </div>
              <div className="absolute bottom-2 right-3 text-[9px] font-mono text-white/70">
                16 Dec
              </div>
            </div>
          </div>

        </div>
      </AnimatedContent>

      {/* Row 2: 3 Major Modules from image.png (Question of Day / Total Balance Chart / Recent Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Module 1: AI Assistant / Question of the Day (3 cols on lg) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between card-interactive relative overflow-hidden">
          
          <div>
            {/* Top pill tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-semibold mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
              <span>Question of the day</span>
            </div>

            {/* 3D Iris / Flower Glass Graphic (exact recreation from image.png) */}
            <div className="relative w-full h-36 flex items-center justify-center my-1">
              <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 blur-xl"></div>
              {/* Petal illustration */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-8 h-16 rounded-full bg-gradient-to-t from-blue-600 via-indigo-400 to-blue-300 opacity-80 shadow-md origin-bottom"
                    style={{ transform: `rotate(${deg}deg) translateY(-8px)` }}
                  ></div>
                ))}
                <div className="w-8 h-8 rounded-full bg-white shadow-lg z-10 flex items-center justify-center text-blue-600 text-xs font-bold">
                  ✦
                </div>
              </div>
            </div>

            {/* Frosted Question Card (from image.png) */}
            <div className="bg-gradient-to-b from-blue-500/90 to-blue-600 p-4 rounded-2xl text-white shadow-lg text-center mt-2">
              <p className="text-xs sm:text-sm font-semibold leading-snug">
                How did my investments & savings perform over the last 3 months?
              </p>
              
              <div className="flex items-center justify-center gap-2 mt-3 opacity-80 text-[10px]">
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">●</span>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">🛡</span>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">∞</span>
              </div>
            </div>
          </div>

          {/* Ask AI Assistant Button */}
          <button 
            onClick={() => setShowAiModal(true)}
            className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all btn-interactive mt-4 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask AI Assistant</span>
          </button>
        </div>

        {/* Module 2: Total Balance & Interactive Cash Flow Bar Chart (6 cols on lg) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between card-interactive">
          
          <div>
            {/* Header: Total Balance + Metric Toggles */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-zinc-500">Total balance</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono tracking-tight mt-0.5">
                  <CountUp 
                    to={getConvertedValue(rawTotalBalance, activeCurrency, true)} 
                    decimals={2} 
                    prefix={activeCurrency === 'INR' ? '₹' : '$'} 
                    duration={1.2} 
                  />
                </div>
              </div>

              {/* View Toggle Icons (from image.png) */}
              <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-full">
                <button className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-800 text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-full hover:bg-zinc-200 flex items-center justify-center text-zinc-500 text-xs">
                  <Activity className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Bar Chart Area with Tooltip (from image.png) */}
            <div className="relative w-full h-48 sm:h-56 flex items-end justify-between gap-3 sm:gap-4 pt-8 pb-3 px-2 border-b border-zinc-100">
              
              {/* Tooltip on Active Bar */}
              <div 
                className="absolute top-2 transition-all duration-200 bg-zinc-900 text-white rounded-xl px-3 py-1.5 text-xs shadow-xl z-20 pointer-events-none text-center"
                style={{ left: `${(hoveredBarIndex / (barData.length - 1)) * 75 + 5}%` }}
              >
                <div className="font-mono font-bold">{formatMoney(activeBar.value, activeCurrency, true)}</div>
                <div className="text-[10px] text-zinc-400 font-medium">{activeBar.label}</div>
              </div>

              {/* Background Reference Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-zinc-200 w-full text-[9px] text-zinc-400 font-mono">
                  {formatMoney(35000, activeCurrency, true)}
                </div>
                <div className="border-b border-dashed border-zinc-200 w-full text-[9px] text-zinc-400 font-mono">
                  {formatMoney(25000, activeCurrency, true)}
                </div>
                <div className="border-b border-dashed border-zinc-200 w-full text-[9px] text-zinc-400 font-mono">
                  {formatMoney(15000, activeCurrency, true)}
                </div>
                <div className="border-b border-zinc-200 w-full"></div>
              </div>

              {/* Bars */}
              {barData.map((bar, idx) => {
                const isActive = hoveredBarIndex === idx;
                return (
                  <div
                    key={bar.period}
                    className="flex-1 flex flex-col items-center justify-end h-full z-10 cursor-pointer group"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                  >
                    <div 
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-t from-teal-400/90 to-teal-300 shadow-md shadow-teal-500/20 scale-y-100'
                          : 'bg-zinc-100 group-hover:bg-zinc-200'
                      }`}
                      style={{ height: bar.height }}
                    ></div>
                    <span className={`text-[11px] font-bold mt-2 transition-colors ${isActive ? 'text-zinc-900 font-extrabold' : 'text-zinc-400'}`}>
                      {bar.period}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeframe selector pills (from image.png: 1W, 1M, 3M, 6M, YTD, 1Y) */}
          <div className="flex items-center justify-between pt-4 text-xs font-semibold">
            {['1W', '1M', '3M', '6M', 'YTD', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeframe(t)}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTimeframe === t
                    ? 'bg-zinc-900 text-white font-bold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

        </div>

        {/* Module 3: Recent Activity (Holding style from image.png - 3 cols on lg) */}
        <div className="lg:col-span-3 bg-[#111216] text-white rounded-3xl p-5 shadow-2xl flex flex-col justify-between card-interactive">
          
          <div>
            {/* Header: Title + See all holding > */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
              <h2 className="text-sm font-bold text-white tracking-tight">Recent Activity</h2>
              <button 
                onClick={() => setActiveTab('transactions')}
                className="text-[11px] text-zinc-400 hover:text-white font-medium flex items-center gap-0.5 transition-colors"
              >
                <span>See all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* List of High-Contrast Activities (from image.png Holding section) */}
            <div className="space-y-3.5">
              {recentActivitiesList.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setActiveTab('transactions')}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Colored Avatar */}
                    <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center font-bold text-white text-xs shadow-sm group-hover:scale-105 transition-transform`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors truncate max-w-[110px]">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate max-w-[100px]">
                        {item.subtext}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-mono font-bold ${item.isIncome ? 'text-emerald-400' : 'text-white'}`}>
                      {item.isIncome ? '+' : '-'}{formatMoney(item.amount, activeCurrency, false)}
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                      {item.gain}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Footer Action */}
          <div className="pt-3 border-t border-white/[0.08] mt-3 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Live Local DB Ledger</span>
            <span className="font-mono text-teal-400 font-semibold">Verified</span>
          </div>

        </div>

      </div>

      {/* AI Assistant Insight Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-zinc-900 border border-black/[0.08] animate-dropdown">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Fintrixity AI Assistant</h3>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="text-zinc-400 hover:text-zinc-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              Based on your last 3 months of transaction activity in <strong>{persona.location}</strong>:
            </p>

            <div className="space-y-2.5 mb-6 bg-[#F8F9FC] p-4 rounded-2xl border border-zinc-200">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-600">Net Savings Inflow:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {formatMoney(persona.salaryMonthly * 0.35, activeCurrency, false)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-600">SIP Investment Rate:</span>
                <span className="font-mono font-bold text-teal-600">
                  {formatMoney(persona.salaryMonthly * 0.15, activeCurrency, false)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-600">Solvency Safety Buffer:</span>
                <span className="font-mono font-bold text-zinc-900">228 Days (Low Vulnerability)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowAiModal(false);
                setActiveTab('forecast');
              }}
              className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-bold py-3 rounded-2xl shadow-md transition-all"
            >
              View Full Predictive Forecast
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
