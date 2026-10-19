import React, { useState } from 'react';
import { 
  Wallet, 
  Calculator, 
  TrendingUp, 
  ArrowRight, 
  MoreHorizontal, 
  RotateCcw, 
  ChevronDown, 
  Search, 
  SlidersHorizontal, 
  ArrowUpRight, 
  Coffee, 
  ShoppingBag, 
  Tv, 
  Gamepad2, 
  Car, 
  Home, 
  DollarSign, 
  Plus, 
  Edit3, 
  CreditCard, 
  X,
  Sparkles
} from 'lucide-react';

import SpotlightCard from './reactbits/SpotlightCard';
import BlurText from './reactbits/BlurText';
import AnimatedContent from './reactbits/AnimatedContent';
import CountUp from './reactbits/CountUp';
import ShinyText from './reactbits/ShinyText';

export default function Overview({ 
  accountsSummary, 
  stressData, 
  forecastData, 
  transactions = [], 
  onResetData, 
  onOpenOverrideModal,
  setActiveTab 
}) {
  const [selectedMonth, setSelectedMonth] = useState('This Month');
  const [cashflowPeriod, setCashflowPeriod] = useState('yearly');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(2); // March highlighted by default
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);

  // Dynamic values from backend API with seamless defaults matching image.png
  const liquidCash = accountsSummary?.total_liquid_cash ?? 28520.30;
  const savingsBalance = accountsSummary?.accounts?.find(a => a.account_type === 'savings')?.balance ?? 24800.45;
  const netWorth = accountsSummary?.net_worth ?? 70120.78;

  // Filter transactions
  const filteredTxs = (transactions || []).filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !categoryFilter || tx.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Monthly Bars (Jan - Jul from image.png)
  const barData = [
    { month: 'Jan', height: '52%', cashflow: '$28,450.00', inflow: '+$5,200.00', date: 'Jan 28, 2026' },
    { month: 'Feb', height: '44%', cashflow: '$24,100.00', inflow: '+$3,800.00', date: 'Feb 24, 2026' },
    { month: 'Mar', height: '88%', cashflow: '$33,847.00', inflow: '-$7,456.00', date: 'July 23, 2026', isHighlight: true },
    { month: 'Apr', height: '38%', cashflow: '$19,800.00', inflow: '+$4,500.00', date: 'Apr 20, 2026' },
    { month: 'May', height: '65%', cashflow: '$38,200.00', inflow: '+$8,900.00', date: 'May 18, 2026' },
    { month: 'Jun', height: '48%', cashflow: '$29,400.00', inflow: '+$6,100.00', date: 'Jun 22, 2026' },
    { month: 'Jul', height: '58%', cashflow: '$34,600.00', inflow: '+$7,200.00', date: 'Jul 26, 2026' },
  ];

  const getMerchantIcon = (category, desc = '') => {
    if (desc.toLowerCase().includes('software') || desc.toLowerCase().includes('license')) {
      return (
        <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-black text-xs">
          A
        </div>
      );
    }
    switch (category) {
      case 'Dining & Takeout':
        return <div className="w-8 h-8 rounded-full bg-[#FF5722]/20 text-[#FF5722] flex items-center justify-center"><Coffee className="w-4 h-4" /></div>;
      case 'Groceries':
        return <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><ShoppingBag className="w-4 h-4" /></div>;
      case 'Subscriptions':
        return <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><Tv className="w-4 h-4" /></div>;
      case 'Entertainment':
        return <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center"><Gamepad2 className="w-4 h-4" /></div>;
      case 'Transportation':
        return <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center"><Car className="w-4 h-4" /></div>;
      case 'Housing & Rent':
        return <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><Home className="w-4 h-4" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-[#FF5722]/20 text-[#FF5722] flex items-center justify-center"><DollarSign className="w-4 h-4" /></div>;
    }
  };

  const activeBar = barData[hoveredBarIndex] || barData[2];

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#08090C] relative">
      
      {/* Upper Half Ambient Orange Glow (Confined Strictly to Top Section) */}
      <div className="pointer-events-none absolute top-0 left-1/4 right-1/4 h-[340px] bg-[#FF5722]/12 blur-[130px] rounded-full -translate-y-1/3"></div>

      {/* Title Row with React Bits BlurText */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BlurText 
              text="Overview" 
              delay={80} 
              blur={6} 
              className="text-white font-extrabold" 
            />
            <span className="w-2 h-2 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722]"></span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">Here is the summary of overall data</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#14161E] border border-[#232634] text-white text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer hover:bg-[#1E202B] hover:border-[#FF5722]/40 transition-all btn-interactive">
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </div>
          <button 
            onClick={onResetData}
            className="flex items-center gap-2 bg-[#14161E] border border-[#232634] text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-[#1E202B] hover:border-[#FF5722]/40 transition-all active:scale-95 btn-interactive"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards with React Bits SpotlightCard & CountUp & AnimatedContent */}
      <AnimatedContent distance={25} duration={0.5} stagger={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: "My balance" - VIBRANT ORANGE GRADIENT with React Bits Spotlight & CountUp */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#FF3D00] via-[#FF5722] to-[#FFA000] p-5 sm:p-6 text-white shadow-xl shadow-[#FF5722]/30 flex flex-col justify-between min-h-[175px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#FF5722]/50 group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
                  <Wallet className="w-4 h-4 text-[#FF5722]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">My balance</h3>
                  <p className="text-[11px] text-white/80">Wallet Overview & Spending</p>
                </div>
              </div>
              <button className="text-white/70 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-baseline justify-between my-3">
              <div className="text-3xl font-extrabold tracking-tight">
                <CountUp to={liquidCash} decimals={2} duration={1.2} />
              </div>
              <div className="bg-white text-[#111215] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <span>+1.5%</span>
                <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('transactions')}
              className="flex items-center justify-between text-xs font-semibold text-white/90 hover:text-white pt-2.5 border-t border-white/20 transition-all group-hover:translate-x-0.5"
            >
              <span>See details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: "Savings account" - React Bits SpotlightCard */}
          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.28)" 
            className="flex flex-col justify-between min-h-[175px] p-5 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
                  <Calculator className="w-4 h-4 text-[#111215]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Savings account</h3>
                  <p className="text-[11px] text-[#9CA3AF]">Steady Growth Savings</p>
                </div>
              </div>
              <button className="text-[#6B7280] hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-baseline justify-between my-3">
              <div className="text-3xl font-extrabold tracking-tight text-white">
                <CountUp to={savingsBalance} decimals={2} duration={1.2} />
              </div>
              <div className="text-[11px] font-extrabold flex items-center gap-0.5">
                <ShinyText text="+3.2% ↑" speed={2.5} />
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('goals')}
              className="flex items-center justify-between text-xs font-semibold text-[#9CA3AF] hover:text-white pt-2.5 border-t border-[#232634] transition-all group-hover:translate-x-0.5"
            >
              <span>View summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </SpotlightCard>

          {/* Card 3: "Investment portfolio" - React Bits SpotlightCard */}
          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.28)" 
            className="flex flex-col justify-between min-h-[175px] p-5 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
                  <TrendingUp className="w-4 h-4 text-[#111215]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Investment portfolio</h3>
                  <p className="text-[11px] text-[#9CA3AF]">Track Your Wealth Growth</p>
                </div>
              </div>
              <button className="text-[#6B7280] hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-baseline justify-between my-3">
              <div className="text-3xl font-extrabold tracking-tight text-white">
                <CountUp to={netWorth} decimals={2} duration={1.2} />
              </div>
              <div className="text-[11px] font-extrabold flex items-center gap-0.5">
                <ShinyText text="+4.7% ↑" speed={2.5} />
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('forecast')}
              className="flex items-center justify-between text-xs font-semibold text-[#9CA3AF] hover:text-white pt-2.5 border-t border-[#232634] transition-all group-hover:translate-x-0.5"
            >
              <span>Analyze performance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </SpotlightCard>

        </div>
      </AnimatedContent>

      {/* Middle Section: My Wallet & Cash Flow with React Bits SpotlightCards */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Left Column: My Wallet (5 cols) wrapped in SpotlightCard */}
        <SpotlightCard 
          spotlightColor="rgba(255, 87, 34, 0.2)" 
          className="xl:col-span-5 flex flex-col justify-between p-5 sm:p-6"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white">My Wallet</h2>
              <button 
                onClick={() => setShowAddWalletModal(true)}
                className="bg-gradient-to-r from-[#FF5722] to-[#FF6D00] hover:from-[#F4511E] hover:to-[#FF5722] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md shadow-[#FF5722]/25 transition-all flex items-center gap-1 active:scale-95 btn-interactive"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New</span>
              </button>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mb-4">Today 1 USD = 122.20 BDT</p>

            {/* 2x2 Wallet Cards (Exact from image.png) */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Wallet 1: USD */}
              <div className="bg-[#101117] border border-[#20222C] hover:border-[#FF5722]/50 rounded-2xl p-3.5 flex flex-col justify-between transition-all group card-interactive">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🇺🇸</span>
                    <span className="text-xs font-bold text-[#9CA3AF]">USD</span>
                  </div>
                  <MoreHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
                </div>
                <div className="text-sm font-extrabold text-white mb-0.5">$24,678.00</div>
                <div className="text-[10px] text-[#6B7280] mb-2 font-medium">Limit is $10k a month</div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full w-max">
                  Active
                </span>
              </div>

              {/* Wallet 2: EUR */}
              <div className="bg-[#101117] border border-[#20222C] hover:border-[#FF5722]/50 rounded-2xl p-3.5 flex flex-col justify-between transition-all group card-interactive">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🇪🇺</span>
                    <span className="text-xs font-bold text-[#9CA3AF]">EUR</span>
                  </div>
                  <MoreHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
                </div>
                <div className="text-sm font-extrabold text-white mb-0.5">€28,345.00</div>
                <div className="text-[10px] text-[#6B7280] mb-2 font-medium">Limit is €8k a month</div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full w-max">
                  Active
                </span>
              </div>

              {/* Wallet 3: AUD */}
              <div className="bg-[#101117] border border-[#20222C] hover:border-[#FF5722]/50 rounded-2xl p-3.5 flex flex-col justify-between transition-all group card-interactive">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🇦🇺</span>
                    <span className="text-xs font-bold text-[#9CA3AF]">AUD</span>
                  </div>
                  <MoreHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
                </div>
                <div className="text-sm font-extrabold text-white mb-0.5">$20,517.52</div>
                <div className="text-[10px] text-[#6B7280] mb-2 font-medium">Limit is $10k a month</div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full w-max">
                  Active
                </span>
              </div>

              {/* Wallet 4: GBP */}
              <div className="bg-[#101117] border border-[#20222C] hover:border-[#FF5722]/50 rounded-2xl p-3.5 flex flex-col justify-between transition-all group card-interactive">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🇬🇧</span>
                    <span className="text-xs font-bold text-[#9CA3AF]">GBP</span>
                  </div>
                  <MoreHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
                </div>
                <div className="text-sm font-extrabold text-white mb-0.5">£25,000.00</div>
                <div className="text-[10px] text-[#6B7280] mb-2 font-medium">Limit is £7.5k a month</div>
                <span className="text-[10px] font-bold text-[#9CA3AF] bg-[#1E202B] px-2 py-0.5 rounded-full w-max">
                  Inactive
                </span>
              </div>

            </div>
          </div>
        </SpotlightCard>

        {/* Right Column: Cash Flow with SpotlightCard & Rounded Glowing Bars (7 cols) */}
        <SpotlightCard 
          spotlightColor="rgba(255, 87, 34, 0.2)" 
          className="xl:col-span-7 flex flex-col justify-between p-5 sm:p-6"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-[#9CA3AF] font-medium">Cash Flow</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  <CountUp to={540323.45} decimals={2} duration={1.5} />
                </div>
              </div>

              {/* Monthly / Yearly Toggle (from image.png) */}
              <div className="flex items-center bg-[#101117] border border-[#232634] p-1 rounded-xl text-xs font-semibold">
                <button 
                  onClick={() => setCashflowPeriod('monthly')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    cashflowPeriod === 'monthly' ? 'bg-[#1E202B] text-white shadow-sm' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setCashflowPeriod('yearly')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                    cashflowPeriod === 'yearly' ? 'bg-[#FF5722] text-white font-bold shadow-sm' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Yearly</span>
                </button>
              </div>
            </div>

            {/* Vertical Bar Chart Container */}
            <div className="relative pt-12 pb-2">
              
              {/* Dynamic Floating Tooltip over Active Bar (Exact from image.png) */}
              <div 
                className="absolute top-0 transition-all duration-300 pointer-events-none z-20"
                style={{
                  left: `${(hoveredBarIndex * 13.8) + 12}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="bg-[#1E202B] border border-[#333747] text-white rounded-xl px-3 py-2 text-[11px] shadow-2xl min-w-[125px]">
                  <div className="text-[10px] text-[#9CA3AF] mb-1 font-medium">{activeBar.date}</div>
                  <div className="flex justify-between gap-3 text-white font-bold">
                    <span className="text-[#9CA3AF] font-normal">Cashflow</span>
                    <span>{activeBar.cashflow}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-white font-bold">
                    <span className="text-[#9CA3AF] font-normal">Inflow</span>
                    <span className={activeBar.inflow.startsWith('+') ? 'text-emerald-400' : 'text-[#FF5722]'}>
                      {activeBar.inflow}
                    </span>
                  </div>
                </div>
              </div>

              {/* Y-Axis Grid Marks and Bars */}
              <div className="flex items-end justify-between h-44 gap-2 px-2">
                {barData.map((bar, idx) => {
                  const isHovered = hoveredBarIndex === idx;
                  return (
                    <div 
                      key={bar.month}
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                    >
                      {/* Bar Pillar */}
                      <div className="w-full max-w-[42px] h-full flex items-end">
                        <div 
                          className={`w-full rounded-2xl relative transition-all duration-300 ${
                            isHovered
                              ? 'bg-gradient-to-t from-[#FFA000] via-[#FF5722] to-[#FF3D00] shadow-lg shadow-[#FF5722]/40'
                              : 'bg-[#22242F] hover:bg-[#2D303E]'
                          }`}
                          style={{ height: bar.height }}
                        >
                          {/* Top Glowing Target Circle on Active Bar (from image.png) */}
                          {isHovered && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white bg-[#FF5722] flex items-center justify-center shadow-md animate-pulse">
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* X-Axis Month Label */}
                      <span className={`text-xs mt-3 transition-colors ${
                        isHovered ? 'text-white font-bold' : 'text-[#9CA3AF]'
                      }`}>
                        {bar.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SpotlightCard>

      </div>

      {/* Bottom Section: Recent Activities (Live SQLite Transaction Ledger from image.png) */}
      <div className="bg-[#111217] border border-[#20222B] rounded-3xl p-5 sm:p-6 text-white shadow-xl relative card-interactive">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Recent Activities</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#181A22] border border-[#2B2E3A] text-[#9CA3AF]">
              Live Ledger
            </span>
          </h2>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex items-center bg-[#101117] border border-[#232634] rounded-xl px-3 py-1.5 text-xs text-[#9CA3AF] w-full sm:w-56 focus-within:border-[#FF5722] transition-colors">
              <Search className="w-3.5 h-3.5 mr-2 text-[#6B7280] shrink-0" />
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white outline-none w-full placeholder-[#6B7280]"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#101117] border border-[#232634] text-xs text-[#9CA3AF] hover:text-white rounded-xl px-3 py-2 outline-none cursor-pointer pr-7 appearance-none"
              >
                <option value="">Filter =</option>
                <option value="Dining & Takeout">Dining & Takeout</option>
                <option value="Groceries">Groceries</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing & Rent">Housing & Rent</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Transactions Table (Responsive Container) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#20222C] text-[#6B7280]">
                <th className="pb-3 px-3 font-semibold w-8">
                  <input type="checkbox" className="rounded bg-[#20222C] border-none text-[#FF5722] focus:ring-0" />
                </th>
                <th className="pb-3 px-4 font-semibold">Activity</th>
                <th className="pb-3 px-4 font-semibold">Order ID</th>
                <th className="pb-3 px-4 font-semibold">Date</th>
                <th className="pb-3 px-4 font-semibold">Time</th>
                <th className="pb-3 px-4 font-semibold">Price</th>
                <th className="pb-3 px-4 font-semibold">Status</th>
                <th className="pb-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D1F2A] text-white">
              {filteredTxs.slice(0, 8).map((tx, idx) => {
                const orderId = `INV_${String(tx.id || (idx + 76)).padStart(6, '0')}`;
                const timeStr = idx % 2 === 0 ? '03:45 PM' : '11:20 AM';
                return (
                  <tr key={tx.id || idx} className="hover:bg-[#1A1C25] transition-colors group">
                    <td className="py-3.5 px-3">
                      <input type="checkbox" className="rounded bg-[#20222C] border-none text-[#FF5722] focus:ring-0" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {getMerchantIcon(tx.category, tx.description)}
                        <div>
                          <span className="font-semibold text-white group-hover:text-[#FF5722] transition-colors">
                            {tx.description}
                          </span>
                          <span className="block text-[10px] text-[#6B7280]">{tx.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#9CA3AF] text-[11px]">
                      {orderId}
                    </td>
                    <td className="py-3.5 px-4 text-[#9CA3AF] text-[11px] whitespace-nowrap">
                      {tx.date || '17 Apr, 2026'}
                    </td>
                    <td className="py-3.5 px-4 text-[#9CA3AF] text-[11px] whitespace-nowrap">
                      {timeStr}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={tx.amount < 0 ? 'text-white' : 'text-emerald-400'}>
                        {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `+$${tx.amount.toFixed(2)}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Completed</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={() => onOpenOverrideModal(tx)}
                        className="p-1 rounded-lg text-[#6B7280] hover:text-[#FF5722] hover:bg-[#252835] transition-colors"
                        title="Reclassify Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Wallet Modal */}
      {showAddWalletModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14161E] border border-[#232634] rounded-3xl p-6 w-full max-w-md shadow-2xl text-white animate-dropdown">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#FF5722]" />
                <span>Link Account or Wallet</span>
              </h3>
              <button onClick={() => setShowAddWalletModal(false)} className="text-[#9CA3AF] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Connect external bank accounts, credit cards, or foreign currency balances into your local zero-knowledge ledger.
            </p>
            <div className="space-y-3 mb-5">
              <input 
                type="text" 
                placeholder="Account Name (e.g. Schwab High Yield)" 
                className="w-full bg-[#101117] border border-[#232634] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5722]"
              />
              <select className="w-full bg-[#101117] border border-[#232634] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5722]">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowAddWalletModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#9CA3AF] hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddWalletModal(false)}
                className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#FF5722]/30 active:scale-95 transition-all"
              >
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
