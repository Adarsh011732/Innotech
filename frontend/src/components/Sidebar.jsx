import React from 'react';
import { 
  Zap, 
  Search, 
  LayoutDashboard, 
  BarChart3, 
  ArrowLeftRight, 
  FileText, 
  RotateCw, 
  CreditCard, 
  Sliders, 
  Cpu, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import ShinyText from './reactbits/ShinyText';
import BlurText from './reactbits/BlurText';

export default function Sidebar({ activeTab, setActiveTab, txCount = 0, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Analytics', icon: BarChart3, badge: '20' },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, badge: txCount > 0 ? txCount : '284' },
    { id: 'goals', label: 'Invoices & Goals', icon: FileText },
  ];

  const featureItems = [
    { id: 'recurring', label: 'Recurring', icon: RotateCw, badge: '16' },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'xai', label: 'Risk & Explainability', icon: Cpu },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-[235px] min-w-[235px] h-screen bg-[#0E1015] border-r border-white/[0.07]
        flex flex-col justify-between p-4 select-none
        transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => { setActiveTab('dashboard'); if (setIsMobileOpen) setIsMobileOpen(false); }}
            >
              <div className="w-7 h-7 rounded-md bg-[#FF5722] flex items-center justify-center text-white shadow-sm shadow-[#FF5722]/30 transition-transform duration-200 group-hover:scale-105">
                <Zap className="w-4 h-4 fill-white stroke-none" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight leading-none group-hover:text-[#FF5722] transition-colors">
                Fintrixity
              </span>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar with ⌘K */}
          <div className="relative flex items-center bg-[#13161C] border border-white/[0.07] rounded-md px-2.5 py-1.5 mb-4 focus-within:border-[#FF5722] transition-colors">
            <Search className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none text-white text-xs w-full outline-none placeholder-zinc-500 font-medium"
            />
            <kbd className="text-[9px] font-mono bg-white/[0.06] border border-white/[0.08] rounded px-1 py-0.5 text-zinc-400">
              ⌘K
            </kbd>
          </div>

          {/* Primary Nav Menu */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 btn-interactive ${
                    isActive
                      ? 'bg-[#181C24] text-white border border-white/[0.08] shadow-sm'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5722]' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-[#FF5722]/15 text-[#FF5722]' : 'bg-white/[0.05] text-zinc-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* FEATURES Section Header */}
            <div className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase px-3 pt-4 pb-1">
              Analytics & Models
            </div>

            {featureItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 btn-interactive ${
                    isActive
                      ? 'bg-[#181C24] text-white border border-white/[0.08] shadow-sm'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5722]' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] text-zinc-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tier Info Card */}
        <div className="bg-[#13161C] border border-white/[0.07] rounded-lg p-3.5 mt-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white">Fintrixity Pro</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Active</span>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
            Real-time CQR confidence bands & multi-scenario simulation enabled.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px]">
            <span 
              onClick={() => { setActiveTab('simulator'); if (setIsMobileOpen) setIsMobileOpen(false); }}
              className="text-[#FF5722] hover:text-[#FFA000] cursor-pointer font-medium transition-colors"
            >
              Configure engine →
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
