import React, { useState } from 'react';
import { Target, CheckCircle, ArrowRight, ShieldCheck, Clock, Zap, Sparkles, Sliders } from 'lucide-react';
import CountUp from './reactbits/CountUp';
import AnimatedContent from './reactbits/AnimatedContent';
import { formatMoney, getConvertedValue } from '../utils/currency';

export default function GoalsView({ goalData, onApplyRecourse, activeCurrency = 'INR' }) {
  const goal = goalData || {
    title: '6-Month Emergency Reserve',
    current_amount: 14200.00,
    target_amount: 18000.00,
    deadline: '2027-02-12',
    months_remaining: 3.8,
    probabilistic_feasibility: 1.0,
    recourse_profiles: [
      {
        profile_id: 'profile_frugality',
        title: 'Accelerated Target (Finish 1 Month Early)',
        feasibility_probability: 0.95,
        description: 'Trims non-essential dining and entertainment to hit your full savings goal ahead of schedule.',
        proposed_changes: [
          { category: 'Dining & Takeout', delta_monthly: -60.00 },
          { category: 'Entertainment', delta_monthly: -80.00 }
        ]
      },
      {
        profile_id: 'profile_timeline_flex',
        title: 'Balanced Pace (Keep Current Lifestyle)',
        feasibility_probability: 0.92,
        description: 'Maintains your current discretionary spending, allowing your emergency fund to build naturally.',
        revised_deadline: '2027-03-14'
      },
      {
        profile_id: 'profile_balanced',
        title: 'Smart Optimization (Gentle 15% Reduction)',
        feasibility_probability: 0.98,
        description: 'Applies gentle micro-reductions on takeout while maintaining high comfort.',
        proposed_changes: [
          { category: 'Dining & Takeout', delta_monthly: -35.80 },
          { category: 'Shopping & Lifestyle', delta_monthly: -50.00 }
        ]
      }
    ]
  };

  const [extraMonthlySavings, setExtraMonthlySavings] = useState(2500); // INR 2500

  const remainingOriginal = Math.max(0, goal.target_amount - goal.current_amount);
  const baselineMonthly = remainingOriginal / (goal.months_remaining || 3.8);
  const adjustedMonthly = baselineMonthly + (extraMonthlySavings / (activeCurrency === 'INR' ? 83 : 1));
  const simulatedMonths = Math.max(0.5, (remainingOriginal / Math.max(1, adjustedMonthly))).toFixed(1);
  const progressPct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#F4F6FA] text-zinc-900">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
            <span>Savings Goals</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>On Track (98% Feasible)</span>
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Monitor target progress with real-time Monte Carlo completion odds and algorithmic adjustments.
          </p>
        </div>
      </div>

      {/* Goal Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.03)] card-interactive">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold mb-2">
              <Target className="w-3.5 h-3.5 text-teal-600" />
              <span>Primary Milestone</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900">{goal.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mt-1.5 font-medium">
              <span className="flex items-center gap-1 text-zinc-800 font-semibold">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{goal.months_remaining} months left</span>
                <span className="text-zinc-400 font-normal">(Target: {goal.deadline})</span>
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                98% On-Time Completion Likelihood
              </span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-zinc-400 font-medium block">Funded Allocation</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono tabular-nums mt-0.5">
              <CountUp 
                to={getConvertedValue(goal.current_amount, activeCurrency, true)} 
                decimals={2} 
                prefix={activeCurrency === 'INR' ? '₹' : '$'} 
                duration={1.2} 
              />
              <span className="text-sm font-normal text-zinc-400"> / {formatMoney(goal.target_amount, activeCurrency, true)}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="relative w-full bg-zinc-100 h-4 rounded-full overflow-hidden p-0.5 border border-zinc-200">
            <div 
              className="bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-xs font-bold text-zinc-500">
            <span className="text-zinc-900 font-mono">{progressPct}% Funded</span>
            <span className="text-teal-600 font-mono">
              {formatMoney(goal.target_amount - goal.current_amount, activeCurrency, true)} remaining
            </span>
          </div>
        </div>

        {/* Extra Monthly Savings Accelerator */}
        <div className="bg-[#FAFBFD] border border-zinc-200 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-zinc-900">Goal Accelerator</span>
              <span className="text-[10px] text-zinc-400">Test adding monthly SIP</span>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-600">
              +{activeCurrency === 'INR' ? `₹${extraMonthlySavings}` : `$${extraMonthlySavings}`}/mo <span className="text-zinc-500 font-normal">→ Finishes in ~{simulatedMonths} months!</span>
            </div>
          </div>
          <input 
            type="range"
            min="0"
            max={activeCurrency === 'INR' ? 25000 : 300}
            step={activeCurrency === 'INR' ? 1000 : 25}
            value={extraMonthlySavings}
            onChange={(e) => setExtraMonthlySavings(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Recourse Options */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Adjustment Options
            </h3>
            <p className="text-xs text-zinc-500">AI-suggested spending alignments to guarantee goal attainment</p>
          </div>
        </div>

        <AnimatedContent distance={20} duration={0.4} stagger={0.08}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(goal.recourse_profiles || []).map((profile) => (
              <div 
                key={profile.profile_id}
                className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all card-interactive group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      {Math.round(profile.feasibility_probability * 100)}% Success
                    </span>
                    <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 tracking-tight mb-2 group-hover:text-teal-600 transition-colors">
                    {profile.title}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                    {profile.description}
                  </p>

                  {profile.proposed_changes && (
                    <div className="space-y-1.5 mb-4 bg-[#F8F9FC] p-3 rounded-2xl border border-zinc-200">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Recommended Adjustments</div>
                      {profile.proposed_changes.map((c, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-zinc-600">{c.category}</span>
                          <span className="font-mono font-bold text-emerald-600">
                            {c.delta_monthly > 0 ? `+` : `-`}{formatMoney(Math.abs(c.delta_monthly), activeCurrency, true)}/mo
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {profile.revised_deadline && (
                    <div className="bg-[#F8F9FC] p-3 rounded-2xl border border-zinc-200 mb-4 text-xs flex justify-between items-center">
                      <span className="text-zinc-500">Projected Date: </span>
                      <span className="text-zinc-900 font-bold font-mono">{profile.revised_deadline}</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onApplyRecourse && onApplyRecourse(profile.title)}
                  className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all btn-interactive shadow-sm group-hover:shadow-md"
                >
                  <span>Adopt Strategy</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>

    </div>
  );
}
