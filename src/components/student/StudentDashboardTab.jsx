import React from 'react';
import { 
  Sparkles, 
  Briefcase, 
  FileText, 
  Bell, 
  ArrowUpRight, 
  CheckCircle2, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const StudentDashboardTab = ({ onNavigateToBrowse, onApplyJob }) => {
  const { currentUser, studentProfile, jobs, myApplications, announcements } = usePortal();
  const latestJobs = jobs.slice(0, 4);

  const studentName = studentProfile?.user?.name || currentUser?.email?.split('@')[0] || 'Student';
  const branch = studentProfile?.branch || 'General';
  const cgpa = studentProfile?.cgpa ? `${studentProfile.cgpa} / 10.0` : 'Not Set';

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME MESSAGE BANNER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm mb-3 border border-white/20">
              <Sparkles size={14} className="text-yellow-300" />
              <span>Placement Season Live</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {studentName}!
            </h2>

            <p className="text-blue-100 text-sm mt-1.5 font-medium leading-relaxed max-w-xl">
              Verified Student • {branch} • Verified CGPA: <strong className="text-white">{cgpa}</strong>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center self-start sm:self-center flex-shrink-0">
            <span className="text-white/80 text-[10px] font-bold uppercase block">Academic Status</span>
            <span className="text-white font-extrabold text-lg">Eligible</span>
          </div>
        </div>
      </div>

      {/* METRICS & NOTIFICATIONS TOP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Applied Jobs Count Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Applied Jobs Count
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
            </div>

            <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              {myApplications.length} Applications
            </p>
            <p className="text-xs font-semibold text-emerald-600 mt-2">
              ✓ Active application pipeline
            </p>
          </div>

          <button
            onClick={() => onNavigateToBrowse('my_applications')}
            className="w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold rounded-xl text-xs transition-colors mt-4 flex items-center justify-center gap-1"
          >
            <span>View Application Pipeline</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Notifications & Announcements Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Campus Announcements ({announcements.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Updates</span>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium py-4 text-center">No announcements posted yet.</p>
            ) : (
              announcements.map((notif) => (
                <div key={notif.announcement_id || notif.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                  <Bell size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-xs">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{notif.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 2. AVAILABLE JOBS (3-4 LATEST) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Briefcase size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Latest Available Opportunities</h3>
              <p className="text-xs text-slate-500 font-medium">Fresh campus drives matching your profile</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToBrowse('browse_jobs')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Browse All Jobs</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestJobs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 col-span-2 text-center">No active job postings available.</p>
          ) : (
            latestJobs.map((job) => {
              const companyName = job.company?.company_name || job.company || 'Company';
              const logoText = companyName.substring(0, 2).toUpperCase();

              return (
                <div
                  key={job.job_id || job.id}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-sm bg-indigo-600"
                        >
                          {logoText}
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{companyName}</span>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{job.title}</h4>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                        {job.status || 'Active'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl mb-3 flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>💰 {job.package || 'Competitive'}</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin size={12} /> {job.location || 'Remote'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] font-medium">Deadline: {job.deadline}</span>
                    <button
                      onClick={() => onApplyJob(job)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
