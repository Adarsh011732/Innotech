import React from 'react';
import { RotateCw, Calendar, Tv, Home, Zap, ShieldCheck, CheckCircle2, AlertCircle, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import CountUp from './reactbits/CountUp';
import AnimatedContent from './reactbits/AnimatedContent';

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
  const safeBuffer = totalIncome - totalFixedExpenses;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#08090C] relative">
      {/* Ambient Top Glow strictly in upper half */}
      <div className="pointer-events-none absolute top-0 left-1/3 right-1/3 h-[300px] bg-[#FF5722]/10 blur-[120px] rounded-full -translate-y-1/2"></div>

      {/* Title */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Recurring Obligations & Subscriptions</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-bold">
              8 Verified Streams
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
            Automated recurring bill cadence detection, payroll timing, and fixed monthly commitments.
          </p>
        </div>
      </div>

      {/* Burn vs Inflow Metrics */}
      <AnimatedContent distance={20} duration={0.4} stagger={0.1}>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <SpotlightCard 
            spotlightColor="rgba(16, 185, 129, 0.14)" 
            className="p-5 text-white shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#9CA3AF] font-medium">Estimated Monthly Payroll Inflow</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
                +<CountUp to={totalIncome} decimals={2} prefix="$" duration={1.2} /> <span className="text-xs font-normal text-[#6B7280]">/ mo</span>
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1">Direct deposit pattern verified with 99% cadence confidence</p>
            </div>
          </SpotlightCard>

          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.14)" 
            className="p-5 text-white shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#9CA3AF] font-medium">Fixed Recurring Commitments</span>
                <span className="w-2 h-2 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722]"></span>
              </div>
              <div className="text-2xl font-extrabold text-[#FF5722] font-mono tabular-nums">
                -<CountUp to={totalFixedExpenses} decimals={2} prefix="$" duration={1.2} /> <span className="text-xs font-normal text-[#6B7280]">/ mo</span>
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1">Rent, essential utilities, and loan minimum payments</p>
            </div>
          </SpotlightCard>

          <SpotlightCard 
            spotlightColor="rgba(255, 87, 34, 0.14)" 
            className="p-5 text-white shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#9CA3AF] font-medium">Safe Discretionary Cash Buffer</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Surplus</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                +<CountUp to={safeBuffer} decimals={2} prefix="$" duration={1.2} /> <span className="text-xs font-normal text-[#6B7280]">/ mo</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Available for flexible spending & savings goals</p>
            </div>
          </SpotlightCard>
        </div>
      </AnimatedContent>

      {/* Recurring Items Table (Clean, no orange glow at bottom) */}
      <div className="relative z-10 bg-[#14161E] border border-[#232634] rounded-3xl overflow-hidden shadow-xl card-interactive">
        <div className="p-5 border-b border-[#232634] flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Detected Recurring Cadences</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1C25] text-zinc-400 border border-white/[0.05]">
              Active Schedules
            </span>
          </h2>
          <span className="text-xs text-[#9CA3AF] font-mono">Zero-Knowledge Local Analysis</span>
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
                <tr key={idx} className="hover:bg-[#1A1C25] transition-colors group">
                  <td className="py-3.5 px-6 font-bold text-white group-hover:text-[#FF5722] transition-colors">
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
                      item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20'
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
