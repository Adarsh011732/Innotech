import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  ArrowUpDown, 
  Edit3, 
  UtensilsCrossed, 
  Gamepad2, 
  ShoppingBag, 
  Zap, 
  Home, 
  Car, 
  Tv, 
  GraduationCap, 
  HeartPulse, 
  MoreHorizontal, 
  Calendar, 
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  RotateCcw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import CountUp from './reactbits/CountUp';
import AnimatedContent from './reactbits/AnimatedContent';
import { formatMoney } from '../utils/currency';
import InflowOutflowCard from './InflowOutflowCard';
import CustomDropdown from './CustomDropdown';

// The 10 Canonical Expense Categories as specified
export const EXPENSE_CATEGORIES = [
  {
    id: 'Food & Dining',
    label: 'Food & Dining',
    icon: UtensilsCrossed,
    color: '#F59E0B', // Amber
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
    barClass: 'bg-amber-500'
  },
  {
    id: 'Gaming',
    label: 'Gaming',
    icon: Gamepad2,
    color: '#7C3AED', // Fintrixity Purple
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/60',
    barClass: 'bg-purple-600'
  },
  {
    id: 'Shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: '#2563EB', // Fintrixity Blue
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/60',
    barClass: 'bg-blue-600'
  },
  {
    id: 'Online Payments',
    label: 'Online Payments',
    icon: Zap,
    color: '#0F9F90', // Fintrixity Turquoise
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200/60',
    barClass: 'bg-teal-500'
  },
  {
    id: 'Bills & Utilities',
    label: 'Bills & Utilities',
    icon: Home,
    color: '#EA580C', // Orange
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200/60',
    barClass: 'bg-orange-500'
  },
  {
    id: 'Travel & Transport',
    label: 'Travel & Transport',
    icon: Car,
    color: '#0284C7', // Sky Blue
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200/60',
    barClass: 'bg-sky-500'
  },
  {
    id: 'Subscriptions',
    label: 'Subscriptions',
    icon: Tv,
    color: '#6366F1', // Indigo
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200/60',
    barClass: 'bg-indigo-500'
  },
  {
    id: 'Education',
    label: 'Education',
    icon: GraduationCap,
    color: '#10B981', // Emerald
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    barClass: 'bg-emerald-500'
  },
  {
    id: 'Healthcare',
    label: 'Healthcare',
    icon: HeartPulse,
    color: '#E11D48', // Rose
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/60',
    barClass: 'bg-rose-500'
  },
  {
    id: 'Other',
    label: 'Other',
    icon: MoreHorizontal,
    color: '#71717A', // Zinc
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-200',
    barClass: 'bg-zinc-500'
  }
];

