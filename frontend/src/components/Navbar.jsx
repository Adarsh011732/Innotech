import React, { useState } from 'react';
import { 
  CreditCard, 
  PieChart, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  Plus, 
  Bell, 
  RotateCw,
  Menu,
  X
} from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activePersona = 'salaried',
  onPersonaChange,
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Portfolio', icon: PieChart },
    { id: 'transactions', label: 'Spending', icon: CreditCard },
    { id: 'forecast', label: 'Invest', icon: TrendingUp },
    { id: 'simulator', label: 'Advice', icon: Sparkles },
    { id: 'goals', label: 'Goals', icon: ShieldCheck },
    { id: 'recurring', label: 'Estate', icon: RotateCw },
  ];

  const personaOptions = [
    { id: 'salaried', label: 'Rahul Sharma', sublabel: 'Salaried Tech Lead (BLR)', icon: '👨‍💼', badge: 'BLR' },
    { id: 'freelancer', label: 'Priya Patel', sublabel: 'Freelance Designer (BOM)', icon: '👩‍🎨', badge: 'BOM' },
    { id: 'student', label: 'Aarav Mehta', sublabel: 'Student & Intern (DEL)', icon: '🎓', badge: 'DEL' },
  ];

  return (
    <>
      <header className="h-16 bg-white border-b border-black/[0.06] select-none z-30 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sticky top-0 w-full">
        
        {/* Centered Constrained Container matching main content max-width and padding */}
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          
          {/* Left Group: Logo & Navigation Tabs grouped harmoniously together */}
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 h-full">
            
            {/* Logo & Brandmark */}
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
              title="Fintrixity Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-2 flex items-center justify-center shadow-md shadow-teal-900/10 border border-slate-700/30 group-hover:scale-105 transition-all">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M12 2L3 7L12 12L21 7L12 2Z" fill="url(#brand-grad-1)" />
                  <path d="M3 12L12 17L21 12" stroke="#2DD4BF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 17L12 22L21 17" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="brand-grad-1" x1="3" y1="2" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2DD4BF" />
                      <stop offset="1" stopColor="#0EA5E9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                  Fintrixity
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight mt-0.5">
                  Intelligence
                </span>
              </div>
            </div>

            {/* Navigation Tabs (Desktop & Tablet) */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-3 whitespace-nowrap h-full">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative h-full px-2.5 lg:px-3 text-xs font-semibold flex items-center gap-2 transition-colors duration-150 whitespace-nowrap flex-shrink-0 ${
                      isActive 
                        ? 'text-zinc-900 font-bold' 
                        : 'text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-900 stroke-[2.2]' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-900 rounded-full animate-dropdown"></span>
                    )}
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Right Controls - Aligned with right edge of dashboard cards */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Persona Custom Glass Dropdown */}
            <div className="hidden xl:block">
              <CustomDropdown 
                options={personaOptions}
                value={activePersona}
                onChange={(val) => onPersonaChange && onPersonaChange(val)}
                placeholder="Persona"
                align="right"
              />
            </div>

            {/* Reward Pill: Get ₹2,000 */}
            <button 
              onClick={() => setActiveTab('simulator')}
              className="hidden lg:flex items-center gap-1.5 bg-[#18191E] hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all btn-interactive whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Get ₹2,000</span>
            </button>

            {/* + Account Pill */}
            <button 
              onClick={() => setActiveTab('transactions')}
              className="hidden sm:flex items-center gap-1 bg-white hover:bg-zinc-50 border border-black/[0.08] text-zinc-800 text-xs font-bold px-3.5 py-2 rounded-full shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all btn-interactive whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Account</span>
            </button>

            {/* Circular Notification Bell */}
            <button 
              onClick={() => setActiveTab('recurring')}
              className="w-9 h-9 rounded-full bg-white hover:bg-zinc-50 border border-black/[0.08] flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all btn-interactive"
              title="Notifications & Alerts"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            {/* User Profile Avatar with Online Dot */}
            <div 
              onClick={onLogout}
              className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-white shadow-sm flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all"
              title="Click to Sign Out"
            >
              <span>{activePersona === 'salaried' ? 'RS' : activePersona === 'freelancer' ? 'PP' : 'AM'}</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-white hover:bg-zinc-50 border border-black/[0.08] flex items-center justify-center text-zinc-700 shadow-sm"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

      </header>

      {/* Mobile Drawer / Dropdown Menu for Small Screens */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-3 shadow-lg z-30 animate-dropdown">
          <div className="max-w-[1600px] mx-auto grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-zinc-900 text-white shadow-sm' 
                      : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
