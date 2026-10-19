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
    <header className="h-16 min-h-[64px] bg-[#0E0F14] border-b border-[#1C1E26] px-4 sm:px-6 lg:px-8 flex items-center justify-between select-none z-20">
      
      {/* Left: Mobile Toggle + Breadcrumb Navigation (from image.png) */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Hamburger */}
        <button 
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-xl bg-[#15171F] border border-[#232634] text-[#9CA3AF] hover:text-white"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Back / Forward arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="relative hover:z-30 w-7 h-7 rounded-lg bg-[#15171F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722] hover:bg-[#1C1F2B] hover:scale-110 active:scale-95 transition-all duration-200 btn-interactive"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('forecast')}
            className="relative hover:z-30 w-7 h-7 rounded-lg bg-[#15171F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722] hover:bg-[#1C1F2B] hover:scale-110 active:scale-95 transition-all duration-200 btn-interactive"
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Breadcrumb Trail (Exact from image.png: Fintrixity > Dashboard) */}
        <div className="flex items-center gap-1.5 ml-1 text-xs text-[#9CA3AF]">
          <span 
            className="hover:text-white cursor-pointer transition-colors"
            onClick={() => setActiveTab('dashboard')}
          >
            Fintrixity
          </span>
          <span className="text-[#4B5563]">›</span>
          <span className="text-white font-bold">{tabTitles[activeTab] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right Controls (from image.png) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Solvency Health Indicator */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#15171F] border border-[#232634] px-2.5 py-1 rounded-xl text-xs hover:border-emerald-500/40 transition-colors">
          {isSafe ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF5722]" />
          )}
          <span className="text-[11px] text-[#9CA3AF] font-medium">Solvency:</span>
          <span className={`font-extrabold ${isSafe ? 'text-emerald-400' : 'text-[#FF5722]'}`}>
            {solvencyScore}/100
          </span>
        </div>

        {/* Persona Selector Dropdown */}
        <div className="flex items-center bg-[#15171F] border border-[#232634] hover:border-white/20 rounded-xl px-2.5 py-1.5 text-xs transition-colors">
          <span className="hidden sm:inline text-[11px] text-[#6B7280] mr-1.5 font-medium">Persona:</span>
          <select 
            value={currentPersona}
            onChange={(e) => onPersonaChange(e.target.value)}
            className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
          >
            <option value="salaried" className="bg-[#15171F] text-white">Salaried Tech Exec</option>
            <option value="freelancer" className="bg-[#15171F] text-white">Volatile Freelancer</option>
            <option value="student" className="bg-[#15171F] text-white">Student (Tight Runway)</option>
          </select>
        </div>

        {/* Action Circles (Exact from image.png) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reset Data Button */}
          <button 
            onClick={onResetData}
            disabled={isRefreshing}
            className="relative hover:z-30 w-8 h-8 rounded-full bg-[#15171F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722] hover:bg-[#1E212D] hover:scale-110 active:scale-95 transition-all duration-200 btn-interactive shadow-sm"
            title="Reset Data to Baseline"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF5722]' : ''}`} />
          </button>

          <button 
            onClick={() => setActiveTab('simulator')}
            className="hidden sm:flex relative hover:z-30 w-8 h-8 rounded-full bg-[#15171F] border border-[#232634] items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722] hover:bg-[#1E212D] hover:scale-110 active:scale-95 transition-all duration-200 btn-interactive shadow-sm"
            title="Help & Simulator"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={() => setActiveTab('transactions')}
            className="hidden sm:flex relative hover:z-30 w-8 h-8 rounded-full bg-[#15171F] border border-[#232634] items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722] hover:bg-[#1E212D] hover:scale-110 active:scale-95 transition-all duration-200 btn-interactive shadow-sm"
            title="Mail & Statements"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>

          <button 
            className="relative hover:z-30 w-8 h-8 rounded-full bg-[#15171F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722] hover:bg-[#1E212D] hover:scale-110 active:scale-95 transition-all duration-200 btn-interactive shadow-sm"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722]"></span>
          </button>

          {/* User Profile Avatar with Online Ring (from image.png) */}
          <div className="relative hover:z-30 w-8 h-8 rounded-full bg-[#20232E] hover:bg-[#2A2E3D] hover:border-[#FF5722] hover:scale-110 flex items-center justify-center font-bold text-xs text-white border border-[#333747] cursor-pointer ml-0.5 transition-all duration-200 shadow-md">
            <span className="text-[11px] font-bold">JD</span>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0E0F14]"></span>
          </div>
        </div>

        {/* Orange CTA Share Button (Exact from image.png!) */}
        <button 
          onClick={() => setActiveTab('goals')}
          className="relative hover:z-30 bg-gradient-to-r from-[#FF5722] to-[#FF6D00] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-xs px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#FF5722]/30 hover:shadow-[0_0_24px_rgba(255,87,34,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 btn-interactive"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </header>
  );
}
