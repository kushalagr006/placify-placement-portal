import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';

export const CompanyBanner = ({ onOpenPostJob }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm mb-3 border border-white/20">
            <Sparkles size={14} className="text-yellow-300" />
            <span>Verified Employer Dashboard • Razorpay Inc.</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Razorpay Hiring Team!
          </h2>

          <p className="text-blue-100 text-sm mt-1.5 font-medium leading-relaxed max-w-2xl">
            Manage your company job postings, view student applications, and shortlist top talent for your recruitment drives.
          </p>
        </div>

        <button
          onClick={onOpenPostJob}
          className="px-4 py-3 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center gap-2 flex-shrink-0 self-start sm:self-center"
        >
          <PlusCircle size={16} />
          <span>Post New Opening</span>
        </button>
      </div>

    </div>
  );
};
