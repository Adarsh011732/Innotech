import React, { useState } from 'react';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  Globe, 
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
  const [email, setEmail] = useState('demo@fintrixity.io');
  const [password, setPassword] = useState('admin123');
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F8F6] border border-[#12B8AC]/20 flex items-center justify-center text-[#12B8AC] shadow-sm">
                <span className="text-base font-extrabold">✦</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-zinc-900 tracking-tight">Fintrixity</span>
                <span className="block text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">Financial Intelligence</span>
              </div>
            </div>

            {/* Welcome Heading */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
                Log in to access your financial portfolio and live accounts.
              </p>
            </div>

            {/* Sample Credentials for 1-Click Access */}
            <div className="mb-5 bg-[#F8F9FC] border border-zinc-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 rounded-md font-mono">Demo</span>
                <div className="text-xs">
                  <span className="font-mono font-bold text-zinc-800">demo@fintrixity.io</span>
                  <span className="text-zinc-400 mx-1.5">•</span>
                  <span className="font-mono text-zinc-500">admin123</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@fintrixity.io');
                  setPassword('admin123');
                }}
                className="text-[11px] font-bold text-[#0F8C82] hover:text-teal-700 hover:underline"
              >
                Auto-fill
              </button>
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

        </div>

        {/* Right Half: Dark Navy Visual Panel (#151F32) with Dot-Grid Animation */}
        <div className="lg:col-span-6 bg-[#151F32] relative flex items-center justify-center p-6 sm:p-10 overflow-hidden select-none min-h-[380px]">
          <div className="relative w-full h-full flex items-center justify-center">
            <DotGridAnimation activeCurrencySymbol={activeRegionObj.symbol} />
          </div>
        </div>

      </div>

    </div>
  );
}
