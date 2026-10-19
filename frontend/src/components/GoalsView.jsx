import React from 'react';
import { Target, CheckCircle, ArrowRight, ShieldCheck, Clock, Zap, Sparkles } from 'lucide-react';

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

  const progressPct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-9 lg:py-8 space-y-6 select-none bg-[#08090C]">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Savings Goals & Smart Allocation</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 font-bold">
            On Track
          </span>
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1 font-medium">
          Track progress toward your major financial targets and choose actionable adjustments to meet deadlines comfortably.
        </p>
      </div>

      {/* Goal Summary Card */}
      <div className="bg-[#111217] border border-[#222530] rounded-3xl p-6 text-white shadow-xl card-interactive">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30 text-xs font-bold mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Primary Milestone</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{goal.title}</h2>
            <div className="flex items-center gap-4 text-xs text-[#9CA3AF] mt-1 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF5722]" />
                {goal.months_remaining} months left (Deadline: {goal.deadline})
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">98% On-Time Completion Likelihood</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#9CA3AF] font-medium">Current Funded</span>
            <div className="text-2xl font-extrabold text-white">
              ${goal.current_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              <span className="text-sm font-normal text-[#6B7280]"> / ${goal.target_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#181A22] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#262936] my-4">
          <div 
            className="bg-gradient-to-r from-[#FF5722] to-[#FFA000] h-full rounded-full transition-all duration-700 ease-out shadow-lg shadow-[#FF5722]/40"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-xs font-bold text-[#9CA3AF]">
          <span>{progressPct}% Completed</span>
          <span>${(goal.target_amount - goal.current_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} to go</span>
        </div>
      </div>

      {/* Recommended Action Pathways */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Smart Adjustment Options</h3>
            <p className="text-xs text-[#9CA3AF]">Choose an allocation strategy that fits your current lifestyle preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(goal.recourse_profiles || []).map((profile) => (
            <div 
              key={profile.profile_id}
              className="bg-[#111217] border border-[#222530] hover:border-[#FF5722]/50 rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl card-interactive group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#181A22] border border-[#282B37] text-white">
                    {Math.round(profile.feasibility_probability * 100)}% Success Rate
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight mb-2">
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
                        <span className="font-bold text-emerald-400">
                          {c.delta_monthly > 0 ? `+$${c.delta_monthly}` : `-$${Math.abs(c.delta_monthly)}`}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {profile.revised_deadline && (
                  <div className="bg-[#0D0E13] p-3 rounded-2xl border border-[#1E202B] mb-4 text-xs">
                    <span className="text-[#9CA3AF]">Target Completion: </span>
                    <span className="text-white font-bold">{profile.revised_deadline}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onApplyRecourse && onApplyRecourse(profile.title)}
                className="w-full bg-[#181A22] hover:bg-[#FF5722] text-white border border-[#2A2D3A] hover:border-[#FF5722] text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 btn-interactive shadow-sm group-hover:shadow-lg group-hover:shadow-[#FF5722]/20"
              >
                <span>Adopt Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
