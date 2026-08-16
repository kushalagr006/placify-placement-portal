import React from 'react';

export const Logo = ({ size = "normal" }) => {
  const isLarge = size === "large";
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Combined Briefcase + Graduation Cap Logo */}
      <div className={`relative flex items-center justify-center ${isLarge ? 'w-24 h-24 mb-4' : 'w-20 h-20 mb-3'}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Briefcase Body */}
          <rect x="22" y="44" width="76" height="52" rx="10" fill="#0F172A" />
          
          {/* Briefcase Handle */}
          <path 
            d="M44 44V34C44 30.6863 46.6863 28 50 28H70C73.3137 28 76 30.6863 76 34V44" 
            stroke="#0F172A" 
            strokeWidth="7" 
            strokeLinecap="round" 
          />
          
          {/* Briefcase Front Latch Detail */}
          <rect x="52" y="66" width="16" height="10" rx="3" fill="#2563EB" />
          <path d="M22 62H98" stroke="#1E293B" strokeWidth="2.5" />

          {/* Graduation Cap Sitting on Top Right / Center of Briefcase */}
          <g transform="translate(48, 16) scale(0.95)">
            {/* Cap Diamond Top */}
            <path d="M24 6L46 16L24 26L2 16L24 6Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1" />
            
            {/* Cap Skull Base */}
            <path d="M10 20.5V28.5C10 32.5 16.268 35.5 24 35.5C31.732 35.5 38 32.5 38 28.5V20.5" fill="#1D4ED8" />
            
            {/* Cap Tassel */}
            <path d="M42 17.5V32" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="42" cy="34" r="2.5" fill="#60A5FA" />
          </g>
        </svg>
      </div>

      {/* Brand Title & Subtitle */}
      <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight text-center">
        Placify
      </h1>
      <p className="text-[#64748B] text-base font-medium mt-1 text-center">
        Your gateway to opportunities
      </p>
    </div>
  );
};
