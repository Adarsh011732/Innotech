import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Coffee, 
  ShoppingBag, 
  Tv, 
  Gamepad2, 
  Car, 
  Home, 
  DollarSign, 
  Edit3,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

export default function TransactionsView({ transactions = [], onOpenOverrideModal }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const filtered = useMemo(() => {
    let list = (transactions || []).filter(t => {
      const matchText = t.description.toLowerCase().includes(search.toLowerCase()) ||
                        t.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || t.category === category;
      return matchText && matchCat;
    });

    if (sortBy === 'date-desc') {
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (sortBy === 'date-asc') {
      list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    } else if (sortBy === 'amount-desc') {
      list.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    } else if (sortBy === 'amount-asc') {
      list.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
    }
    return list;
  }, [transactions, search, category, sortBy]);

  const totalInflow = useMemo(() => {
    return filtered.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  }, [filtered]);

  const totalOutflow = useMemo(() => {
    return filtered.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [filtered]);

  const getMerchantIcon = (category) => {
    switch (category) {
      case 'Dining & Takeout': return <div className="w-7 h-7 rounded-md bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center"><Coffee className="w-3.5 h-3.5" /></div>;
      case 'Groceries': return <div className="w-7 h-7 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><ShoppingBag className="w-3.5 h-3.5" /></div>;
      case 'Subscriptions': return <div className="w-7 h-7 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center"><Tv className="w-3.5 h-3.5" /></div>;
      case 'Entertainment': return <div className="w-7 h-7 rounded-md bg-purple-500/15 text-purple-400 flex items-center justify-center"><Gamepad2 className="w-3.5 h-3.5" /></div>;
      case 'Transportation': return <div className="w-7 h-7 rounded-md bg-cyan-500/15 text-cyan-400 flex items-center justify-center"><Car className="w-3.5 h-3.5" /></div>;
      case 'Housing & Rent': return <div className="w-7 h-7 rounded-md bg-blue-500/15 text-blue-400 flex items-center justify-center"><Home className="w-3.5 h-3.5" /></div>;
      default: return <div className="w-7 h-7 rounded-md bg-white/[0.06] text-zinc-300 flex items-center justify-center"><DollarSign className="w-3.5 h-3.5" /></div>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#090A0D]">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Documents & Transaction Ledger</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              {filtered.length} Recorded
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">
            Search, filter, inspect categories, and apply 1-click semantic overrides.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="flex items-center bg-[#13161C] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs text-zinc-300 w-48 focus-within:border-[#FF5722] transition-colors">
            <Search className="w-3.5 h-3.5 mr-2 text-zinc-500 shrink-0" />
            <input 
              type="text" 
              placeholder="Search description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white outline-none w-full placeholder-zinc-500 text-xs"
            />
          </div>

          {/* Category Filter */}
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#13161C] border border-white/[0.08] text-xs text-zinc-300 hover:text-white rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Dining & Takeout">Dining & Takeout</option>
            <option value="Groceries">Groceries</option>
            <option value="Housing & Rent">Housing & Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Transportation">Transportation</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Healthcare">Healthcare</option>
          </select>

          {/* Sort Selector */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#13161C] border border-white/[0.08] text-xs text-zinc-300 hover:text-white rounded-md px-2.5 py-1.5 outline-none cursor-pointer font-mono"
          >
            <option value="date-desc">Newest Date</option>
            <option value="date-asc">Oldest Date</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Summary Volume Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#13161C] border border-white/[0.07] rounded-lg p-3 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Filtered Inflow</span>
            <div className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              +${totalInflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#13161C] border border-white/[0.07] rounded-lg p-3 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Filtered Outflow</span>
            <div className="text-base font-bold text-zinc-200 font-mono tabular-nums">
              -${totalOutflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-white/[0.06] text-zinc-400 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#13161C] border border-white/[0.07] rounded-lg p-3 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Net Delta</span>
            <div className={`text-base font-bold font-mono tabular-nums ${totalInflow - totalOutflow >= 0 ? 'text-emerald-400' : 'text-[#FF5722]'}`}>
              {totalInflow - totalOutflow >= 0 ? '+' : '-'}${Math.abs(totalInflow - totalOutflow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">Reconciled</span>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-[#13161C] border border-white/[0.07] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.07] text-zinc-400 bg-white/[0.02]">
              <th className="py-2.5 px-4 font-medium">Date</th>
              <th className="py-2.5 px-4 font-medium">Description</th>
              <th className="py-2.5 px-4 font-medium">Category</th>
              <th className="py-2.5 px-4 font-medium">Account</th>
              <th className="py-2.5 px-4 font-medium text-right">Amount</th>
              <th className="py-2.5 px-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-white">
            {filtered.slice(0, 50).map((tx) => (
              <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors group">
                <td className="py-2.5 px-4 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                  {tx.date}
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    {getMerchantIcon(tx.category)}
                    <span className="font-medium text-white group-hover:text-[#FF5722] transition-colors">
                      {tx.description}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-zinc-300">
                    {tx.category}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-zinc-400 capitalize text-[11px] font-mono">
                  {tx.account_id ? tx.account_id.replace('acc_', '').replace('_', ' ') : 'Checking'}
                </td>
                <td className={`py-2.5 px-4 font-mono font-semibold text-right tabular-nums ${tx.amount < 0 ? 'text-zinc-200' : 'text-emerald-400'}`}>
                  {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `+$${tx.amount.toFixed(2)}`}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <button 
                    onClick={() => onOpenOverrideModal(tx)}
                    className="p-1 rounded text-zinc-500 hover:text-[#FF5722] hover:bg-white/[0.06] transition-colors"
                    title="Change Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
