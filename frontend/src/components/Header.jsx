import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Mail, 
  Bell, 
  Share2, 
  RotateCcw,
  Sparkles,
  Zap,
  Sliders
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  currentPersona, 
  onPersonaChange, 
  onResetData, 
  isRefreshing 
}) {
  const tabTitles = {
    dashboard: 'Dashboard',
    calendar: 'Calendar & Schedule',
    tasks: 'My Tasks & Workflow',
    forecast: 'Statistics & Forecast',
    transactions: 'Documents & Ledger',
    goals: 'Goals & Recourse',
    simulator: 'What-If Simulator',
    xai: 'Risk & Factor Attribution',
    settings: 'Settings'
  };

  return (
    <header className="h-16 min-h-[64px] bg-[#0E0F14] border-b border-[#1C1E26] px-8 flex items-center justify-between select-none z-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2.5">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="w-8 h-8 rounded-xl bg-[#14161F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
          title="Back"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setActiveTab('forecast')}
          className="w-8 h-8 rounded-xl bg-[#14161F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
          title="Forward"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 ml-2 text-xs text-[#9CA3AF]">
          <span className="font-semibold text-white/70">iDraft</span>
          <span className="text-[#4B5563]">/</span>
          <span className="text-white font-bold">{tabTitles[activeTab] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Profile Switcher */}
        <div className="flex items-center bg-[#14161F] border border-[#232634] rounded-xl px-3 py-1.5 text-xs">
          <span className="text-[11px] text-[#6B7280] mr-2 font-medium">Persona:</span>
          <select 
            value={currentPersona}
            onChange={(e) => onPersonaChange(e.target.value)}
            className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
          >
            <option value="salaried" className="bg-[#14161F] text-white">Salaried Tech Exec</option>
            <option value="freelancer" className="bg-[#14161F] text-white">Independent Freelancer</option>
            <option value="student" className="bg-[#14161F] text-white">Student (Tight Runway)</option>
          </select>
        </div>

        {/* Action Circles */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onResetData}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-xl bg-[#14161F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="Reset to Baseline"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF5722]' : ''}`} />
          </button>

          <button 
            onClick={() => setActiveTab('simulator')}
            className="w-8 h-8 rounded-xl bg-[#14161F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-[#FF5722] hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="What-If Simulator"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button 
            className="relative w-8 h-8 rounded-xl bg-[#14161F] border border-[#232634] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#FF5722]/50 transition-all btn-interactive"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722]"></span>
          </button>
        </div>

        {/* Orange Accent Action Button */}
        <button 
          onClick={() => setActiveTab('goals')}
          className="bg-gradient-to-r from-[#FF5722] to-[#FF6D00] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF5722]/30 transition-all duration-200 btn-interactive"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
}
