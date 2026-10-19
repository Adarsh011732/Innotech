import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function CategoryOverrideModal({ tx, onClose, onSave }) {
  const [newCategory, setNewCategory] = useState(tx?.category || 'Dining & Takeout');
  const [applyFuture, setApplyFuture] = useState(true);

  if (!tx) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#13161C] border border-white/[0.1] rounded-xl w-full max-w-md p-5 shadow-2xl text-white animate-dropdown">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Reclassify Transaction</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#0E1015] border border-white/[0.08] rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="font-medium text-xs text-white truncate max-w-[240px]">{tx.description}</span>
          <span className="font-mono font-bold text-xs text-white tabular-nums">${Math.abs(tx.amount || 0).toFixed(2)}</span>
        </div>

        <div className="space-y-1.5 mb-4">
          <label className="text-xs text-zinc-400 font-medium">Assigned Category:</label>
          <select 
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full bg-[#0E1015] border border-white/[0.08] text-white text-xs rounded-md p-2.5 outline-none focus:border-[#FF5722] transition-colors"
          >
            <option value="Dining & Takeout">Dining & Takeout</option>
            <option value="Groceries">Groceries</option>
            <option value="Housing & Rent">Housing & Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Transportation">Transportation</option>
            <option value="Debt & Loans">Debt & Loans</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Shopping & Lifestyle">Shopping & Lifestyle</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Income & Salary">Income & Salary</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs text-zinc-400 mb-5 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={applyFuture} 
            onChange={(e) => setApplyFuture(e.target.checked)}
            className="rounded bg-[#0E1015] border-white/[0.1] accent-[#FF5722] w-3.5 h-3.5 cursor-pointer"
          />
          <span>Remember category rule for future transactions</span>
        </label>

        <div className="flex items-center justify-end gap-2.5">
          <button 
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(tx.id, newCategory, applyFuture)}
            className="px-4 py-1.5 rounded-md bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save Category</span>
          </button>
        </div>
      </div>
    </div>
  );
}
