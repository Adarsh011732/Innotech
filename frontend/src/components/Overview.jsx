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
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#090A0D]">
      
      {/* Title Row with React Bits BlurText */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BlurText 
              text="Overview" 
              delay={40} 
              blur={4} 
              className="text-white font-bold" 
            />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Consolidated liquidity, cashflow turnover, and ledger activities</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-[#13161C] border border-white/[0.08] text-white text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer hover:border-white/[0.18] transition-colors btn-interactive">
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <button 
            onClick={onResetData}
            className="flex items-center gap-1.5 bg-[#13161C] border border-white/[0.08] text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-md hover:text-white hover:border-white/[0.18] transition-colors active:scale-95 btn-interactive"
            title="Reload baseline data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards: Main Balance Hero + Supporting Summaries */}
      <AnimatedContent distance={15} duration={0.4} stagger={0.06}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: PRIMARY FINANCIAL BALANCE (The Primary Visual Focus) */}
          <div className="relative overflow-hidden rounded-xl bg-[#141720] border-t-2 border-t-[#FF5722] border-x border-b border-white/[0.08] p-5 text-white shadow-sm flex flex-col justify-between min-h-[170px] transition-all duration-200 hover:border-white/[0.16] group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center border border-[#FF5722]/25">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-200">Net Available Balance</h3>
                  <p className="text-[11px] text-zinc-400">Total Liquid Capital</p>
                </div>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-medium px-2 py-0.5 rounded flex items-center gap-0.5">
                <span>+1.5%</span>
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </div>
            </div>

            <div className="my-3">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                <CountUp to={liquidCash} decimals={2} duration={1.0} />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Reconciled across 4 multi-currency accounts</p>
            </div>

            <button 
              onClick={() => setActiveTab('transactions')}
              className="flex items-center justify-between text-xs font-medium text-zinc-400 hover:text-white pt-2.5 border-t border-white/[0.06] transition-colors group-hover:text-zinc-200"
            >
              <span>View ledger details</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Card 2: Savings Account (Supporting Summary) */}
          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.12)" 
            className="flex flex-col justify-between min-h-[170px] p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-white/[0.05] text-zinc-300 flex items-center justify-center border border-white/[0.08]">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-200">High-Yield Reserves</h3>
                  <p className="text-[11px] text-zinc-400">Emergency & Savings Buffer</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                +3.2% APY
              </span>
            </div>

            <div className="my-3">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                <CountUp to={savingsBalance} decimals={2} duration={1.0} />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">3.8 months fixed obligations covered</p>
            </div>

            <button 
              onClick={() => setActiveTab('goals')}
              className="flex items-center justify-between text-xs font-medium text-zinc-400 hover:text-white pt-2.5 border-t border-white/[0.06] transition-colors"
            >
              <span>View savings milestone</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </SpotlightCard>

          {/* Card 3: Investment Portfolio (Supporting Summary) */}
          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.12)" 
            className="flex flex-col justify-between min-h-[170px] p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-white/[0.05] text-zinc-300 flex items-center justify-center border border-white/[0.08]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-200">Investment Portfolio</h3>
                  <p className="text-[11px] text-zinc-400">Securities & Yield Holdings</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                +4.7% YTD
              </span>
            </div>

            <div className="my-3">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                <CountUp to={netWorth} decimals={2} duration={1.0} />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">CQR confidence intervals healthy</p>
            </div>

            <button 
              onClick={() => setActiveTab('forecast')}
              className="flex items-center justify-between text-xs font-medium text-zinc-400 hover:text-white pt-2.5 border-t border-white/[0.06] transition-colors"
            >
              <span>Analyze trajectory</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </SpotlightCard>

        </div>
      </AnimatedContent>

      {/* Middle Section: Liquidity Accounts (5 cols) & Consolidated Cash Flow (7 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left Column: Liquidity Accounts (5 cols) */}
        <div className="xl:col-span-5 bg-[#13161C] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-semibold text-white">Liquidity Accounts</h2>
                <p className="text-[11px] text-zinc-400">FX Reference: 1 USD = 122.20 BDT</p>
              </div>
              <button 
                onClick={() => setShowAddWalletModal(true)}
                className="bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-medium px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 active:scale-95 btn-interactive shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Account</span>
              </button>
            </div>

            {/* 2x2 Clean Account Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-3.5">
              
              {/* Wallet 1: USD */}
              <div className="bg-[#0E1015] border border-white/[0.06] hover:border-white/[0.14] rounded-lg p-3 flex flex-col justify-between transition-colors card-interactive">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🇺🇸</span>
                    <span className="text-xs font-semibold text-zinc-300">USD</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active"></span>
                </div>
                <div className="text-sm font-bold font-mono text-white mb-0.5 tabular-nums">$24,678.00</div>
                <div className="text-[10px] text-zinc-500 font-mono">Limit $10k/mo • Active</div>
              </div>

              {/* Wallet 2: EUR */}
              <div className="bg-[#0E1015] border border-white/[0.06] hover:border-white/[0.14] rounded-lg p-3 flex flex-col justify-between transition-colors card-interactive">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🇪🇺</span>
                    <span className="text-xs font-semibold text-zinc-300">EUR</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active"></span>
                </div>
                <div className="text-sm font-bold font-mono text-white mb-0.5 tabular-nums">€28,345.00</div>
                <div className="text-[10px] text-zinc-500 font-mono">Limit €8k/mo • Active</div>
              </div>

              {/* Wallet 3: AUD */}
              <div className="bg-[#0E1015] border border-white/[0.06] hover:border-white/[0.14] rounded-lg p-3 flex flex-col justify-between transition-colors card-interactive">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🇦🇺</span>
                    <span className="text-xs font-semibold text-zinc-300">AUD</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active"></span>
                </div>
                <div className="text-sm font-bold font-mono text-white mb-0.5 tabular-nums">$20,517.52</div>
                <div className="text-[10px] text-zinc-500 font-mono">Limit $10k/mo • Active</div>
              </div>

              {/* Wallet 4: GBP */}
              <div className="bg-[#0E1015] border border-white/[0.06] hover:border-white/[0.14] rounded-lg p-3 flex flex-col justify-between transition-colors card-interactive">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🇬🇧</span>
                    <span className="text-xs font-semibold text-zinc-300">GBP</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" title="Reserved"></span>
                </div>
                <div className="text-sm font-bold font-mono text-white mb-0.5 tabular-nums">£25,000.00</div>
                <div className="text-[10px] text-zinc-500 font-mono">Limit £7.5k/mo • Reserved</div>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] mt-4 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Operating liquidity reconciled</span>
            <span className="font-mono text-zinc-300">Total: $98,540.52</span>
          </div>
        </div>

        {/* Right Column: Cash Flow Chart with Guide Lines & Tooltips (7 cols) */}
        <div className="xl:col-span-7 bg-[#13161C] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-zinc-400 font-medium">Consolidated Cash Flow</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 font-mono tabular-nums">
                  <CountUp to={540323.45} decimals={2} duration={1.2} />
                </div>
              </div>

              {/* Monthly / Yearly Toggle */}
              <div className="flex items-center bg-[#0E1015] border border-white/[0.08] p-0.5 rounded-md text-xs font-medium">
                <button 
                  onClick={() => setCashflowPeriod('monthly')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    cashflowPeriod === 'monthly' ? 'bg-[#181C24] text-white font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setCashflowPeriod('yearly')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                    cashflowPeriod === 'yearly' ? 'bg-[#FF5722] text-white font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Yearly</span>
                </button>
              </div>
            </div>

            {/* Vertical Bar Chart Container */}
            <div className="relative pt-10 pb-2">
              
              {/* Dynamic Floating Tooltip over Active Bar */}
              <div 
                className="absolute top-0 transition-all duration-200 pointer-events-none z-20"
                style={{
                  left: `${(hoveredBarIndex * 13.8) + 12}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="bg-[#181C24] border border-white/[0.14] text-white rounded-lg px-3 py-2 text-[11px] shadow-xl min-w-[130px]">
                  <div className="text-[10px] text-zinc-400 mb-1 font-mono font-medium">{activeBar.date}</div>
                  <div className="flex justify-between gap-3 text-white font-semibold">
                    <span className="text-zinc-400 font-normal">Cashflow</span>
                    <span className="font-mono">{activeBar.cashflow}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-white font-semibold">
                    <span className="text-zinc-400 font-normal">Net Delta</span>
                    <span className={`font-mono ${activeBar.inflow.startsWith('+') ? 'text-emerald-400' : 'text-[#EF4444]'}`}>
                      {activeBar.inflow}
                    </span>
                  </div>
                </div>
              </div>

              {/* Horizontal Reference Grid Guidelines */}
              <div className="absolute inset-x-2 top-10 bottom-8 flex flex-col justify-between pointer-events-none z-0">
                <div className="border-b border-white/[0.04] w-full flex justify-between">
                  <span className="text-[9px] font-mono text-zinc-600 -translate-y-2">$40k</span>
                </div>
                <div className="border-b border-white/[0.04] w-full flex justify-between">
                  <span className="text-[9px] font-mono text-zinc-600 -translate-y-2">$30k</span>
                </div>
                <div className="border-b border-white/[0.04] w-full flex justify-between">
                  <span className="text-[9px] font-mono text-zinc-600 -translate-y-2">$20k</span>
                </div>
                <div className="border-b border-white/[0.04] w-full flex justify-between">
                  <span className="text-[9px] font-mono text-zinc-600 -translate-y-2">$10k</span>
                </div>
              </div>

              {/* Y-Axis Grid Marks and Bars */}
              <div className="flex items-end justify-between h-40 gap-2 px-3 relative z-10">
                {barData.map((bar, idx) => {
                  const isHovered = hoveredBarIndex === idx;
                  return (
                    <div 
                      key={bar.month}
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                    >
                      {/* Bar Pillar */}
                      <div className="w-full max-w-[36px] h-full flex items-end">
                        <div 
                          className={`w-full rounded-md relative transition-all duration-200 ${
                            isHovered
                              ? 'bg-gradient-to-t from-[#FFA000] via-[#FF5722] to-[#FF3D00] shadow-md shadow-[#FF5722]/30'
                              : 'bg-[#1C202B] hover:bg-[#252B3A] border border-white/[0.06]'
                          }`}
                          style={{ height: bar.height }}
                        >
                          {/* Top Beacon Dot on Active Bar */}
                          {isHovered && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-white bg-[#FF5722] flex items-center justify-center shadow-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* X-Axis Month Label */}
                      <span className={`text-[11px] mt-2.5 transition-colors font-medium ${
                        isHovered ? 'text-white font-bold' : 'text-zinc-500'
                      }`}>
                        {bar.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Activities (Clean Institutional Table) */}
      <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Recent Activities</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.06]">
              {filteredTxs.length} Transactions
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="flex items-center bg-[#0E1015] border border-white/[0.08] rounded-md px-2.5 py-1 text-xs text-zinc-300 w-full sm:w-52 focus-within:border-[#FF5722] transition-colors">
              <Search className="w-3.5 h-3.5 mr-2 text-zinc-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Search description or category" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white outline-none w-full placeholder-zinc-500 text-xs"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#0E1015] border border-white/[0.08] text-xs text-zinc-300 hover:text-white rounded-md px-2.5 py-1.5 outline-none cursor-pointer pr-6 appearance-none"
              >
                <option value="">All Categories</option>
                <option value="Dining & Takeout">Dining & Takeout</option>
                <option value="Groceries">Groceries</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing & Rent">Housing & Rent</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.07] text-zinc-400 bg-white/[0.02]">
                <th className="py-2.5 px-3 font-medium w-8">
                  <input type="checkbox" className="rounded bg-[#1A1D26] border-white/[0.1] text-[#FF5722] focus:ring-0 cursor-pointer" />
                </th>
                <th className="py-2.5 px-3 font-medium">Activity</th>
                <th className="py-2.5 px-3 font-medium">Reference ID</th>
                <th className="py-2.5 px-3 font-medium">Date</th>
                <th className="py-2.5 px-3 font-medium">Time</th>
                <th className="py-2.5 px-3 font-medium text-right">Price</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white">
              {filteredTxs.slice(0, 10).map((tx, idx) => {
                const orderId = `INV_${String(tx.id || (idx + 76)).padStart(6, '0')}`;
                const timeStr = idx % 2 === 0 ? '03:45 PM' : '11:20 AM';
                const isPositive = tx.amount > 0;
                return (
                  <tr key={tx.id || idx} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-2.5 px-3">
                      <input type="checkbox" className="rounded bg-[#1A1D26] border-white/[0.1] text-[#FF5722] focus:ring-0 cursor-pointer" />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        {getMerchantIcon(tx.category, tx.description)}
                        <div>
                          <span className="font-medium text-white group-hover:text-[#FF5722] transition-colors block">
                            {tx.description}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">{tx.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">
                      {orderId}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400 text-[11px] whitespace-nowrap font-mono">
                      {tx.date || '17 Apr, 2026'}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500 text-[11px] whitespace-nowrap font-mono">
                      {timeStr}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-right tabular-nums">
                      <span className={isPositive ? 'text-emerald-400' : 'text-zinc-200'}>
                        {isPositive ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Settled</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button 
                        onClick={() => onOpenOverrideModal(tx)}
                        className="p-1 rounded text-zinc-500 hover:text-[#FF5722] hover:bg-white/[0.06] transition-colors"
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
          <div className="bg-[#13161C] border border-white/[0.1] rounded-xl p-5 w-full max-w-md shadow-2xl text-white animate-dropdown">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#FF5722]" />
                <span>Link Account or Wallet</span>
              </h3>
              <button onClick={() => setShowAddWalletModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Connect external depository accounts, liquidity lines, or foreign currency balances into your local ledger.
            </p>
            <div className="space-y-3 mb-5">
              <input 
                type="text" 
                placeholder="Account Name (e.g. Goldman Marcus Reserve)" 
                className="w-full bg-[#0E1015] border border-white/[0.08] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5722]"
              />
              <select className="w-full bg-[#0E1015] border border-white/[0.08] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5722]">
                <option value="USD">USD ($) - Primary Clearing</option>
                <option value="EUR">EUR (€) - SEPA Zone</option>
                <option value="GBP">GBP (£) - UK BACS</option>
                <option value="AUD">AUD ($) - Reserve Line</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowAddWalletModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddWalletModal(false)}
                className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-sm active:scale-95 transition-all"
              >
                Link Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
