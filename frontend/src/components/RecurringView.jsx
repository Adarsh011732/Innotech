import React from 'react';
import { RotateCw, Calendar, Tv, Home, Zap, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecurringView({ accountsSummary }) {
  const recurringItems = [
    { name: 'Employer Direct Deposit ACH', type: 'Income', cadence: 'Semi-Monthly', amount: 3750.00, nextDate: 'Nov 01, 2026', status: 'Active', isIncome: true },
    { name: 'Avalon Residential Rent', type: 'Housing', cadence: 'Monthly (1st)', amount: 1950.00, nextDate: 'Nov 01, 2026', status: 'Scheduled', isIncome: false },
    { name: 'Verizon Fios Gigabit Fiber', type: 'Utilities', cadence: 'Monthly (12th)', amount: 79.99, nextDate: 'Nov 12, 2026', status: 'Scheduled', isIncome: false },
    { name: 'ConEdison Electric & Gas', type: 'Utilities', cadence: 'Monthly (18th)', amount: 124.50, nextDate: 'Nov 18, 2026', status: 'Variable', isIncome: false },
    { name: 'Netflix Premium 4K Plan', type: 'Subscriptions', cadence: 'Monthly (5th)', amount: 22.99, nextDate: 'Nov 05, 2026', status: 'Active', isIncome: false },
    { name: 'Spotify Duo Subscription', type: 'Subscriptions', cadence: 'Monthly (22nd)', amount: 14.99, nextDate: 'Nov 22, 2026', status: 'Active', isIncome: false },
    { name: 'Equinox Gym Membership', type: 'Subscriptions', cadence: 'Monthly (1st)', amount: 180.00, nextDate: 'Nov 01, 2026', status: 'Active', isIncome: false },
    { name: 'Nelnet Federal Student Loan', type: 'Debt & Loans', cadence: 'Monthly (28th)', amount: 320.00, nextDate: 'Oct 28, 2026', status: 'Scheduled', isIncome: false },
  ];

  const totalFixedExpenses = recurringItems.filter(i => !i.isIncome).reduce((acc, i) => acc + i.amount, 0);
  const totalIncome = recurringItems.filter(i => i.isIncome).reduce((acc, i) => acc + i.amount * 2, 0);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#090A0D]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Recurring Obligations & Subscriptions</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              {recurringItems.length} Detected
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">
            Automated recurring bill cadence detection, payroll timing, and fixed commitments.
          </p>
        </div>
      </div>

      {/* Burn vs Inflow Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-4 text-white shadow-sm">
          <span className="text-xs text-zinc-400 font-medium">Verified Monthly Inflow</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono tabular-nums">
            +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-zinc-500">/ mo</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Direct deposit pattern verified (99% confidence)</p>
        </div>

        <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-4 text-white shadow-sm">
          <span className="text-xs text-zinc-400 font-medium">Fixed Recurring Commitments</span>
          <div className="text-2xl font-bold text-zinc-200 mt-1 font-mono tabular-nums">
            -${totalFixedExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-zinc-500">/ mo</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Rent, essential utilities, and fixed commitments</p>
        </div>

        <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-4 text-white shadow-sm">
          <span className="text-xs text-zinc-400 font-medium">Safe Discretionary Cash Buffer</span>
          <div className="text-2xl font-bold text-white mt-1 font-mono tabular-nums">
            +${(totalIncome - totalFixedExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-zinc-500">/ mo</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Available for flexible spending & savings allocation</p>
        </div>
      </div>

      {/* Recurring Items Table */}
      <div className="bg-[#13161C] border border-white/[0.07] rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between">
          <h2 className="text-xs font-semibold text-white">Detected Recurring Cadences</h2>
          <span className="text-[10px] font-mono text-zinc-400">Zero-Knowledge Local Analysis</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.07] text-zinc-400 bg-white/[0.02]">
                <th className="py-2.5 px-4 font-medium">Merchant / Transfer</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium">Frequency</th>
                <th className="py-2.5 px-4 font-medium">Next Due</th>
                <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                <th className="py-2.5 px-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white">
              {recurringItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-2.5 px-4 font-medium text-white">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-4 text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-zinc-300">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-zinc-400 text-[11px]">
                    {item.cadence}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-zinc-400 text-[11px]">
                    {item.nextDate}
                  </td>
                  <td className={`py-2.5 px-4 font-mono font-semibold text-right tabular-nums ${item.isIncome ? 'text-emerald-400' : 'text-zinc-200'}`}>
                    {item.isIncome ? `+$${item.amount.toFixed(2)}` : `-$${item.amount.toFixed(2)}`}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      item.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : item.status === 'Scheduled'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
