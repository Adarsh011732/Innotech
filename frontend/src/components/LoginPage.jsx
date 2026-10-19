import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Globe, 
  CheckCircle2, 
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import DotGridAnimation from './DotGridAnimation';
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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const activeRegionObj = REGIONS.find(r => r.code === selectedCountry) || REGIONS[0];
  const sampleAmount = activeRegionObj.code === 'IN' ? '₹45,200' : '$2,450';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(activeRegionObj.code, activeRegionObj.currency);
    }, 450);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#F3F6FA] relative overflow-hidden p-3 sm:p-6 lg:p-10 font-sans select-none">
      
      {/* Subtle faint cyan ambient radial glow */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 32%, rgba(18, 184, 172, 0.05) 0%, rgba(243, 246, 250, 0) 65%)'
        }}
      />

      {/* Main Two-Column Login Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] border border-black/[0.06] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* Left Half: Clean Authentication Panel (6 cols on lg) */}
        <div className="lg:col-span-6 p-7 sm:p-11 lg:p-12 flex flex-col justify-between bg-white z-10">
          
          <div>
            {/* Top Brand Mark */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F8F6] border border-[#12B8AC]/20 flex items-center justify-center text-[#12B8AC] shadow-sm">
                  <span className="text-base font-extrabold">✦</span>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-zinc-900 tracking-tight">Fintrixity</span>
                  <span className="block text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">Financial Intelligence</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F8F6] border border-[#12B8AC]/20 text-[#0F8C82] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#12B8AC] animate-pulse"></span>
                <span>Encrypted</span>
              </div>
            </div>

            {/* Welcome Heading */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
                Log in to your local-first zero-knowledge financial portfolio.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Region / Country Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Operating Currency Region</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#12B8AC] font-bold">
                    {activeRegionObj.symbol} {activeRegionObj.currency}
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
                  buttonClassName="w-full justify-between py-2.5 px-4 bg-[#FAFBFD] border-zinc-200 hover:border-zinc-300 rounded-xl text-xs h-11"
                  menuClassName="w-full left-0 right-0"
                  align="left"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="name@institution.com"
                    className={`w-full bg-[#FAFBFD] border rounded-xl h-11 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white transition-all font-medium ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-zinc-200 hover:border-zinc-300 focus:border-[#12B8AC] focus:ring-2 focus:ring-[#12B8AC]/15'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Password
                  </label>
                  <a 
                    href="#forgot" 
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password recovery: Recovery instructions are sent to your verified offline enclave address.');
                    }}
                    className="text-[11px] font-semibold text-[#12B8AC] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="••••••••••••"
                    className={`w-full bg-[#FAFBFD] border rounded-xl h-11 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white transition-all font-medium ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-zinc-200 hover:border-zinc-300 focus:border-[#12B8AC] focus:ring-2 focus:ring-[#12B8AC]/15'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember device checkbox */}
              <div className="flex items-center justify-between text-xs text-zinc-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-300 text-[#12B8AC] accent-[#12B8AC] w-4 h-4 cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#17181C] hover:bg-black text-white text-xs font-bold h-12 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all btn-interactive mt-6 group disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#12B8AC]" />
                    <span>Authenticating Enclave...</span>
                  </>
                ) : (
                  <>
                    <span>Launch Financial Cockpit</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Privacy Footnote */}
          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#12B8AC]" />
              <span>Zero-knowledge client storage</span>
            </span>
            <span className="font-mono">v2.6 {activeRegionObj.code}</span>
          </div>

        </div>

        {/* Right Half: Dark Navy Visual Panel (#151F32) with Dot-Grid Animation */}
        <div className="lg:col-span-6 bg-[#151F32] relative flex flex-col justify-between p-7 sm:p-10 lg:p-12 overflow-hidden select-none">
          
          {/* Top-Right Badge: Automatic Inflow */}
          <div className="flex justify-end z-20">
            <div className="bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#12B8AC] to-[#35D9C5] text-white flex items-center justify-center font-bold shadow-md">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-zinc-300 font-medium">Automatic Inflow</div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <span>+{sampleAmount}</span>
                  <span className="text-[9px] text-[#35D9C5] bg-[#35D9C5]/15 px-1.5 py-0.5 rounded font-sans font-bold">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Stage: Dot-Matrix Typography Canvas Animation */}
          <div className="relative w-full flex-1 flex items-center justify-center my-4 z-10 min-h-[300px]">
            <DotGridAnimation activeCurrencySymbol={activeRegionObj.symbol} />
          </div>

          {/* Bottom Security Info & Badge */}
          <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-4 border-t border-white/[0.08]">
            
            {/* Zero-Knowledge Vault Badge */}
            <div className="bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-zinc-300 font-medium">Zero-Knowledge Vault</div>
                <div className="text-xs font-bold text-[#35D9C5] font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#35D9C5]" />
                  <span>256-Bit Local Enclave</span>
                </div>
              </div>
            </div>

            {/* Descriptive Text beneath animation */}
            <div className="text-right sm:max-w-[210px]">
              <div className="text-xs font-bold text-white tracking-tight">
                Institutional Asset Security
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                Client-side encrypted zero-knowledge ledger. Your sovereign credentials never leave this device.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
