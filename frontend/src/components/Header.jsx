import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Mail, 
  Bell, 
  Share2, 
  RotateCcw,
  Menu,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  currentPersona, 
  onPersonaChange, 
  onResetData, 
  isRefreshing,
  stressData,
  onOpenMobileMenu
}) {
  const tabTitles = {
    dashboard: 'Dashboard',
    forecast: 'Analytics',
    transactions: 'Transactions',
    goals: 'Invoices & Goals',
    recurring: 'Recurring Obligations',
    simulator: 'What-If Simulator',
    xai: 'Risk & Explainability'
  };

  const solvencyScore = stressData?.solvency_score ?? 98;
  const isSafe = solvencyScore >= 70;

  return (
    <header className="h-14 min-h-[56px] bg-[#0E1015] border-b border-white/[0.07] px-4 sm:px-6 lg:px-8 flex items-center justify-between select-none z-20">
      
      {/* Left: Mobile Toggle + Breadcrumb Navigation */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button 
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg bg-[#13161C] border border-white/[0.08] text-zinc-400 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Back / Forward arrows */}
        <div className="hidden sm:flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="w-7 h-7 rounded-md bg-[#13161C] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="Dashboard"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setActiveTab('forecast')}
            className="w-7 h-7 rounded-md bg-[#13161C] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="Analytics"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs">
          <span 
            className="text-zinc-400 hover:text-white cursor-pointer font-medium transition-colors"
            onClick={() => setActiveTab('dashboard')}
          >
            Fintrixity
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-semibold tracking-tight">{tabTitles[activeTab] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Solvency Health Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-[#13161C] border border-white/[0.07] px-2.5 py-1 rounded-md text-xs">
          <span className={`w-1.5 h-1.5 rounded-full ${isSafe ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]' : 'bg-[#FF5722] shadow-[0_0_6px_rgba(255,87,34,0.4)]'}`}></span>
          <span className="text-zinc-400 font-medium">Solvency:</span>
          <span className={`font-mono font-bold ${isSafe ? 'text-emerald-400' : 'text-[#FF5722]'}`}>
            {solvencyScore}/100
          </span>
        </div>

        {/* Persona Selector Dropdown */}
        <div className="flex items-center bg-[#13161C] border border-white/[0.08] rounded-md px-2.5 py-1 text-xs">
          <span className="hidden sm:inline text-zinc-400 mr-1.5 font-medium">Profile:</span>
          <select 
            value={currentPersona}
            onChange={(e) => onPersonaChange(e.target.value)}
            className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs focus:ring-0"
          >
            <option value="salaried" className="bg-[#13161C] text-white">Salaried Tech Exec</option>
            <option value="freelancer" className="bg-[#13161C] text-white">Volatile Freelancer</option>
            <option value="student" className="bg-[#13161C] text-white">Student (Tight Runway)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Refresh Data */}
          <button 
            onClick={onResetData}
            disabled={isRefreshing}
            className="w-7 h-7 rounded-md bg-[#13161C] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="Refresh Ledger"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF5722]' : ''}`} />
          </button>

          <button 
            className="relative w-7 h-7 rounded-md bg-[#13161C] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="Alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span>
          </button>

          {/* User Profile Avatar */}
          <div className="relative w-7 h-7 rounded-md bg-[#181C24] flex items-center justify-center font-bold text-xs text-white border border-white/[0.12] cursor-pointer ml-1">
            <span className="text-[10px] font-mono">JD</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0E1015]"></span>
          </div>
        </div>

        {/* Orange CTA Export / Share */}
        <button 
          onClick={() => setActiveTab('goals')}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition-all active:scale-95 btn-interactive ml-1"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
}

