import React from 'react';

export const Illustration = () => {
  return (
    <div className="relative w-full max-w-[420px] mx-auto h-[290px] flex items-center justify-center my-4 select-none">
      
      {/* Background Soft Blue Blobs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[360px] h-[220px] bg-[#E0EDFF]/60 rounded-full blur-2xl transform -rotate-6"></div>
      </div>

      {/* Floating Ambient Icons & Bubbles */}
      <div className="absolute top-2 left-6 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#DBEFEF] shadow-sm flex items-center justify-center text-[#2563EB]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="absolute top-10 left-[150px]">
        <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[#DBEFEF] shadow-sm flex items-center justify-center text-[#60A5FA]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>

      <div className="absolute top-6 right-12">
        <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-[#DBEFEF] shadow-sm flex items-center justify-center text-[#2563EB]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div className="absolute top-[100px] right-2">
        <div className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-[#DBEFEF] shadow-sm flex items-center justify-center text-[#93C5FD]">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Main Illustration SVG */}
      <svg viewBox="0 0 460 300" className="w-full h-full relative z-10 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Ground Floor Shadow */}
        <ellipse cx="230" cy="275" rx="190" ry="12" fill="#D0E3FF" opacity="0.6" />

        {/* --- RIGHT: LARGE CLIPBOARD & CHECKLIST --- */}
        <g id="clipboard-group">
          {/* Main Board */}
          <rect x="235" y="45" width="145" height="210" rx="16" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="4.5" />
          
          {/* Top Clip Header */}
          <path d="M280 45V36C280 32.6863 282.686 30 286 30H328C331.314 30 334 32.6863 334 36V45" fill="#1D4ED8" />
          <circle cx="307" cy="37" r="4.5" fill="#FFFFFF" />

          {/* Profile Header on Clipboard */}
          <circle cx="275" cy="80" r="18" fill="#60A5FA" />
          <path d="M266 94C266 89.0294 270.029 85 275 85C279.971 85 284 89.0294 284 94V96H266V94Z" fill="#1E40AF" />
          <circle cx="275" cy="76" r="7" fill="#1E40AF" />
          
          <rect x="303" y="72" width="60" height="6" rx="3" fill="#93C5FD" />
          <rect x="303" y="84" width="42" height="5" rx="2.5" fill="#CBD5E1" />

          {/* Checklist Item 1 */}
          <rect x="255" y="118" width="18" height="18" rx="4" fill="#2563EB" />
          <path d="M259 127L263 131L269 123" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="283" y="123" width="75" height="6" rx="3" fill="#E2E8F0" />

          {/* Checklist Item 2 */}
          <rect x="255" y="148" width="18" height="18" rx="4" fill="#2563EB" />
          <path d="M259 157L263 161L269 153" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="283" y="153" width="65" height="6" rx="3" fill="#E2E8F0" />

          {/* Checklist Item 3 */}
          <rect x="255" y="178" width="18" height="18" rx="4" fill="#2563EB" />
          <path d="M259 187L263 191L269 183" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="283" y="183" width="55" height="6" rx="3" fill="#E2E8F0" />
        </g>

        {/* --- FRONT RIGHT: BRIEFCASE --- */}
        <g id="front-briefcase">
          <rect x="305" y="210" width="85" height="58" rx="10" fill="#0B192C" />
          <path d="M333 210V201C333 198.791 334.791 197 337 197H358C360.209 197 362 198.791 362 201V210" stroke="#0B192C" strokeWidth="5.5" strokeLinecap="round" />
          <rect x="337" y="235" width="20" height="12" rx="3" fill="#FFFFFF" />
          <path d="M305 230H390" stroke="#1E293B" strokeWidth="2.5" />
        </g>

        {/* --- LEFT: STACKED BOOKS --- */}
        <g id="stacked-books">
          {/* Bottom Blue Book */}
          <rect x="68" y="238" width="115" height="18" rx="4" fill="#1D4ED8" />
          <rect x="68" y="238" width="16" height="18" fill="#1E40AF" rx="3" />
          <rect x="88" y="244" width="88" height="5" fill="#FFFFFF" opacity="0.9" />

          {/* Middle Sky Blue Book */}
          <rect x="74" y="218" width="105" height="18" rx="4" fill="#3B82F6" />
          <rect x="74" y="218" width="15" height="18" fill="#2563EB" rx="3" />
          <rect x="92" y="224" width="82" height="5" fill="#FFFFFF" opacity="0.9" />

          {/* Top Yellow Book */}
          <rect x="82" y="198" width="95" height="18" rx="4" fill="#F59E0B" />
          <rect x="82" y="198" width="14" height="18" fill="#D97706" rx="3" />
          <rect x="99" y="204" width="73" height="5" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* --- LEFT: STUDENT CHARACTER --- */}
        <g id="student-character">
          {/* Hair back */}
          <path d="M142 134C140 120 152 110 166 112C178 114 186 126 182 138" fill="#0F172A" />

          {/* Legs & Pants */}
          <path d="M125 198L160 198L175 250L150 252Z" fill="#0F172A" /> {/* Thigh */}
          <path d="M152 245L208 245L222 258L152 258Z" fill="#0F172A" /> {/* Calves */}
          
          {/* Shoes */}
          <path d="M208 245H226C229.314 245 232 247.686 232 251V257H204V249C204 246.791 205.791 245 208 245Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <path d="M172 250H190C193.314 250 196 252.686 196 256V259H168V254C168 251.791 169.791 250 172 250Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />

          {/* Torso & Blue Sweater */}
          <path d="M120 156C120 148 128 142 142 142H168C176 142 182 148 180 156L172 200H125L120 156Z" fill="#2563EB" />
          
          {/* White Shirt Collar */}
          <path d="M146 142L152 152L158 142" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Head & Face */}
          <circle cx="162" cy="132" r="14" fill="#FDBA74" />
          <path d="M152 125C152 118 158 114 167 114C176 114 180 120 178 126C174 126 170 122 165 125" fill="#0F172A" />
          
          {/* Smile & Nose */}
          <circle cx="169" cy="132" r="1.8" fill="#0F172A" />
          <path d="M167 137C169 139 172 139 173 137" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />

          {/* Arms & Hands holding laptop */}
          <path d="M136 156L158 178L182 170" stroke="#2563EB" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="182" cy="170" r="5" fill="#FDBA74" />

          {/* Laptop */}
          <g id="laptop">
            <path d="M156 182L212 178" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            <path d="M165 178L160 138C159.5 135 162 133 165 133H210C213 133 215.5 135 215 138L210 178Z" fill="#0F172A" />
            <rect x="168" y="138" width="40" height="34" rx="2" fill="#1E293B" />
            <circle cx="188" cy="155" r="3" fill="#60A5FA" />
          </g>
        </g>

      </svg>
    </div>
  );
};
