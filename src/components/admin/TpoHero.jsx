import React from 'react';
import { 
  Building2, 
  PlusCircle, 
  Megaphone, 
  BarChart3, 
  Sparkles
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoHero = ({ 
  onAddCompany, 
  onCreateDrive, 
  onPublishAnnouncement, 
  onGenerateReport 
}) => {
  const { currentUser } = usePortal();

  const adminName = currentUser?.name || currentUser?.email?.split('@')[0] || 'TPO Admin';

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
      
      {/* Background Decorative Circles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 right-48 w-48 h-48 bg-purple-500/20 rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Text Area */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/20">
            <Sparkles size={14} className="text-yellow-300" />
            <span>Campus Placement Portal • Season Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {adminName}!
          </h2>

          <p className="text-blue-100 text-sm mt-1.5 leading-relaxed font-medium">
            Monitor campus placements, internships, and recruitment drives in real-time.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onAddCompany}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <Building2 size={15} />
            <span>Add Company</span>
          </button>

          <button
            onClick={onCreateDrive}
            className="px-3.5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <PlusCircle size={15} />
            <span>Create Drive</span>
          </button>

          <button
            onClick={onPublishAnnouncement}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <Megaphone size={15} />
            <span>Announcement</span>
          </button>

          <button
            onClick={onGenerateReport}
            className="px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <BarChart3 size={15} />
            <span>Generate Report</span>
          </button>
        </div>

      </div>

    </div>
  );
};