// Precision heuristic mapper to categorize any transaction into the canonical 10
export function getCanonicalCategory(tx) {
  if (!tx) return 'Other';
  const cat = (tx.category || '').trim();
  const desc = (tx.description || '').toUpperCase();

  // If already directly matching one of the 10
  const directMatch = EXPENSE_CATEGORIES.find(c => c.id.toLowerCase() === cat.toLowerCase());
  if (directMatch) return directMatch.id;

  // 1. Gaming
  if (/STEAM|PLAYSTATION|XBOX|NINTENDO|EPIC GAMES|RIOT|BLIZZARD|BARCADE|VALORANT|MINECRAFT|PUBG|BATTLEGROUNDS|BGMI|EA GAMES/.test(desc)) {
    return 'Gaming';
  }

  // 2. Education
  if (/COURSERA|UDEMY|BOOKSTORE|TUITION|COLLEGE|UNIVERSITY|CAMPUS|STANFORD|EDX|ACADEMY|BOOKS|OXFORD|HARVARD/.test(desc)) {
    return 'Education';
  }

  // 3. Online Payments
  if (/RAZORPAY|PAYPAL|BILLDESK|WALLET|ONLINE PAYMENT|STRIPE CHECKOUT|NETBANKING FEE/.test(desc)) {
    return 'Online Payments';
  }

  // 4. Food & Dining
  if (/SWIGGY|ZOMATO|RESTAURANT|CAFE|STARBUCKS|CHIPOTLE|SWEETGREEN|DOORDASH|UBER \*EATS|EATS|PIZZA|BURGER|BAKERY|GROCERY|SUPERMARKET|WHOLE FOODS|TRADER JOE|KROGER|SAFEWAY|ALDI/.test(desc) || cat === 'Dining & Takeout' || cat === 'Groceries') {
    return 'Food & Dining';
  }

  // 5. Shopping
  if (/AMAZON|AMZN|TARGET|UNIQLO|SEPHORA|BEST BUY|SHOPPING|FLIPKART|MYNTRA|AJIO|ZARA|H&M|RETAIL|STORE/.test(desc) || cat === 'Shopping & Lifestyle') {
    return 'Shopping';
  }

  // 6. Bills & Utilities
  if (/CONEDISON|NATIONAL GRID|VERIZON|AIRTEL|JIO|WATER|SEWER|ELECTRIC|UTILITIES|RENT|AVALON|LANDLORD|PROPERTY MGMT|LEASE|LOAN|MORTGAGE|CITI CARDS|DISCOVER E-PAYMENT|CHASE AUTO/.test(desc) || cat === 'Utilities' || cat === 'Housing & Rent' || cat === 'Debt & Loans') {
    return 'Bills & Utilities';
  }

  // 7. Travel & Transport
  if (/UBER \*TRIP|LYFT|MTA|SUBWAY|SHELL OIL|CHEVRON|TRANSIT|GAS|OLA|PETROL|FUEL|FLIGHT|AIRLINE|INDIGO|RAILWAY|IRCTC|TOLL/.test(desc) || cat === 'Transportation') {
    return 'Travel & Transport';
  }

  // 8. Subscriptions
  if (/NETFLIX|SPOTIFY|APPLE\.COM|ICLOUD|PRIME|YOUTUBE|DISNEY|EQUINOX|GYM|FITNESS|SUBSCRIPTION/.test(desc) || cat === 'Subscriptions') {
    return 'Subscriptions';
  }

  // 9. Healthcare
  if (/CVS|WALGREENS|QUEST DIAGNOSTICS|PHARMACY|DOCTOR|HEALTHCARE|COPAY|HOSPITAL|CLINIC|APOLLO|1MG|MEDICINE/.test(desc) || cat === 'Healthcare') {
    return 'Healthcare';
  }

  // Income & Salary (Credit items)
  if (/PAYROLL|DIRECT DEP|STRIPE TRANSFER|SALARY|STIPEND/.test(desc) || cat === 'Income & Salary') {
    return 'Income & Salary';
  }

  return 'Other';
}

