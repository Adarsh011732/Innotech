import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Globe,
  Sparkles, 
  CheckCircle, 
  ChevronDown
} from 'lucide-react';
import VaultAnimation from './VaultAnimation';
import BlurText from './reactbits/BlurText';
import ShinyText from './reactbits/ShinyText';
import CustomDropdown from './CustomDropdown';

export const REGIONS = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: 'EUR', symbol: '€' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', symbol: 'S$' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ' },
];

export default function LoginPage({ onLogin, activeRegion = 'IN' }) {
  const [selectedCountry, setSelectedCountry] = useState(activeRegion);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const activeRegionObj = REGIONS.find(r => r.code === selectedCountry) || REGIONS[0];

  const handleSubmit = (e) => {
    e?.preventDefault();
    onLogin(activeRegionObj.code, activeRegionObj.currency);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-tr from-[#E3F2FD] via-[#F1F5F9] to-[#EDE9FE] p-4 sm:p-6 lg:p-10 font-sans select-none">
      
      {/* Outer Device-Quality Split-Screen Container */}
      <div className="w-full max-w-5xl bg-white rounded-[32px] border border-black/[0.06] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Half: Clean Credentials Form (6 cols on lg) */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-white">
          
          <div>
            {/* Top Brand Mark */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 shadow-sm">
                  <span className="text-teal-600 text-base font-bold">✦</span>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-zinc-900 tracking-tight">Fintrixity</span>
                  <span className="block text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">Financial Intelligence</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Encrypted</span>
              </div>
            </div>

            {/* Welcome Heading with React Bits BlurText */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                <BlurText text="Welcome back" delay={60} blur={5} className="text-zinc-900 font-extrabold" />
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
                Log in to your local-first zero-knowledge financial portfolio.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Region / Country Selector Dropdown (Automatically determines Currency!) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Select Your Region / Country</span>
                  </span>
                  <span className="text-[11px] font-mono text-teal-600 font-semibold">
                    Currency: {activeRegionObj.symbol} {activeRegionObj.currency}
                  </span>
                </label>
                
                <CustomDropdown 
                  options={REGIONS.map(r => ({
                    id: r.code,
                    label: r.name,
                    sublabel: `${r.currency} (${r.symbol})`,
                    icon: r.flag,
                    badge: r.symbol
                  }))}
                  value={selectedCountry}
                  onChange={(val) => setSelectedCountry(val)}
                  placeholder="Select Region"
                  className="w-full"
                  buttonClassName="w-full justify-between py-2.5 px-4 bg-[#FAFBFD] border-zinc-200 rounded-2xl text-xs"
                  menuClassName="w-full left-0 right-0"
                  align="left"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#FAFBFD] border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Password
                  </label>
                  <a href="#forgot" className="text-[11px] font-semibold text-teal-600 hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#FAFBFD] border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between text-xs text-zinc-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-300 accent-zinc-900 w-4 h-4 cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-bold py-3.5 px-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all btn-interactive mt-6 group"
              >
                <span>Launch Financial Cockpit</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Privacy Footnote */}
          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Zero-knowledge client storage</span>
            </span>
            <span className="font-mono">v2.4 {activeRegionObj.code}</span>
          </div>

        </div>

        {/* Right Half: Ultra-Modern 3D Vault & Coin Visual (6 cols on lg) */}
        <div className="lg:col-span-6 relative flex items-center justify-center overflow-hidden">
          <VaultAnimation selectedCountry={selectedCountry} />
        </div>

      </div>
    </div>
  );
}
