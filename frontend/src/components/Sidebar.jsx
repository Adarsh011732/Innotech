import React from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  Folder, 
  PlusCircle, 
  Settings,
  Sparkles,
  Zap,
  Sliders,
  Cpu
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-[230px] min-w-[230px] h-screen bg-[#0E0F14] border-r border-[#1C1E26] flex flex-col justify-between p-5 select-none z-20">
      <div className="flex flex-col">
        {/* Brand Header (from image: geometric 4-leaf logo + iDraft) */}
        <div 
          className="flex items-center gap-3 px-1 py-1 mb-6 cursor-pointer group"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF6D00] to-[#FFA000] flex items-center justify-center text-white shadow-lg shadow-[#FF5722]/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93A4 4 0 0 1 18 12a4 4 0 0 1-4 4c-1.95 0-3.58-1.4-3.93-3.25A4 4 0 0 1 6 12a4 4 0 0 1 4-4c1.95 0 3.58 1.4 3.93 3.25A3.99 3.99 0 0 1 12 2z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-xl tracking-tight leading-none group-hover:text-[#FF5722] transition-colors">
              iDraft
            </span>
            <span className="text-[10px] text-[#6B7280] font-medium tracking-wide">Financial Workspace</span>
          </div>
        </div>

        {/* Primary Navigation Menu (Exact layout from image.png) */}
        <nav className="flex flex-col gap-1.5">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 btn-interactive ${
              activeTab === 'dashboard'
                ? 'bg-black text-white shadow-md border border-[#2D3039] ring-1 ring-white/10'
                : 'text-[#9CA3AF] hover:bg-[#161821] hover:text-white'
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#FF5722]' : 'text-[#6B7280]'}`} />
            <span>Dashboard</span>
          </button>

          {/* Calendar */}
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 btn-interactive ${
              activeTab === 'calendar'
                ? 'bg-black text-white shadow-md border border-[#2D3039] ring-1 ring-white/10'
                : 'text-[#9CA3AF] hover:bg-[#161821] hover:text-white'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'calendar' ? 'text-[#FF5722]' : 'text-[#6B7280]'}`} />
            <span>Calendar</span>
          </button>

          {/* My Tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 btn-interactive ${
              activeTab === 'tasks'
                ? 'bg-black text-white shadow-md border border-[#2D3039] ring-1 ring-white/10'
                : 'text-[#9CA3AF] hover:bg-[#161821] hover:text-white'
            }`}
          >
            <CheckSquare className={`w-4 h-4 ${activeTab === 'tasks' ? 'text-[#FF5722]' : 'text-[#6B7280]'}`} />
            <span>My Tasks</span>
          </button>

          {/* Statistics (Forecast & Cashflow Analytics) */}
          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 btn-interactive ${
              activeTab === 'forecast'
                ? 'bg-black text-white shadow-md border border-[#2D3039] ring-1 ring-white/10'
                : 'text-[#9CA3AF] hover:bg-[#161821] hover:text-white'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${activeTab === 'forecast' ? 'text-[#FF5722]' : 'text-[#6B7280]'}`} />
            <span>Statistics</span>
          </button>

          {/* Documents (Ledger & Invoices) */}
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 btn-interactive ${
              activeTab === 'transactions'
                ? 'bg-black text-white shadow-md border border-[#2D3039] ring-1 ring-white/10'
                : 'text-[#9CA3AF] hover:bg-[#161821] hover:text-white'
            }`}
          >
            <Folder className={`w-4 h-4 ${activeTab === 'transactions' ? 'text-[#FF5722]' : 'text-[#6B7280]'}`} />
            <span>Documents</span>
          </button>
        </nav>

        {/* INTEGRATIONS Section (Exact from image.png) */}
        <div className="mt-7">
          <div className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase px-3.5 mb-2.5">
            INTEGRATIONS
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#9CA3AF] hover:bg-[#161821] hover:text-white cursor-pointer transition-all">
              <span className="w-4 h-4 text-center font-bold text-sm text-[#FF5722]">#</span>
              <span>Slack</span>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#9CA3AF] hover:bg-[#161821] hover:text-white cursor-pointer transition-all">
              <span className="w-4 h-4 text-center font-extrabold text-xs">N</span>
              <span>Notion</span>
            </div>
            <div 
              onClick={() => setActiveTab('simulator')}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#9CA3AF] hover:bg-[#161821] hover:text-[#FF5722] cursor-pointer transition-all group"
            >
              <PlusCircle className="w-4 h-4 text-[#6B7280] group-hover:text-[#FF5722] transition-colors" />
              <span>Add new plugin</span>
            </div>
          </div>
        </div>

        {/* TEAMS Section (Exact from image.png) */}
        <div className="mt-6">
          <div className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase px-3.5 mb-2.5">
            TEAMS
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#9CA3AF] hover:bg-[#161821] hover:text-white cursor-pointer transition-all">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] shadow-[0_0_8px_rgba(255,87,34,0.6)]"></span>
              <span>SEO</span>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#9CA3AF] hover:bg-[#161821] hover:text-white cursor-pointer transition-all">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></span>
              <span>Marketing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings at bottom (Exact from image.png) */}
      <div className="pt-4 border-t border-[#1C1E26]">
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#9CA3AF] hover:bg-[#161821] hover:text-white transition-all btn-interactive"
        >
          <Settings className="w-4 h-4 text-[#6B7280]" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
