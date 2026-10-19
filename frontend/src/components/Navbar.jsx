import React from 'react';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  Plus, 
  Bell, 
  LogOut,
  Sliders,
  RotateCw,
  User,
  Globe
} from 'lucide-react';
import { REGIONS } from './LoginPage';
import CustomDropdown from './CustomDropdown';
import { INDIAN_PERSONAS } from '../utils/currency';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeRegion = 'IN',
  onRegionChange, 
  activePersona = 'salaried',
  onPersonaChange,
  onLogout 
}) {
  const currentRegion = REGIONS.find(r => r.code === activeRegion) || REGIONS[0];

  const navItems = [
    { id: 'dashboard', label: 'Portfolio', icon: PieChart },
    { id: 'transactions', label: 'Spending', icon: CreditCard },
    { id: 'forecast', label: 'Invest', icon: TrendingUp },
    { id: 'simulator', label: 'Advice', icon: Sparkles },
    { id: 'goals', label: 'Goals', icon: ShieldCheck },
    { id: 'recurring', label: 'Estate planning', icon: RotateCw },
  ];

  const regionOptions = REGIONS.map(r => ({
    id: r.code,
    label: r.name,
    sublabel: `${r.currency} (${r.symbol})`,
    icon: r.flag,
    badge: r.symbol
  }));

  const personaOptions = [
    { id: 'salaried', label: 'Rahul Sharma', sublabel: 'Salaried Tech Lead (BLR)', icon: '👨‍💼', badge: 'BLR' },
    { id: 'freelancer', label: 'Priya Patel', sublabel: 'Freelance Designer (BOM)', icon: '👩‍🎨', badge: 'BOM' },
    { id: 'student', label: 'Aarav Mehta', sublabel: 'Student & Intern (DEL)', icon: '🎓', badge: 'DEL' },
  ];

  return (
    <header className="h-16 bg-white border-b border-black/[0.05] px-4 sm:px-6 lg:px-8 flex items-center justify-between select-none z-30 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      
      {/* Left: Mint circular logo from image.png */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="w-9 h-9 rounded-full bg-[#5EEAD4] flex items-center justify-center text-[#065F46] font-extrabold cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm"
          title="Fintrixity Portfolio"
        >
          <span className="text-sm">✦</span>
        </div>
      </div>

      {/* Center Navigation Tabs from image.png */}
      <nav className="hidden md:flex items-center gap-1 sm:gap-4 lg:gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative py-5 px-1 text-xs font-semibold flex items-center gap-2 transition-colors duration-150 ${
                isActive 
                  ? 'text-zinc-900 font-bold' 
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-900 stroke-[2.2]' : 'text-zinc-400'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-full animate-dropdown"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls from image.png */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Persona Custom Glass Dropdown */}
        <div className="hidden lg:block">
          <CustomDropdown 
            options={personaOptions}
            value={activePersona}
            onChange={(val) => onPersonaChange && onPersonaChange(val)}
            placeholder="Select Persona"
            align="right"
          />
        </div>

        {/* Region & Currency Custom Glass Dropdown */}
        <CustomDropdown 
          options={regionOptions}
          value={activeRegion}
          onChange={(val) => onRegionChange && onRegionChange(val)}
          placeholder="Region"
          align="right"
        />

        {/* Black Pill: Get $25 (or ₹2,000) from image.png */}
        <button 
          onClick={() => setActiveTab('simulator')}
          className="hidden sm:flex items-center gap-1.5 bg-[#18191E] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all btn-interactive"
        >
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span>Get {currentRegion.symbol}{currentRegion.code === 'IN' ? '2,000' : '25'}</span>
        </button>

        {/* White Pill: + Account from image.png */}
        <button 
          onClick={() => setActiveTab('transactions')}
          className="hidden sm:flex items-center gap-1 bg-white hover:bg-zinc-50 border border-black/[0.08] text-zinc-800 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all btn-interactive"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Account</span>
        </button>

        {/* Circular Notification Bell */}
        <button 
          onClick={() => setActiveTab('recurring')}
          className="w-9 h-9 rounded-full bg-white hover:bg-zinc-50 border border-black/[0.08] flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all btn-interactive"
          title="Notifications & Holding Updates"
        >
          <Bell className="w-3.5 h-3.5" />
        </button>

        {/* User Profile Avatar with Online Dot from image.png */}
        <div 
          onClick={onLogout}
          className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-white shadow-sm flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all"
          title="Click to Sign Out"
        >
          <span>{activePersona === 'salaried' ? 'RS' : activePersona === 'freelancer' ? 'PP' : 'AM'}</span>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </div>

      </div>

    </header>
  );
}
