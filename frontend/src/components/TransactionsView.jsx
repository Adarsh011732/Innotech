import React, { useState } from 'react';
import { Search, SlidersHorizontal, Coffee, ShoppingBag, Tv, Gamepad2, Car, Home, DollarSign, Edit3, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatMoney } from '../utils/currency';

export default function TransactionsView({ transactions = [], onOpenOverrideModal, activeCurrency = 'INR' }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = transactions.filter(t => {
    const matchText = (t.description || '').toLowerCase().includes(search.toLowerCase()) ||
                      (t.category || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || t.category === category;
    return matchText && matchCat;
  });

  const getMerchantIcon = (cat) => {
    switch (cat) {
      case 'Dining & Takeout': return <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Coffee className="w-4 h-4" /></div>;
      case 'Groceries': return <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShoppingBag className="w-4 h-4" /></div>;
      case 'Subscriptions': return <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Tv className="w-4 h-4" /></div>;
      case 'Entertainment': return <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Gamepad2 className="w-4 h-4" /></div>;
      case 'Transportation': return <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center"><Car className="w-4 h-4" /></div>;
      case 'Housing & Rent': return <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Home className="w-4 h-4" /></div>;
      default: return <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><DollarSign className="w-4 h-4" /></div>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F4F6FA] text-zinc-900">
      
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
            <span>Spending & Transactions</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 text-white font-mono font-bold">
              {filtered.length} records
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-zinc-900 outline-none w-44 placeholder-zinc-400 text-xs"
            />
          </div>

          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white border border-black/[0.08] text-xs font-semibold text-zinc-800 rounded-full px-3.5 py-2 outline-none cursor-pointer shadow-sm hover:border-zinc-400 transition-all"
          >
            <option value="">All Categories</option>
            <option value="Dining & Takeout">Dining & Takeout</option>
            <option value="Groceries">Groceries</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
            <option value="Housing & Rent">Housing & Rent</option>
          </select>
        </div>
      </div>

      {/* Modern White Ledger Card Container from image.png */}
      <div className="bg-white border border-black/[0.06] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] card-interactive">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 bg-[#FAFBFD]">
                <th className="py-4 px-6 font-semibold">Transaction / Merchant</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Date & Time</th>
                <th className="py-4 px-6 font-semibold">Payment Mode</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
                <th className="py-4 px-6 font-semibold text-center">ML Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {filtered.map((tx, idx) => {
                const isOutflow = tx.amount < 0;
                return (
                  <tr key={tx.id || idx} className="hover:bg-zinc-50/80 transition-colors group">
                    <td className="py-4 px-6 font-bold text-zinc-900">
                      <div className="flex items-center gap-3">
                        {getMerchantIcon(tx.category)}
                        <div>
                          <span className="block font-semibold group-hover:text-teal-600 transition-colors">
                            {tx.description}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono font-normal">
                            REF# {String(tx.id || idx + 100).padStart(6, '0')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-semibold border border-black/[0.03]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-500 font-medium">
                      {tx.date || '18 Oct, 2026'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                        {idx % 3 === 0 ? 'UPI' : idx % 3 === 1 ? 'NetBanking' : 'Debit Card'}
                      </span>
                    </td>
                    <td className={`py-4 px-6 font-mono font-bold text-right text-sm ${isOutflow ? 'text-zinc-900' : 'text-emerald-600'}`}>
                      {isOutflow ? '-' : '+'}{formatMoney(Math.abs(tx.amount), activeCurrency, false)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => onOpenOverrideModal(tx)}
                        className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors btn-interactive"
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
  );
}
