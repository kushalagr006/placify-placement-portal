import React from 'react';
import { Briefcase, Users, PlusCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const CompanyDashboardTab = ({ onNavigateToTab }) => {
  const { jobs, myApplications, companyProfile, currentUser } = usePortal();
  const totalJobsCount = jobs.length;
  const totalApplicationsCount = myApplications.length;

  const companyName = companyProfile?.company_name || 'Employer';
  const hrName = companyProfile?.hr_name || currentUser?.email?.split('@')[0] || 'Recruiter';

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm mb-3 border border-white/20">
              <Sparkles size={14} className="text-yellow-300" />
              <span>Employer Workspace • {companyName}</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Employer Dashboard
            </h2>

            <p className="text-blue-100 text-sm mt-1.5 font-medium leading-relaxed max-w-xl">
              Welcome back, {hrName}! Review your company's campus recruitment drives and student applications.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('post_job')}
            className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center gap-2 flex-shrink-0 self-start sm:self-center"
          >
            <PlusCircle size={16} />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* 2 SUMMARY METRIC CARDS ONLY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* 1. Total Jobs Posted Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Jobs Posted
            </span>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Briefcase size={22} />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              {totalJobsCount} Jobs
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-2">
              Active Campus Postings
            </p>
          </div>
        </div>

        {/* 2. Total Applications Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Applications Received
            </span>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Users size={22} />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              {totalApplicationsCount} Applications
            </p>
            <p className="text-xs font-semibold text-emerald-600 mt-2">
              ✓ Live Candidate Submissions
            </p>
          </div>
        </div>

      </div>

      {/* Posted Jobs Overview Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base">Active Posted Jobs</h3>
          <button
            onClick={() => onNavigateToTab('post_job')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>+ Create Job Posting</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 col-span-2 text-center">No jobs created yet.</p>
          ) : (
            jobs.slice(0, 4).map((job) => (
              <div
                key={job.job_id || job.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      job.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : job.status === 'Rejected by TPO'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {job.status === 'Active' ? '✓ Approved' : job.status === 'Rejected by TPO' ? '✕ Rejected' : '⏳ Pending TPO'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">📍 {job.location || 'Remote'} • Package: {job.package || 'Competitive'}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-600 font-bold">
                    {job.status === 'Active' ? 'Live Drive' : 'Awaiting TPO Approval'}
                  </span>
                  <button
                    onClick={() => onNavigateToTab('applications')}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Review Candidates →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
