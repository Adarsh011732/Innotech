import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { formatMoney } from '../utils/currency';
import CustomDropdown from './CustomDropdown';

export default function CategoryOverrideModal({ tx, onClose, onSave, activeCurrency = 'INR' }) {
  const [newCategory, setNewCategory] = useState(tx?.category || 'Dining & Takeout');
  const [applyFuture, setApplyFuture] = useState(true);

  if (!tx) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-black/[0.08] rounded-3xl w-full max-w-md p-6 shadow-2xl text-zinc-900 animate-dropdown">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-zinc-900">Reclassify Transaction</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#FAFBFD] border border-zinc-200 rounded-2xl p-3.5 mb-4 flex items-center justify-between">
          <span className="font-semibold text-xs text-zinc-800 truncate max-w-[240px]">{tx.description}</span>
          <span className="font-mono font-bold text-sm text-teal-600">
            {formatMoney(Math.abs(tx.amount || 0), activeCurrency, false)}
          </span>
        </div>

        <div className="space-y-1.5 mb-4">
          <label className="text-xs text-zinc-600 font-semibold block">Assigned Category:</label>
          <CustomDropdown 
            options={[
              { id: 'Dining & Takeout', label: 'Dining & Takeout', icon: '☕' },
              { id: 'Groceries', label: 'Groceries', icon: '🛍️' },
              { id: 'Housing & Rent', label: 'Housing & Rent', icon: '🏠' },
              { id: 'Utilities', label: 'Utilities', icon: '💡' },
              { id: 'Subscriptions', label: 'Subscriptions', icon: '📺' },
              { id: 'Transportation', label: 'Transportation', icon: '🚗' },
              { id: 'Debt & Loans', label: 'Debt & Loans', icon: '💳' },
              { id: 'Healthcare', label: 'Healthcare', icon: '🏥' },
              { id: 'Shopping & Lifestyle', label: 'Shopping & Lifestyle', icon: '👗' },
              { id: 'Entertainment', label: 'Entertainment', icon: '🎮' },
              { id: 'Income & Salary', label: 'Income & Salary', icon: '💰' },
            ]}
            value={newCategory}
            onChange={(val) => setNewCategory(val)}
            className="w-full"
            buttonClassName="w-full justify-between py-2.5 px-3.5 bg-[#FAFBFD] border-zinc-200 rounded-2xl text-xs"
            menuClassName="w-full left-0 right-0"
            align="left"
          />
        </div>

        <label className="flex items-center gap-2.5 text-xs text-zinc-500 mb-6 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={applyFuture} 
            onChange={(e) => setApplyFuture(e.target.checked)}
            className="rounded bg-zinc-100 border-zinc-300 accent-zinc-900 w-4 h-4 cursor-pointer"
          />
          <span>Remember this rule in local memory for future transactions</span>
        </label>

        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(tx.id, newCategory, applyFuture)}
            className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Category</span>
          </button>
        </div>
      </div>
    </div>
  );
}
