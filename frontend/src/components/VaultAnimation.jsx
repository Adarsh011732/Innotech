import React from 'react';
import { ShieldCheck, TrendingUp, Sparkles, Lock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function VaultAnimation({ selectedCountry = 'IN' }) {
  const currencySymbol = selectedCountry === 'IN' ? '₹' : selectedCountry === 'GB' ? '£' : selectedCountry === 'EU' ? '€' : '$';
  const sampleAmount = selectedCountry === 'IN' ? '₹45,200' : '$2,450';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden select-none bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D] text-white">
      
      {/* Background Animated Ambient Glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#38BDF8]/20 via-[#818CF8]/25 to-[#34D399]/20 blur-[110px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/4 -right-10 w-72 h-72 rounded-full bg-blue-500/15 blur-[90px] pointer-events-none"></div>

      {/* Floating Glass Widget 1: Top Right Yield / Inflow */}
      <div className="absolute top-10 right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 animate-bounce-subtle z-30">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold shadow-md">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-zinc-300 font-medium">Automatic Inflow</div>
          <div className="text-xs font-bold text-white font-mono flex items-center gap-1">
            <span>+{sampleAmount}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-sans">99% CQR</span>
          </div>
        </div>
      </div>

      {/* Floating Glass Widget 2: Bottom Left Security Badge */}
      <div className="absolute bottom-12 left-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 animate-bounce-delayed z-30">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-zinc-300 font-medium">Zero-Knowledge Vault</div>
          <div className="text-xs font-bold text-teal-300 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>256-Bit Local Client</span>
          </div>
        </div>
      </div>

      {/* Center 3D Glass Vault & Floating Gold Coin Stage */}
      <div className="relative w-80 h-80 flex items-center justify-center z-20">

        {/* Dropping Golden 3D Coin with Glow & Spin */}
        <div className="absolute top-2 z-30 animate-coin-drop flex flex-col items-center">
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#FFE57F] via-[#FFD54F] to-[#FF8F00] p-1 shadow-[0_0_35px_rgba(255,193,7,0.7)] animate-coin-spin flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-[#FFF8E1] bg-gradient-to-tr from-[#FFA000] to-[#FFD54F] flex items-center justify-center shadow-inner">
              <span className="font-extrabold text-amber-950 text-xl font-mono drop-shadow-sm">
                {currencySymbol}
              </span>
            </div>
            {/* Glossy Reflection Bar */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/40 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Coin Deposit Entrance Ripple Particles */}
        <div className="absolute top-[96px] z-30 pointer-events-none flex items-center justify-center">
          <div className="w-20 h-3 rounded-full bg-[#38BDF8]/40 blur-sm animate-pulse"></div>
          <span className="absolute -left-7 -top-3 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md animate-sparkle-1"></span>
          <span className="absolute left-7 -top-3 w-2.5 h-2.5 rounded-full bg-teal-300 shadow-md animate-sparkle-2"></span>
          <span className="absolute -top-6 left-0 w-3 h-3 rounded-full bg-emerald-400 shadow-md animate-sparkle-3"></span>
        </div>

        {/* 3D Isometric Glass Vault Structure */}
        <div className="relative w-64 h-64 flex items-center justify-center animate-piggy-bounce">
          <svg viewBox="0 0 260 260" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-visible">
            <defs>
              <linearGradient id="vaultGlass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#818CF8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.6" />
              </linearGradient>

              <linearGradient id="vaultRim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#64748B" stopOpacity="0.3" />
              </linearGradient>

              <linearGradient id="vaultDoor" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
              </linearGradient>

              <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#0284C7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Outer Geometric Glass Cube / Safe Body */}
            <rect 
              x="30" y="45" width="200" height="185" rx="36" 
              fill="url(#vaultGlass)" 
              stroke="url(#vaultRim)" 
              strokeWidth="2.5" 
              backdropFilter="blur(20px)"
            />

            {/* Glowing Coin Slot on Top */}
            <rect x="95" y="45" width="70" height="10" rx="5" fill="#0B1329" stroke="#38BDF8" strokeWidth="2" />
            <ellipse cx="130" cy="50" rx="25" ry="3.5" fill="url(#portalGlow)" />

            {/* Inner Circular Vault Door */}
            <circle cx="130" cy="140" r="62" fill="url(#vaultDoor)" stroke="url(#vaultRim)" strokeWidth="2" />
            <circle cx="130" cy="140" r="50" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
            <circle cx="130" cy="140" r="38" fill="#1E293B" stroke="#64748B" strokeWidth="1" />

            {/* Central Dial & Lock Icon */}
            <circle cx="130" cy="140" r="22" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="130" cy="140" r="8" fill="#38BDF8" opacity="0.8" />

            {/* Spoke Handles */}
            <line x1="130" y1="114" x2="130" y2="166" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
            <line x1="104" y1="140" x2="156" y2="140" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
            <circle cx="130" cy="114" r="3.5" fill="#E2E8F0" />
            <circle cx="130" cy="166" r="3.5" fill="#E2E8F0" />
            <circle cx="104" cy="140" r="3.5" fill="#E2E8F0" />
            <circle cx="156" cy="140" r="3.5" fill="#E2E8F0" />

            {/* Front Glass Reflections */}
            <path 
              d="M 50 65 L 140 65 Q 160 65 170 80 L 195 125 Q 185 110 160 110 L 65 110 Z" 
              fill="#FFFFFF" 
              opacity="0.08" 
            />
          </svg>
        </div>

        {/* Ambient Floor Shadow */}
        <div className="absolute bottom-1 w-52 h-8 bg-[#38BDF8]/15 blur-xl rounded-full -z-10 animate-shadow-scale"></div>
      </div>

      {/* Modern High-End Feature Highlights */}
      <div className="text-center mt-4 z-20 max-w-sm">
        <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <span>Autonomous Wealth Operating System</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
          AI-driven cash flow forecasting, intelligent recurring bill cadences, and probabilistic risk buffers.
        </p>
      </div>

    </div>
  );
}