export default function TransactionsView({ transactions = [], onOpenOverrideModal, activeCurrency = 'INR' }) {
  // Global View Controls
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalCategory, setGlobalCategory] = useState('');
  const [dateRange, setDateRange] = useState('ALL'); // '30D' | '90D' | 'YTD' | 'ALL'

  // Interactive Category Detail Drilldown State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Detail View Sub-Filters & Sorting
  const [detailSearch, setDetailSearch] = useState('');
  const [detailAmountFilter, setDetailAmountFilter] = useState('ALL'); // 'ALL' | 'LOW' | 'MID' | 'HIGH'
  const [detailSort, setDetailSort] = useState('newest'); // 'newest' | 'oldest' | 'highest' | 'lowest'

  // Date Range Verification helper
  const isWithinDateRange = (txDateStr, range) => {
    if (!txDateStr || range === 'ALL') return true;
    const d = new Date(txDateStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date();
    if (range === '30D') {
      const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return d >= past30;
    }
    if (range === '90D') {
      const past90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return d >= past90;
    }
    if (range === 'YTD') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return d >= startOfYear;
    }
    return true;
  };

  // Derive pure expense transactions (excluding income, transfers, and reversals)
  const expenseTransactions = useMemo(() => {
    return transactions.filter(t => {
      const isDebit = t.tx_type === 'debit' || Number(t.amount) < 0;
      const canonical = getCanonicalCategory(t);
      if (!isDebit || canonical === 'Income & Salary') return false;
      return isWithinDateRange(t.date, dateRange);
    });
  }, [transactions, dateRange]);

  // Grand Total Expense Amount for the active date range
  const totalExpenseAmount = useMemo(() => {
    return expenseTransactions.reduce((acc, t) => acc + Math.abs(Number(t.amount) || 0), 0);
  }, [expenseTransactions]);

  // Derived Category Breakdown for the 10 Canonical Categories
  const categoryBreakdown = useMemo(() => {
    return EXPENSE_CATEGORIES.map(cat => {
      const catTxs = expenseTransactions.filter(t => getCanonicalCategory(t) === cat.id);
      const total = catTxs.reduce((acc, t) => acc + Math.abs(Number(t.amount) || 0), 0);
      const count = catTxs.length;
      const percentage = totalExpenseAmount > 0 ? (total / totalExpenseAmount) * 100 : 0;
      return {
        ...cat,
        total,
        count,
        percentage
      };
    });
  }, [expenseTransactions, totalExpenseAmount]);

  // Selected Category Detail Object
  const selectedCategoryObj = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categoryBreakdown.find(c => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId, categoryBreakdown]);

  // Filtered Transactions for the Active Category Detail View
  const detailTransactions = useMemo(() => {
    if (!selectedCategoryId) return [];
    let list = expenseTransactions.filter(t => getCanonicalCategory(t) === selectedCategoryId);

    // Apply Detail Search Filter
    if (detailSearch.trim()) {
      const q = detailSearch.toLowerCase();
      list = list.filter(t => 
        (t.description || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      );
    }

    // Apply Amount Filter
    const multiplier = activeCurrency === 'INR' ? 83 : 1;
    if (detailAmountFilter === 'LOW') {
      // Under ₹1,000 / $20
      const limit = activeCurrency === 'INR' ? 1000 : 20;
      list = list.filter(t => (Math.abs(Number(t.amount) || 0) * multiplier) < limit);
    } else if (detailAmountFilter === 'MID') {
      // ₹1,000 - ₹5,000 / $20 - $100
      const lowLimit = activeCurrency === 'INR' ? 1000 : 20;
      const highLimit = activeCurrency === 'INR' ? 5000 : 100;
      list = list.filter(t => {
        const val = Math.abs(Number(t.amount) || 0) * multiplier;
        return val >= lowLimit && val <= highLimit;
      });
    } else if (detailAmountFilter === 'HIGH') {
      // Over ₹5,000 / $100
      const limit = activeCurrency === 'INR' ? 5000 : 100;
      list = list.filter(t => (Math.abs(Number(t.amount) || 0) * multiplier) > limit);
    }

    // Apply Sorting
    return list.sort((a, b) => {
      if (detailSort === 'newest') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (detailSort === 'oldest') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      if (detailSort === 'highest') {
        return Math.abs(Number(b.amount) || 0) - Math.abs(Number(a.amount) || 0);
      }
      if (detailSort === 'lowest') {
        return Math.abs(Number(a.amount) || 0) - Math.abs(Number(b.amount) || 0);
      }
      return 0;
    });
  }, [selectedCategoryId, expenseTransactions, detailSearch, detailAmountFilter, detailSort, activeCurrency]);

  // Global Ledger Filtering
  const filteredAllTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchText = (t.description || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
                        (t.category || '').toLowerCase().includes(globalSearch.toLowerCase());
      const canonical = getCanonicalCategory(t);
      const matchCat = !globalCategory || canonical === globalCategory || t.category === globalCategory;
      return matchText && matchCat;
    });
  }, [transactions, globalSearch, globalCategory]);

  // Merchant Icon Component with fallback
  const getCategoryIconElement = (canonicalCatId, sizeClass = "w-4 h-4") => {
    const matched = EXPENSE_CATEGORIES.find(c => c.id === canonicalCatId);
    if (!matched) {
      return (
        <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center">
          <MoreHorizontal className={sizeClass} />
        </div>
      );
    }
    const IconComp = matched.icon;
    return (
      <div className={`w-8 h-8 rounded-xl ${matched.bg} ${matched.text} flex items-center justify-center shadow-sm`}>
        <IconComp className={sizeClass} />
      </div>
    );
  };

  // If a Category is selected, show the interactive Category Detail View
  if (selectedCategoryObj) {
    const IconComp = selectedCategoryObj.icon;
    const multiplier = activeCurrency === 'INR' ? 83 : 1;
    const symbol = activeCurrency === 'INR' ? '₹' : '$';

    return (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F4F6FA] ambient-dashboard-glow text-zinc-900">
        
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSelectedCategoryId(null);
                setDetailSearch('');
              }}
              className="flex items-center gap-2 bg-white hover:bg-zinc-100 border border-black/[0.08] text-zinc-800 text-xs font-bold px-4 py-2.5 rounded-full shadow-sm hover:-translate-x-0.5 transition-all btn-interactive"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-600" />
              <span>Back to Expense Breakdown</span>
            </button>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-semibold text-zinc-500">{selectedCategoryObj.label}</span>
          </div>

          {/* Quick Date Range Pills for this Category */}
          <div className="flex items-center gap-1 bg-white border border-black/[0.06] p-1 rounded-full shadow-sm text-xs">
            {[
              { id: '30D', label: '30 Days' },
              { id: '90D', label: '90 Days' },
              { id: 'YTD', label: 'YTD' },
              { id: 'ALL', label: 'All Time' },
            ].map(range => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  dateRange === range.id 
                    ? 'bg-[#16171B] text-white shadow-sm font-bold' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Detail Hero Header Card */}
        <div className="bg-white rounded-[28px] p-6 border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] card-interactive">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${selectedCategoryObj.bg} ${selectedCategoryObj.text} flex items-center justify-center shadow-md border ${selectedCategoryObj.border}`}>
                <IconComp className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                    {selectedCategoryObj.label}
                  </h1>
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${selectedCategoryObj.bg} ${selectedCategoryObj.text} border ${selectedCategoryObj.border}`}>
                    {selectedCategoryObj.percentage.toFixed(1)}% of expenses
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 font-medium">
                  Synchronized ledger history filtered to {selectedCategoryObj.label} across the selected horizon.
                </p>
              </div>
            </div>

            {/* Metrics Triad */}
            <div className="flex items-center gap-6 divide-x divide-zinc-100">
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Total Spent</span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 tracking-tight mt-0.5">
                  <CountUp 
                    to={selectedCategoryObj.total * multiplier} 
                    decimals={2} 
                    prefix={symbol} 
                    duration={0.8} 
                  />
                </div>
              </div>

              <div className="pl-6">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Transactions</span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 tracking-tight mt-0.5">
                  {selectedCategoryObj.count}
                </div>
              </div>

              <div className="pl-6">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Average Ticket</span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-700 tracking-tight mt-0.5">
                  {formatMoney(selectedCategoryObj.count > 0 ? selectedCategoryObj.total / selectedCategoryObj.count : 0, activeCurrency, true)}
                </div>
              </div>
            </div>

          </div>

          {/* Share of spending progress bar */}
          <div className="mt-6 pt-5 border-t border-zinc-100">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
              <span>Category Share of Total Outflow</span>
              <span className="font-mono text-zinc-900 font-bold">{selectedCategoryObj.percentage.toFixed(1)}% ({formatMoney(selectedCategoryObj.total, activeCurrency, true)} of {formatMoney(totalExpenseAmount, activeCurrency, true)})</span>
            </div>
            <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${selectedCategoryObj.barClass} rounded-full transition-all duration-700 shadow-sm`}
                style={{ width: `${Math.min(100, Math.max(1, selectedCategoryObj.percentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter, Search & Sorting Toolbelt for Detail View */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search by Merchant or Description */}
          <div className="flex items-center bg-[#FAFBFD] border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-700 focus-within:border-zinc-900 focus-within:bg-white transition-all flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 mr-2 text-zinc-400" />
            <input 
              type="text" 
              placeholder={`Search ${selectedCategoryObj.label} merchants, UPI references...`}
              value={detailSearch}
              onChange={(e) => setDetailSearch(e.target.value)}
              className="bg-transparent text-zinc-900 outline-none w-full placeholder-zinc-400 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Amount Filter Pills */}
            <div className="flex items-center gap-1 bg-[#FAFBFD] border border-zinc-200 p-1 rounded-xl text-xs">
              <span className="text-[10px] text-zinc-400 font-bold uppercase px-2">Amount:</span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'LOW', label: activeCurrency === 'INR' ? '< ₹1k' : '< $20' },
                { id: 'MID', label: activeCurrency === 'INR' ? '₹1k-5k' : '$20-$100' },
                { id: 'HIGH', label: activeCurrency === 'INR' ? '> ₹5k' : '> $100' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDetailAmountFilter(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    detailAmountFilter === opt.id 
                      ? 'bg-zinc-900 text-white shadow-sm' 
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1 bg-[#FAFBFD] border border-zinc-200 p-1 rounded-xl text-xs">
              <span className="text-[10px] text-zinc-400 font-bold uppercase px-2 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort:</span>
              </span>
              {[
                { id: 'newest', label: 'Newest' },
                { id: 'oldest', label: 'Oldest' },
                { id: 'highest', label: 'Highest' },
                { id: 'lowest', label: 'Lowest' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setDetailSort(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    detailSort === s.id 
                      ? 'bg-zinc-900 text-white shadow-sm' 
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Detailed Category Transactions Table */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200/80 text-zinc-500 bg-[#FAFAFC] uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-6 font-semibold">Merchant / Description</th>
                  <th className="py-3.5 px-6 font-semibold">Payment Mode</th>
                  <th className="py-3.5 px-6 font-semibold">Date</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Amount</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Reclassify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {detailTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-zinc-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <IconComp className="w-8 h-8 mx-auto text-zinc-300" />
                        <p className="text-xs font-semibold text-zinc-600">No transactions found in {selectedCategoryObj.label}</p>
                        <p className="text-[11px] text-zinc-400">Try adjusting your search query, amount filter, or date range.</p>
                        {(detailSearch || detailAmountFilter !== 'ALL') && (
                          <button
                            onClick={() => {
                              setDetailSearch('');
                              setDetailAmountFilter('ALL');
                            }}
                            className="mt-2 text-xs font-bold text-[#12B8AC] hover:underline"
                          >
                            Reset filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  detailTransactions.map((tx, idx) => (
                    <tr key={tx.id || idx} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="py-3.5 px-6 font-bold text-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${selectedCategoryObj.bg} ${selectedCategoryObj.text} flex items-center justify-center shadow-sm`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block font-semibold group-hover:text-teal-700 transition-colors">
                              {tx.description}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono font-normal">
                              REF# {String(tx.id || idx + 100).padStart(6, '0')}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md font-semibold">
                          {idx % 3 === 0 ? 'UPI' : idx % 3 === 1 ? 'NetBanking' : 'Debit Card'}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-zinc-500 font-medium">
                        {tx.date ? new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </td>

                      <td className="py-3.5 px-6 font-mono font-bold text-right text-sm tabular-nums text-zinc-900">
                        -{formatMoney(Math.abs(tx.amount), activeCurrency, true)}
                      </td>

                      <td className="py-3.5 px-6 text-center">
                        <button 
                          onClick={() => onOpenOverrideModal && onOpenOverrideModal(tx)}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors btn-interactive"
                          title="Override or Reclassify Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }

  // DEFAULT VIEW: Inflow/Outflow + Expense Breakdown Section + Complete Transaction Ledger
  const multiplier = activeCurrency === 'INR' ? 83 : 1;
  const symbol = activeCurrency === 'INR' ? '₹' : '$';

  const categoryFilterDropdownOptions = [
    { id: '', label: 'All Categories', icon: '✨' },
    ...EXPENSE_CATEGORIES.map(c => ({ id: c.id, label: c.label }))
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F4F6FA] ambient-dashboard-glow text-zinc-900">
      
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
            <span>Spending & Transactions</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 text-white font-mono font-bold">
              {filteredAllTransactions.length} records
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Live synchronized UPI, NetBanking, and credit feed with 1-click machine-learning category overrides.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-black/[0.08] rounded-full px-3.5 py-2 text-xs text-zinc-700 shadow-sm focus-within:border-zinc-900 transition-all">
            <Search className="w-3.5 h-3.5 mr-2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search merchants, UPI IDs..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="bg-transparent text-zinc-900 outline-none w-44 placeholder-zinc-400 text-xs"
            />
          </div>

          {/* Custom Styled Glass Dropdown replacing dull OS select */}
          <CustomDropdown 
            options={categoryFilterDropdownOptions}
            value={globalCategory}
            onChange={(val) => setGlobalCategory(val)}
            placeholder="All Categories"
            icon={Filter}
          />
        </div>
      </div>

      {/* Inflow vs Outflow Total Stream & Breakdown Card */}
      <InflowOutflowCard 
        transactions={transactions}
        activeCurrency={activeCurrency}
      />

      {/* ========================================================================= */}
      {/* 1. EXPENSE BREAKDOWN SECTION: Interactive 10 Canonical Category Cards     */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">
                Expense Breakdown
              </h2>
              <span className="text-xs text-zinc-400 font-mono font-medium">
                ({EXPENSE_CATEGORIES.length} Categories)
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Click any category card to inspect filtered merchant histories and adjust classifications.
            </p>
          </div>

          {/* Date Range Filter Selector */}
          <div className="flex items-center gap-1 bg-white border border-zinc-200/90 p-1 rounded-full shadow-sm">
            {[
              { id: '30D', label: 'Last 30 Days' },
              { id: '90D', label: 'Last 90 Days' },
              { id: 'YTD', label: 'YTD' },
              { id: 'ALL', label: 'All Time' },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setDateRange(r.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  dateRange === r.id 
                    ? 'bg-zinc-900 text-white shadow-sm font-bold' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prominent Expense Total Headline Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Total Expenses ({dateRange === '30D' ? '30 Days' : dateRange === '90D' ? '90 Days' : dateRange === 'YTD' ? 'Year to Date' : 'All Time'})
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 tracking-tight mt-0.5">
              <CountUp 
                to={totalExpenseAmount * multiplier} 
                decimals={2} 
                prefix={symbol} 
                duration={0.8} 
              />
            </div>
          </div>
          <div className="text-xs text-zinc-500 font-medium sm:text-right max-w-xs">
            Derived directly from <strong className="text-zinc-800 font-mono">{expenseTransactions.length}</strong> qualifying expense transactions. Credits and payroll deposits are automatically excluded.
          </div>
        </div>

        {/* 10 Category Cards Responsive Grid */}
        <AnimatedContent distance={15} duration={0.35} stagger={0.04}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {categoryBreakdown.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className="bg-white rounded-[22px] p-4 border border-black/[0.05] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200 card-interactive cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Icon + Percentage Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl ${cat.bg} ${cat.text} flex items-center justify-center shadow-sm border ${cat.border} group-hover:scale-105 transition-transform`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                        {cat.percentage.toFixed(1)}%
                      </span>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-xs font-bold text-zinc-800 group-hover:text-teal-700 transition-colors tracking-tight line-clamp-1">
                      {cat.label}
                    </h3>

                    {/* Total Amount */}
                    <div className="text-base font-extrabold font-mono text-zinc-900 mt-1 tracking-tight">
                      {formatMoney(cat.total, activeCurrency, true)}
                    </div>
                  </div>

                  {/* Bottom: Transaction Count & Progress Bar */}
                  <div className="mt-4 pt-2.5 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium mb-1.5">
                      <span>{cat.count} txs</span>
                      <span className="flex items-center text-zinc-500 font-semibold group-hover:text-zinc-800 transition-colors">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${cat.barClass} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.max(cat.total > 0 ? 3 : 0, cat.percentage))}%` }}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </AnimatedContent>

      </div>

      {/* ========================================================================= */}
      {/* 2. INSTITUTIONAL TRANSACTION LEDGER TABLE (All Transactions)             */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">
            Complete Synchronized Ledger
          </h2>
          <span className="text-xs text-zinc-400">
            Showing {filteredAllTransactions.length} of {transactions.length} records
          </span>
        </div>

        <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200/80 text-zinc-500 bg-[#FAFAFC] uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-6 font-semibold">Transaction / Merchant</th>
                  <th className="py-3.5 px-6 font-semibold">Category</th>
                  <th className="py-3.5 px-6 font-semibold">Date</th>
                  <th className="py-3.5 px-6 font-semibold">Payment Mode</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Amount</th>
                  <th className="py-3.5 px-6 font-semibold text-center">ML Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {filteredAllTransactions.map((tx, idx) => {
                  const isOutflow = tx.tx_type === 'debit' || Number(tx.amount) < 0;
                  const canonicalCat = getCanonicalCategory(tx);
                  const matchedCat = EXPENSE_CATEGORIES.find(c => c.id === canonicalCat);

                  return (
                    <tr key={tx.id || idx} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="py-3.5 px-6 font-bold text-zinc-900">
                        <div className="flex items-center gap-3">
                          {getCategoryIconElement(canonicalCat)}
                          <div>
                            <span className="block font-semibold group-hover:text-teal-700 transition-colors">
                              {tx.description}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono font-normal">
                              REF# {String(tx.id || idx + 100).padStart(6, '0')}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-6">
                        <button
                          onClick={() => {
                            if (canonicalCat !== 'Income & Salary') {
                              setSelectedCategoryId(canonicalCat);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all hover:scale-105 ${
                            matchedCat ? `${matchedCat.bg} ${matchedCat.text} ${matchedCat.border}` : 'bg-zinc-100 text-zinc-700 border-zinc-200/50'
                          }`}
                          title={`Click to filter by ${canonicalCat}`}
                        >
                          {canonicalCat}
                        </button>
                      </td>

                      <td className="py-3.5 px-6 text-zinc-500 font-medium">
                        {tx.date ? new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md font-semibold">
                          {idx % 3 === 0 ? 'UPI' : idx % 3 === 1 ? 'NetBanking' : 'Debit Card'}
                        </span>
                      </td>

                      <td className={`py-3.5 px-6 font-mono font-bold text-right text-sm tabular-nums ${isOutflow ? 'text-zinc-900' : 'text-emerald-700'}`}>
                        {isOutflow ? '-' : '+'}{formatMoney(Math.abs(tx.amount), activeCurrency, true)}
                      </td>

                      <td className="py-3.5 px-6 text-center">
                        <button 
                          onClick={() => onOpenOverrideModal && onOpenOverrideModal(tx)}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors btn-interactive"
                          title="Override ML Classification"
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
      </div>

    </div>
  );
}
