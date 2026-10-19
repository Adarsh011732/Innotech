import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle, 
  MapPin, 
  Briefcase, 
  User,
  Globe
} from 'lucide-react';
import PiggyBankAnimation from './PiggyBankAnimation';
import { INDIAN_PERSONAS } from '../utils/currency';

export default function LoginPage({ onLogin, activeCurrency, onCurrencyChange }) {
  const [email, setEmail] = useState('rahul.sharma@fintrixity.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedPersona, setSelectedPersona] = useState('salaried');

  const handlePersonaSelect = (personaKey) => {
    setSelectedPersona(personaKey);
    const p = INDIAN_PERSONAS[personaKey];
    if (p) {
      setEmail(`${p.id}@fintrixity.in`);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onLogin(selectedPersona, activeCurrency);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#F4F6FA] p-4 sm:p-6 lg:p-10 font-sans select-none">
      
      {/* Outer Sleek Container (Split 2-Column Canvas) */}
      <div className="w-full max-w-6xl bg-white rounded-3xl border border-black/[0.06] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* Left Half: Login Credentials Form (7 cols on lg) */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          
          {/* Top Logo & Region Switcher */}
          <div>
            <div className="flex items-center justify-between mb-8">
              {/* Mint Flower Badge from image.png */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-teal-600 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-teal-500/80 flex items-center justify-center text-white text-[10px] font-bold">
                    ✦
                  </div>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-zinc-900 tracking-tight">Fintrixity</span>
                  <span className="block text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Financial OS</span>
                </div>
              </div>

              {/* Currency & Region Selector */}
              <div className="flex items-center bg-[#F4F6FA] p-1 rounded-2xl border border-black/[0.05]">
                <button
                  type="button"
                  onClick={() => onCurrencyChange('INR')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCurrency === 'INR'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  🇮🇳 INR (₹)
                </button>
                <button
                  type="button"
                  onClick={() => onCurrencyChange('USD')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCurrency === 'USD'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  🌐 USD ($)
                </button>
              </div>
            </div>

            {/* Welcome Headings */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Zero-knowledge personal financial intelligence tailored for India.
              </p>
            </div>

            {/* Quick 1-Click Persona Login Chips */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-zinc-700 mb-2.5">
                Choose Persona Profile
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.entries(INDIAN_PERSONAS).map(([key, p]) => {
                  const isSelected = selectedPersona === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handlePersonaSelect(key)}
                      className={`p-3 rounded-2xl text-left border transition-all text-xs btn-interactive ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                          : 'border-zinc-200 bg-[#F8F9FC] text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{p.name.split(' ')[0]}</span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-teal-400" />}
                      </div>
                      <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {p.role}
                      </div>
                      <div className={`text-[10px] font-mono font-semibold mt-1 ${isSelected ? 'text-teal-300' : 'text-emerald-600'}`}>
                        {activeCurrency === 'INR' ? `₹${(p.salaryMonthly / 1000).toFixed(0)}k/mo` : `$${(p.salaryMonthly / 83).toFixed(0)}/mo`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Email or User ID
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#F8F9FC] border border-zinc-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-medium"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

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
                    required
                    className="w-full bg-[#F8F9FC] border border-zinc-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-medium"
                    placeholder="••••••••••••"
                  />
                </div>
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
              <span>Zero-knowledge client encrypted</span>
            </span>
            <span>Version 2.4 IN</span>
          </div>

        </div>

        {/* Right Half: Animated Piggy Bank with Coin Drop (6 cols on lg) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#F0F4F8] via-[#E8EDF5] to-[#E0F2FE] border-t lg:border-t-0 lg:border-l border-black/[0.06] relative flex items-center justify-center overflow-hidden">
          <PiggyBankAnimation />
        </div>

      </div>
    </div>
  );
}
