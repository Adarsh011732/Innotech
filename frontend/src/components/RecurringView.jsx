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
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#08090C]">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Recurring Obligations & Subscriptions</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-bold">
              16 Detected
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
            Automated recurring bill cadence detection, payroll timing, and fixed monthly commitments.
          </p>
        </div>
      </div>

      {/* Burn vs Inflow Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#14161E] border border-[#232634] rounded-3xl p-5 text-white shadow-xl card-interactive">
          <span className="text-xs text-[#9CA3AF] font-medium">Estimated Monthly Payroll Inflow</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })} / mo
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">Direct deposit pattern verified with 99% cadence confidence</p>
        </div>

        <div className="bg-[#14161E] border border-[#232634] rounded-3xl p-5 text-white shadow-xl card-interactive">
          <span className="text-xs text-[#9CA3AF] font-medium">Fixed Recurring Commitments</span>
          <div className="text-2xl font-extrabold text-[#FF5722] mt-1">
            -${totalFixedExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })} / mo
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">Rent, essential utilities, and loan minimum payments</p>
        </div>

        <div className="bg-[#14161E] border border-[#232634] rounded-3xl p-5 text-white shadow-xl card-interactive">
          <span className="text-xs text-[#9CA3AF] font-medium">Safe Discretionary Cash Buffer</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            +${(totalIncome - totalFixedExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })} / mo
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Available for flexible spending & savings goals</p>
        </div>
      </div>

      {/* Recurring Items Table */}
      <div className="bg-[#14161E] border border-[#232634] rounded-3xl overflow-hidden shadow-xl card-interactive">
        <div className="p-5 border-b border-[#232634] flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Detected Recurring Cadences</h2>
          <span className="text-xs text-[#9CA3AF]">Zero-Knowledge Local Analysis</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#20222C] text-[#6B7280] bg-[#101117]">
                <th className="py-3.5 px-6 font-semibold">Merchant / Transfer</th>
                <th className="py-3.5 px-6 font-semibold">Category</th>
                <th className="py-3.5 px-6 font-semibold">Frequency</th>
                <th className="py-3.5 px-6 font-semibold">Next Expected Execution</th>
                <th className="py-3.5 px-6 font-semibold text-right">Amount</th>
                <th className="py-3.5 px-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D1F2A] text-white">
              {recurringItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#1A1C25] transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-6 text-[#9CA3AF]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1A1C25] border border-[#2B2E3A] text-[11px]">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-[#9CA3AF] text-[11px]">
                    {item.cadence}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[#9CA3AF] text-[11px]">
                    {item.nextDate}
                  </td>
                  <td className={`py-3.5 px-6 font-mono font-bold text-right ${item.isIncome ? 'text-emerald-400' : 'text-white'}`}>
                    {item.isIncome ? `+$${item.amount.toFixed(2)}` : `-$${item.amount.toFixed(2)}`}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#FF5722]/10 text-[#FF5722]'
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
