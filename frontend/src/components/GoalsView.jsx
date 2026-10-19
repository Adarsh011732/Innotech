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
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none bg-[#090A0D]">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Savings Goals & Smart Allocation</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            On Track (98%)
          </span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5 font-medium">
          Track milestone progress and select algorithmic recourse pathways to optimize your timeline.
        </p>
      </div>

      {/* Goal Summary Card */}
      <div className="bg-[#13161C] border border-white/[0.07] rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-semibold text-zinc-300 mb-2">
              <Target className="w-3 h-3 text-[#FF5722]" />
              <span>Primary Milestone</span>
            </div>
            <h2 className="text-lg font-bold text-white">{goal.title}</h2>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-medium flex-wrap">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                {goal.months_remaining} months remaining • Deadline: {goal.deadline}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-semibold">98% On-Time Probability</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-zinc-400 font-medium">Funded Balance</span>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              ${goal.current_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              <span className="text-xs font-normal text-zinc-500"> / ${goal.target_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#0E1015] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/[0.06] my-3">
          <div 
            className="bg-gradient-to-r from-[#FF5722] to-[#FFA000] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
          <span className="font-semibold text-white">{progressPct}% Funded</span>
          <span className="text-zinc-400">${(goal.target_amount - goal.current_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} remaining</span>
        </div>
      </div>

      {/* Recommended Action Pathways */}
      <div>
        <div className="mb-3 px-1">
          <h3 className="text-sm font-semibold text-white tracking-tight">Algorithmic Recourse Strategies</h3>
          <p className="text-xs text-zinc-400">Targeted lifestyle adjustments generated by constraint optimization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(goal.recourse_profiles || []).map((profile) => (
            <div 
              key={profile.profile_id}
              className="bg-[#13161C] border border-white/[0.07] hover:border-white/[0.14] rounded-xl p-4 text-white flex flex-col justify-between shadow-sm transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-emerald-400">
                    {Math.round(profile.feasibility_probability * 100)}% Feasibility
                  </span>
                  <div className="w-6 h-6 rounded-md bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center">
                    <Zap className="w-3 h-3" />
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white mb-1.5">
                  {profile.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  {profile.description}
                </p>

                {profile.proposed_changes && (
                  <div className="space-y-1.5 mb-3.5 bg-[#0E1015] p-2.5 rounded-lg border border-white/[0.06]">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Monthly Delta</div>
                    {profile.proposed_changes.map((c, i) => (
                      <div key={i} className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">{c.category}</span>
                        <span className="font-semibold text-emerald-400">
                          {c.delta_monthly > 0 ? `+$${c.delta_monthly}` : `-$${Math.abs(c.delta_monthly)}`}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {profile.revised_deadline && (
                  <div className="bg-[#0E1015] p-2.5 rounded-lg border border-white/[0.06] mb-3.5 text-xs font-mono">
                    <span className="text-zinc-400">Target Deadline: </span>
                    <span className="text-white font-semibold">{profile.revised_deadline}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onApplyRecourse && onApplyRecourse(profile.title)}
                className="w-full bg-[#181C24] hover:bg-[#FF5722] text-white border border-white/[0.08] hover:border-[#FF5722] text-xs font-semibold py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors btn-interactive shadow-sm"
              >
                <span>Adopt Strategy</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
