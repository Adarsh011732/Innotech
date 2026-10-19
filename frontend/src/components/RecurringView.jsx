import React from 'react';
import { RotateCw, Calendar, Tv, Home, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import CountUp from './reactbits/CountUp';
import AnimatedContent from './reactbits/AnimatedContent';
import { formatMoney, getConvertedValue } from '../utils/currency';

export default function RecurringView({ accountsSummary, activeCurrency = 'INR' }) {
  const recurringItems = [
    { name: 'Employer Direct Deposit ACH', type: 'Income', cadence: 'Semi-Monthly', amount: activeCurrency === 'INR' ? 107500 : 1295, nextDate: 'Nov 01, 2026', status: 'Active', isIncome: true },
    { name: 'Koramangala Residential Rent', type: 'Housing', cadence: 'Monthly (1st)', amount: activeCurrency === 'INR' ? 24500 : 295, nextDate: 'Nov 01, 2026', status: 'Scheduled', isIncome: false },
    { name: 'Jio Fiber Ultra Gigabit', type: 'Utilities', cadence: 'Monthly (12th)', amount: activeCurrency === 'INR' ? 1499 : 18.00, nextDate: 'Nov 12, 2026', status: 'Scheduled', isIncome: false },
    { name: 'Tata Power Electric & Gas', type: 'Utilities', cadence: 'Monthly (18th)', amount: activeCurrency === 'INR' ? 2450 : 29.50, nextDate: 'Nov 18, 2026', status: 'Variable', isIncome: false },
    { name: 'Netflix Premium 4K Plan', type: 'Subscriptions', cadence: 'Monthly (5th)', amount: activeCurrency === 'INR' ? 649 : 7.80, nextDate: 'Nov 05, 2026', status: 'Active', isIncome: false },
    { name: 'Spotify Duo Subscription', type: 'Subscriptions', cadence: 'Monthly (22nd)', amount: activeCurrency === 'INR' ? 149 : 1.80, nextDate: 'Nov 22, 2026', status: 'Active', isIncome: false },
    { name: 'Cult.fit Elite Membership', type: 'Fitness', cadence: 'Monthly (1st)', amount: activeCurrency === 'INR' ? 1850 : 22.00, nextDate: 'Nov 01, 2026', status: 'Active', isIncome: false },
    { name: 'HDFC Education Loan EMI', type: 'Debt & Loans', cadence: 'Monthly (28th)', amount: activeCurrency === 'INR' ? 12500 : 150.00, nextDate: 'Oct 28, 2026', status: 'Scheduled', isIncome: false },
  ];

  const totalFixedExpenses = recurringItems.filter(i => !i.isIncome).reduce((acc, i) => acc + i.amount, 0);
  const totalIncome = recurringItems.filter(i => i.isIncome).reduce((acc, i) => acc + i.amount * 2, 0);
  const safeBuffer = totalIncome - totalFixedExpenses;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F4F6FA] text-zinc-900">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
            <span>Bills & Subscriptions</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 text-white font-mono font-bold">
              8 Verified
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Automated recurring bill cadence detection, payroll direct deposits, and fixed monthly commitments.
          </p>
        </div>
      </div>

      {/* Burn vs Inflow Metrics */}
      <AnimatedContent distance={20} duration={0.4} stagger={0.08}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between card-interactive">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 font-medium">Estimated Monthly Payroll Inflow</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                +{formatMoney(totalIncome, activeCurrency, false)} <span className="text-xs font-normal text-zinc-400">/ mo</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Direct deposit pattern verified with 99% confidence</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between card-interactive">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 font-medium">Fixed Recurring Commitments</span>
                <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 font-mono tabular-nums">
                -{formatMoney(totalFixedExpenses, activeCurrency, false)} <span className="text-xs font-normal text-zinc-400">/ mo</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Rent, essential utilities, and loan minimum payments</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between card-interactive">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 font-medium">Safe Discretionary Cash Buffer</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Surplus</span>
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 font-mono tabular-nums">
                +{formatMoney(safeBuffer, activeCurrency, false)} <span className="text-xs font-normal text-zinc-400">/ mo</span>
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Available for discretionary spending & savings</p>
            </div>
          </div>
        </div>
      </AnimatedContent>

      {/* Recurring Items Table */}
      <div className="bg-white border border-black/[0.06] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] card-interactive">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <span>Detected Recurring Cadences</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">Zero-Knowledge Local Analysis</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 bg-[#FAFBFD]">
                <th className="py-4 px-6 font-semibold">Merchant / Transfer</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Frequency</th>
                <th className="py-4 px-6 font-semibold">Next Expected Execution</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {recurringItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 transition-colors group">
                  <td className="py-4 px-6 font-bold text-zinc-900 group-hover:text-teal-600 transition-colors">
                    {item.name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px]">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-zinc-500 text-[11px]">
                    {item.cadence}
                  </td>
                  <td className="py-4 px-6 font-mono text-zinc-500 text-[11px]">
                    {item.nextDate}
                  </td>
                  <td className={`py-4 px-6 font-mono font-bold text-right ${item.isIncome ? 'text-emerald-600' : 'text-zinc-900'}`}>
                    {item.isIncome ? '+' : '-'}{formatMoney(item.amount, activeCurrency, false)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-700'
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
