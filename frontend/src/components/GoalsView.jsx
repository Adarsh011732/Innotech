import React, { useState } from 'react';
import { Target, CheckCircle, ArrowRight, ShieldCheck, Clock, Zap, Sparkles, TrendingUp, ChevronRight, Sliders } from 'lucide-react';
import CountUp from './reactbits/CountUp';
import SpotlightCard from './reactbits/SpotlightCard';
import AnimatedContent from './reactbits/AnimatedContent';

export default function GoalsView({ goalData, onApplyRecourse }) {
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
        description: 'Applies gentle $35 reductions on takeout and online shopping while maintaining high comfort.',
        proposed_changes: [
          { category: 'Dining & Takeout', delta_monthly: -35.80 },
          { category: 'Shopping & Lifestyle', delta_monthly: -50.00 }
        ]
      }
    ]
  };

  const [extraMonthlySavings, setExtraMonthlySavings] = useState(100);

  // Compute simulated progress with interactive extra monthly savings
  const remainingOriginal = Math.max(0, goal.target_amount - goal.current_amount);
  const baselineMonthly = remainingOriginal / (goal.months_remaining || 3.8);
  const adjustedMonthly = baselineMonthly + extraMonthlySavings;
  const simulatedMonths = Math.max(0.5, (remainingOriginal / Math.max(1, adjustedMonthly))).toFixed(1);
  const progressPct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#08090C] relative">
      {/* Ambient Top Glow strictly in upper half */}
      <div className="pointer-events-none absolute top-0 left-1/3 right-1/3 h-[300px] bg-[#FF5722]/10 blur-[120px] rounded-full -translate-y-1/2"></div>

      {/* View Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Savings Goals & Smart Allocation</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>On Track (98% Feasible)</span>
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
            Monitor target progress with real-time Monte Carlo completion odds and algorithmic recourse options.
          </p>
        </div>
      </div>

      {/* Goal Summary Card with Spotlight & Progress */}
      <div className="relative z-10">
        <SpotlightCard 
          spotlightColor="rgba(255, 87, 34, 0.16)" 
          className="p-6 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 text-xs font-bold mb-2">
                <Target className="w-3.5 h-3.5" />
                <span>Primary Milestone</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{goal.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#9CA3AF] mt-1.5 font-medium">
                <span className="flex items-center gap-1 text-white">
                  <Clock className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>{goal.months_remaining} months left</span>
                  <span className="text-[#6B7280]">(Target: {goal.deadline})</span>
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  98% On-Time Completion Likelihood
                </span>
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs text-[#9CA3AF] font-medium block">Funded Allocation</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-0.5">
                <CountUp to={goal.current_amount} decimals={2} prefix="$" duration={1.2} />
                <span className="text-sm font-normal text-[#6B7280]"> / ${goal.target_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="space-y-2 mb-6">
            <div className="relative w-full bg-[#151722] h-4 rounded-full overflow-hidden p-0.5 border border-[#262936]">
              <div 
                className="bg-gradient-to-r from-[#FF3D00] via-[#FF5722] to-[#FFA000] h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-[#FF5722]/50 relative"
                style={{ width: `${progressPct}%` }}
              >
                {/* Glowing Leading Indicator */}
                <span className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#FFF] animate-pulse"></span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold text-[#9CA3AF]">
              <span className="text-white font-mono">{progressPct}% Funded</span>
              <span className="text-[#FF5722] font-mono">${(goal.target_amount - goal.current_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} remaining</span>
            </div>
          </div>

          {/* Interactive Extra Monthly Savings Accelerator */}
          <div className="bg-[#0B0C10] border border-[#20222C] rounded-2xl p-4 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF5722]" />
                <span className="text-xs font-bold text-white">Interactive Goal Accelerator</span>
                <span className="text-[10px] text-zinc-400">Test additional monthly contribution</span>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400">
                +${extraMonthlySavings}/mo <span className="text-zinc-400 font-normal">→ Finishes in ~{simulatedMonths} months!</span>
              </div>
            </div>
            <input 
              type="range"
              min="0"
              max="500"
              step="25"
              value={extraMonthlySavings}
              onChange={(e) => setExtraMonthlySavings(Number(e.target.value))}
              className="w-full accent-[#FF5722] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6B7280] mt-1 font-mono">
              <span>+$0/mo</span>
              <span>+$250/mo</span>
              <span>+$500/mo (Fast-track)</span>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Recommended Action Pathways */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Algorithmic Recourse Strategies</span>
              <span className="text-xs font-normal text-zinc-500">Pick an allocation model</span>
            </h3>
            <p className="text-xs text-[#9CA3AF]">AI-generated micro-adjustments optimized to guarantee goal feasibility</p>
          </div>
        </div>

        <AnimatedContent distance={20} duration={0.4} stagger={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(goal.recourse_profiles || []).map((profile) => (
              <SpotlightCard 
                key={profile.profile_id}
                spotlightColor="rgba(255, 87, 34, 0.14)"
                className="p-5 text-white flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#181A22] border border-[#282B37] text-white flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-[#FF5722]" />
                      {Math.round(profile.feasibility_probability * 100)}% Success
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight mb-2 group-hover:text-[#FF5722] transition-colors">
                    {profile.title}
                  </h4>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
                    {profile.description}
                  </p>

                  {profile.proposed_changes && (
                    <div className="space-y-1.5 mb-4 bg-[#0D0E13] p-3 rounded-2xl border border-[#1E202B]">
                      <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Recommended Adjustments</div>
                      {profile.proposed_changes.map((c, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-[#9CA3AF]">{c.category}</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {c.delta_monthly > 0 ? `+$${c.delta_monthly}` : `-$${Math.abs(c.delta_monthly)}`}/mo
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {profile.revised_deadline && (
                    <div className="bg-[#0D0E13] p-3 rounded-2xl border border-[#1E202B] mb-4 text-xs flex justify-between items-center">
                      <span className="text-[#9CA3AF]">Projected Date: </span>
                      <span className="text-white font-bold font-mono">{profile.revised_deadline}</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onApplyRecourse && onApplyRecourse(profile.title)}
                  className="relative hover:z-20 w-full bg-[#181A22] hover:bg-[#FF5722] text-white border border-[#2A2D3A] hover:border-[#FF5722] text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 btn-interactive shadow-sm hover:shadow-lg hover:shadow-[#FF5722]/30 active:scale-95"
                >
                  <span>Adopt Strategy</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SpotlightCard>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
