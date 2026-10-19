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
        w-[250px] min-w-[250px] h-screen bg-[#0E0F14] border-r border-[#1C1E26]
        flex flex-col justify-between p-4 sm:p-5 select-none
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col">
          {/* Brand Header (from image.png: Fintrixity lightning icon + text) */}
          <div className="flex items-center justify-between mb-5">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => { setActiveTab('dashboard'); if (setIsMobileOpen) setIsMobileOpen(false); }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF6D00] to-[#FFA000] flex items-center justify-center text-white shadow-lg shadow-[#FF5722]/35 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
                <Zap className="w-4 h-4 fill-white stroke-none" />
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight leading-none group-hover:text-[#FF5722] transition-colors">
                Fintrixity
              </span>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-[#9CA3AF] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar with ⌘K (from image.png) */}
          <div className="relative flex items-center bg-[#15171F] border border-[#232634] rounded-xl px-3 py-2 mb-4 focus-within:border-[#FF5722] focus-within:ring-1 focus-within:ring-[#FF5722]/30 transition-all">
            <Search className="w-3.5 h-3.5 text-[#6B7280] mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none text-white text-xs w-full outline-none placeholder-[#6B7280]"
            />
            <kbd className="text-[10px] font-mono bg-[#20232E] border border-[#2D303E] rounded px-1.5 py-0.5 text-[#9CA3AF]">
              ⌘K
            </kbd>
          </div>

          {/* Primary Nav Menu (from image.png) */}
          <nav className="flex flex-col gap-1.5">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 btn-interactive ${
                    isActive
                      ? 'bg-black text-white shadow-md border border-[#2B2E3A] ring-1 ring-white/10'
                      : 'text-[#9CA3AF] hover:bg-[#161822] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5722]' : 'text-[#6B7280]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#FF5722]/20 text-[#FF5722]' : 'bg-[#1D1F29] text-[#9CA3AF]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* FEATURES Section Header (from image.png) */}
            <div className="text-[10px] font-bold text-[#555B6E] tracking-wider uppercase px-3.5 pt-4 pb-1">
              FEATURES
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 btn-interactive ${
                    isActive
                      ? 'bg-black text-white shadow-md border border-[#2B2E3A] ring-1 ring-white/10'
                      : 'text-[#9CA3AF] hover:bg-[#161822] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5722]' : 'text-[#6B7280]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#1D1F29] text-[#9CA3AF]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Pro Card (Exact from image.png!) */}
        <div className="bg-[#14161E] border border-[#232634] rounded-2xl p-4 mt-4 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5722]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#FF5722]/20 transition-colors"></div>
          <div className="flex items-center gap-1.5 mb-1 text-white font-bold text-xs">
            <span>Upgrade Pro!</span>
            <span className="text-sm">👑</span>
          </div>
          <p className="text-[#9CA3AF] text-[11px] leading-relaxed mb-3">
            Higher productivity with better organization
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setActiveTab('goals'); if (setIsMobileOpen) setIsMobileOpen(false); }}
              className="bg-gradient-to-r from-[#FF5722] to-[#FF6D00] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-[#FF5722]/30 transition-all active:scale-95 btn-interactive"
            >
              Upgrade
            </button>
            <span 
              onClick={() => { setActiveTab('simulator'); if (setIsMobileOpen) setIsMobileOpen(false); }}
              className="text-[#6B7280] hover:text-white text-xs cursor-pointer transition-colors"
            >
              Learn more
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
