import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function PiggyBankAnimation() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden select-none">
      
      {/* Ambient Radial Backdrop Glow */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#00E5FF]/20 via-[#3B82F6]/15 to-[#10B981]/20 blur-3xl pointer-events-none animate-pulse"></div>

      {/* Floating Card 1: Top Right SIP badge */}
      <div className="absolute top-12 right-8 bg-white/90 backdrop-blur-md border border-black/[0.06] rounded-2xl p-3 shadow-lg flex items-center gap-2.5 animate-bounce-subtle z-20">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-zinc-500 font-medium">Monthly Auto-SIP</div>
          <div className="text-xs font-bold text-zinc-900 font-mono">+₹25,000 / month</div>
        </div>
      </div>

      {/* Floating Card 2: Bottom Left Solvency badge */}
      <div className="absolute bottom-12 left-8 bg-white/90 backdrop-blur-md border border-black/[0.06] rounded-2xl p-3 shadow-lg flex items-center gap-2.5 animate-bounce-delayed z-20">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-zinc-500 font-medium">Solvency Safety</div>
          <div className="text-xs font-bold text-emerald-600 font-mono">98/100 Verified</div>
        </div>
      </div>

      {/* Main Piggy Bank & Dropping Coin Stage */}
      <div className="relative w-72 h-72 flex items-center justify-center z-10">

        {/* Dropping Golden Indian Rupee Coin Animation */}
        <div className="absolute top-0 z-20 animate-coin-drop flex flex-col items-center">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE082] via-[#FFD54F] to-[#FFA000] border-2 border-[#FFECB3] shadow-[0_4px_16px_rgba(255,160,0,0.5)] flex items-center justify-center animate-coin-spin">
            <span className="font-extrabold text-[#5D4037] text-lg font-mono">₹</span>
            {/* Coin shine reflection */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Particle Sparkles at Coin Slot Entrance */}
        <div className="absolute top-[82px] z-30 pointer-events-none">
          <span className="absolute -left-6 -top-2 w-2 h-2 rounded-full bg-[#FFD54F] shadow-sm animate-sparkle-1"></span>
          <span className="absolute left-6 -top-2 w-2 h-2 rounded-full bg-[#00E5FF] shadow-sm animate-sparkle-2"></span>
          <span className="absolute -top-6 left-0 w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm animate-sparkle-3"></span>
        </div>

        {/* Piggy Bank SVG with Squash & Bounce Effect */}
        <div className="w-64 h-64 animate-piggy-bounce">
          <svg viewBox="0 0 240 200" className="w-full h-full drop-shadow-2xl overflow-visible">
            <defs>
              <linearGradient id="piggyBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFA4B6" />
                <stop offset="60%" stopColor="#FF7597" />
                <stop offset="100%" stopColor="#F06292" />
              </linearGradient>

              <linearGradient id="piggyBelly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD1DC" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF8DA1" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="piggyEar" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5C8A" />
                <stop offset="100%" stopColor="#D81B60" />
              </linearGradient>

              <radialGradient id="piggyHighlight" cx="30%" cy="25%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Piggy Tail */}
            <path
              d="M 40 120 C 25 110, 15 130, 28 135 C 36 138, 30 115, 42 122"
              fill="none"
              stroke="#E91E63"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Back Legs */}
            <rect x="65" y="145" width="22" height="30" rx="9" fill="#E91E63" />
            <rect x="155" y="145" width="22" height="30" rx="9" fill="#E91E63" />

            {/* Main Piggy Body */}
            <ellipse cx="120" cy="120" rx="75" ry="60" fill="url(#piggyBody)" />
            
            {/* Shiny Top Highlight */}
            <ellipse cx="120" cy="120" rx="75" ry="60" fill="url(#piggyHighlight)" />

            {/* Belly Soft Area */}
            <ellipse cx="118" cy="135" rx="50" ry="35" fill="url(#piggyBelly)" />

            {/* Front Legs */}
            <rect x="80" y="152" width="22" height="28" rx="9" fill="#FF5C8A" />
            <rect x="140" y="152" width="22" height="28" rx="9" fill="#FF5C8A" />

            {/* Coin Slot on Top */}
            <rect x="105" y="60" width="30" height="6" rx="3" fill="#880E4F" />

            {/* Left Ear */}
            <path
              d="M 152 75 L 175 42 Q 185 58 178 80 Z"
              fill="url(#piggyEar)"
            />

            {/* Eye with Cheerful Sparkle */}
            <circle cx="172" cy="108" r="5" fill="#2E1C2B" />
            <circle cx="174" cy="106" r="1.8" fill="#FFFFFF" />

            {/* Cute Rosy Cheek */}
            <ellipse cx="165" cy="124" rx="9" ry="6" fill="#FF1744" fillOpacity="0.25" />

            {/* Snout */}
            <ellipse cx="192" cy="118" rx="18" ry="14" fill="#FF5C8A" stroke="#E91E63" strokeWidth="1.5" />
            {/* Nostrils */}
            <ellipse cx="188" cy="118" rx="2.5" ry="4" fill="#880E4F" />
            <ellipse cx="196" cy="118" rx="2.5" ry="4" fill="#880E4F" />
          </svg>
        </div>

        {/* Soft Ground Shadow */}
        <div className="absolute bottom-4 w-48 h-6 bg-zinc-400/25 blur-md rounded-full -z-10 animate-shadow-scale"></div>
      </div>

      {/* Captions Below Stage */}
      <div className="text-center mt-6 z-10">
        <h4 className="text-base font-bold text-zinc-900 tracking-tight flex items-center justify-center gap-1.5">
          <span>Smart Automated Wealth Engine</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </h4>
        <p className="text-xs text-zinc-500 max-w-xs mt-1">
          Every rupee intelligently budgeted with local zero-knowledge privacy and real-time cash flow protection.
        </p>
      </div>

    </div>
  );
}
