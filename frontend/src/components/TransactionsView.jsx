import React, { useState } from 'react';
import { Search, SlidersHorizontal, MoreHorizontal, Coffee, ShoppingBag, Tv, Gamepad2, Car, Home, DollarSign, Edit3 } from 'lucide-react';

export default function TransactionsView({ transactions = [], onOpenOverrideModal }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = transactions.filter(t => {
    const matchText = t.description.toLowerCase().includes(search.toLowerCase()) ||
                      t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || t.category === category;
    return matchText && matchCat;
  });

  const getMerchantIcon = (category) => {
    switch (category) {
      case 'Dining & Takeout': return <div className="w-8 h-8 rounded-full bg-[#FF5722]/20 text-[#FF5722] flex items-center justify-center"><Coffee className="w-4 h-4" /></div>;
      case 'Groceries': return <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><ShoppingBag className="w-4 h-4" /></div>;
      case 'Subscriptions': return <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><Tv className="w-4 h-4" /></div>;
      case 'Entertainment': return <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center"><Gamepad2 className="w-4 h-4" /></div>;
      case 'Transportation': return <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center"><Car className="w-4 h-4" /></div>;
      case 'Housing & Rent': return <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><Home className="w-4 h-4" /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-[#FF5722]/20 text-[#FF5722] flex items-center justify-center"><DollarSign className="w-4 h-4" /></div>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-9 lg:py-8 space-y-6 select-none bg-[#08090C]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Documents & Transaction Ledger</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-bold">
              {filtered.length} Items
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
            Review detailed transactions, update categories with 1-click override, and export statements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#121319] border border-[#22242F] rounded-xl px-3.5 py-2 text-xs text-[#9CA3AF]">
            <Search className="w-3.5 h-3.5 mr-2 text-[#6B7280]" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white outline-none w-44 placeholder-[#6B7280]"
            />
          </div>

          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#121319] border border-[#22242F] text-xs text-white rounded-xl px-3.5 py-2 outline-none cursor-pointer"
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
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-[#111217] border border-[#222530] rounded-3xl overflow-hidden shadow-xl card-interactive">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1E202B] text-[#9CA3AF] bg-[#0E0F14]">
              <th className="py-3.5 px-6 font-semibold">Date</th>
              <th className="py-3.5 px-6 font-semibold">Description</th>
              <th className="py-3.5 px-6 font-semibold">Category</th>
              <th className="py-3.5 px-6 font-semibold">Account</th>
              <th className="py-3.5 px-6 font-semibold text-right">Amount</th>
              <th className="py-3.5 px-6 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1C25] text-white">
            {filtered.slice(0, 40).map((tx) => (
              <tr key={tx.id} className="hover:bg-[#161821] transition-colors group">
                <td className="py-3.5 px-6 font-mono text-[#9CA3AF] text-[11px] whitespace-nowrap">
                  {tx.date}
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    {getMerchantIcon(tx.category)}
                    <span className="font-semibold text-white group-hover:text-[#FF5722] transition-colors">
                      {tx.description}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-6">
                  <span className="px-2.5 py-1 rounded-full bg-[#1A1C25] border border-[#262835] text-[11px] font-medium text-[#CBD5E1]">
                    {tx.category}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-[#9CA3AF] capitalize text-[11px]">
                  {tx.account_id ? tx.account_id.replace('acc_', '').replace('_', ' ') : 'Primary Checking'}
                </td>
                <td className={`py-3.5 px-6 font-mono font-bold text-right ${tx.amount < 0 ? 'text-white' : 'text-emerald-400'}`}>
                  {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `+$${tx.amount.toFixed(2)}`}
                </td>
                <td className="py-3.5 px-6 text-center">
                  <button 
                    onClick={() => onOpenOverrideModal(tx)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#FF5722] hover:bg-[#20222C] transition-colors"
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
