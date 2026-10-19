import React from 'react';
import { 
  Home, 
  CreditCard, 
  TrendingUp, 
  Target, 
  RotateCw, 
  Sliders, 
  Sparkles, 
  Bell, 
  Plus, 
  LogOut, 
  ChevronDown,
  Gift,
  ShieldCheck
} from 'lucide-react';
import { INDIAN_PERSONAS } from '../utils/currency';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeCurrency, 
  onCurrencyChange, 
  currentPersona, 
  onPersonaChange,
  onLogout,
  onResetData,
  isRefreshing
}) {
  const persona = INDIAN_PERSONAS[currentPersona] || INDIAN_PERSONAS.salaried;

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Spending', icon: CreditCard },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'recurring', label: 'Bills', icon: RotateCw },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'xai', label: 'Insights', icon: Sparkles },
  ];

  return (
    <header className="h-16 bg-white border-b border-black/[0.06] px-4 sm:px-6 lg:px-8 flex items-center justify-between select-none z-30 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      
      {/* Left: Brand Logo with Teal/Mint Badge from image.png */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-teal-600 text-sm font-bold">✦</span>
          </div>
          <span className="text-base font-extrabold text-zinc-900 tracking-tight hidden sm:inline">
            Fintrixity
          </span>
        </div>
      </div>

      {/* Center: Simplified Clean Navigation Links from image.png */}
      <nav className="hidden md:flex items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 btn-interactive ${
                isActive 
                  ? 'text-zinc-900 font-bold bg-[#F4F6FA]' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-900 stroke-[2.4]' : 'text-zinc-400'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-zinc-900 rounded-full"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls from image.png */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Currency Switcher: INR (India) vs USD */}
        <div className="flex items-center bg-[#F4F6FA] p-0.5 rounded-full border border-black/[0.05]">
          <button
            onClick={() => onCurrencyChange('INR')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              activeCurrency === 'INR'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
            title="Switch to Indian Rupee (INR)"
          >
            🇮🇳 ₹
          </button>
          <button
            onClick={() => onCurrencyChange('USD')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              activeCurrency === 'USD'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
            title="Switch to US Dollar (USD)"
          >
            🌐 $
          </button>
        </div>

        {/* Persona Switcher Dropdown */}
        <div className="hidden lg:flex items-center bg-[#F4F6FA] border border-black/[0.05] rounded-full px-3 py-1 text-xs">
          <span className="text-[10px] text-zinc-400 mr-1.5 uppercase font-bold tracking-wider">Persona</span>
          <select 
            value={currentPersona}
            onChange={(e) => onPersonaChange(e.target.value)}
            className="bg-transparent text-zinc-900 font-bold outline-none cursor-pointer text-xs"
          >
            <option value="salaried">Rahul (Salaried, BLR)</option>
            <option value="freelancer">Priya (Freelance, BOM)</option>
            <option value="student">Aarav (Student, DEL)</option>
          </select>
        </div>

        {/* "+ Account" button from image.png */}
        <button 
          onClick={onResetData}
          disabled={isRefreshing}
          className="hidden sm:flex items-center gap-1.5 bg-[#F4F6FA] hover:bg-zinc-200/70 border border-black/[0.06] text-zinc-800 text-xs font-semibold px-3 py-1.5 rounded-full transition-all active:scale-95 btn-interactive"
          title="Reset or Sync Bank Feeds"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Account</span>
        </button>

        {/* Notification Bell with Badge */}
        <button 
          onClick={() => setActiveTab('recurring')}
          className="relative w-8 h-8 rounded-full bg-[#F4F6FA] hover:bg-zinc-200/70 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-all btn-interactive"
          title="Notifications & Upcoming Bills"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </button>

        {/* User Profile Avatar with Online Ring & Signout */}
        <div 
          onClick={onLogout}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
          title="Click to Switch Account or Sign Out"
        >
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center font-bold text-xs text-white shadow-sm group-hover:scale-105 transition-transform">
            <span>{persona.name.charAt(0)}</span>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
          <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500 transition-colors hidden sm:inline" />
        </div>

      </div>

    </header>
  );
}
