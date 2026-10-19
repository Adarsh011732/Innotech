import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function CategoryOverrideModal({ tx, onClose, onSave }) {
  const [newCategory, setNewCategory] = useState(tx?.category || 'Dining & Takeout');
  const [applyFuture, setApplyFuture] = useState(true);

  if (!tx) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111217] border border-[#2A2E3D] rounded-3xl w-full max-w-md p-6 shadow-2xl text-white animate-dropdown">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Reclassify Transaction</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#181A22] border border-[#282B37] rounded-2xl p-3.5 mb-4 flex items-center justify-between">
          <span className="font-semibold text-xs text-white truncate max-w-[240px]">{tx.description}</span>
          <span className="font-mono font-bold text-sm text-[#FF5722]">${Math.abs(tx.amount || 0).toFixed(2)}</span>
        </div>

        <div className="space-y-1.5 mb-4">
          <label className="text-xs text-[#9CA3AF] font-semibold">Assigned Category:</label>
          <select 
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full bg-[#181A22] border border-[#282B37] text-white text-xs rounded-xl p-3 outline-none focus:border-[#FF5722] transition-colors"
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

        <label className="flex items-center gap-2.5 text-xs text-[#9CA3AF] mb-6 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={applyFuture} 
            onChange={(e) => setApplyFuture(e.target.checked)}
            className="rounded bg-[#181A22] border-[#282B37] accent-[#FF5722] w-4 h-4 cursor-pointer"
          />
          <span>Remember this rule in local memory for future transactions</span>
        </label>

        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(tx.id, newCategory, applyFuture)}
            className="px-5 py-2 rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#FF5722]/30 active:scale-95 transition-all"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Save Category</span>
          </button>
        </div>
      </div>
    </div>
  );
}
