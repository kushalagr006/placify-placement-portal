import React from 'react';
import { Users, Building2, Briefcase, FileText, Sparkles, ArrowUpRight, UserCheck, Clock } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoDashboardTab = ({ onNavigateToTab }) => {
  const { students, companies, jobs, announcements, myApplications } = usePortal();

  const pendingSelections = (myApplications || []).filter(
    (app) => app.status === 'Pending TPO Approval' || app.status === 'Pending TPO Selection Approval'
  );

  const metricsData = [
    {
      id: 1,
      label: 'Registered Students',
      value: students.length,
      sub: 'Verified Student Accounts',
      icon: Users,
      colorBg: 'bg-blue-50',
      colorText: 'text-blue-600',
    },
    {
      id: 2,
      label: 'Partner Companies',
      value: companies.length,
      sub: 'Registered Employers',
      icon: Building2,
      colorBg: 'bg-indigo-50',
      colorText: 'text-indigo-600',
    },
    {
      id: 3,
      label: 'Active Job Drives',
      value: jobs.length,
      sub: 'Live Openings',
      icon: Briefcase,
      colorBg: 'bg-amber-50',
      colorText: 'text-amber-600',
    },
    {
      id: 4,
      label: 'Pending Candidate Approvals',
      value: pendingSelections.length,
      sub: 'Recruiter Selections Awaiting TPO',
      icon: UserCheck,
      colorBg: pendingSelections.length > 0 ? 'bg-amber-100' : 'bg-purple-50',
      colorText: pendingSelections.length > 0 ? 'text-amber-700 font-extrabold' : 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm mb-3 border border-white/20">
              <Sparkles size={14} className="text-yellow-300" />
              <span>Campus Placement Season</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Admin Officer!
            </h2>

            <p className="text-blue-100 text-sm mt-1.5 font-medium leading-relaxed max-w-xl">
              Monitor overall student registrations, approved partner companies, live campus drives, and candidate applications.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center self-start sm:self-center flex-shrink-0">
            <span className="text-white/80 text-[10px] font-bold uppercase block">Placement Season</span>
            <span className="text-white font-extrabold text-lg">Active Portal</span>
          </div>
        </div>
      </div>

      {/* Subtle Pending Selections Alert */}
      {pendingSelections.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {pendingSelections.length} Candidate Selection{pendingSelections.length > 1 ? 's' : ''} Awaiting Review
              </h4>
              <p className="text-slate-600 text-xs mt-0.5">
                Recruiters have submitted student selections for your college verification.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('selections')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            Review Selections →
          </button>
        </div>
      )}

      {/* 1. DASHBOARD: 4 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (card.id === 4) onNavigateToTab('selections');
              }}
              className={`bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${card.id === 4 ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.colorBg} ${card.colorText} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon size={20} />
                </div>
              </div>

              <div>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-2 truncate">
                  {card.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Campus Drives Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Active Placement Drives</h3>
            </div>

            <button
              onClick={() => onNavigateToTab('jobs')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage All Jobs</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active drives posted.</p>
            ) : (
              jobs.slice(0, 3).map((job) => {
                const companyName = job.company?.company_name || job.company || 'Company';

                return (
                  <div key={job.job_id || job.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{job.title}</p>
                      <p className="text-slate-500 font-medium">{companyName} • Package: <strong className="text-blue-600">{job.package || 'Competitive'}</strong></p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                      {job.status || 'Active'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Candidate Selections Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-purple-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Candidate Selection Approvals</h3>
            </div>

            <button
              onClick={() => onNavigateToTab('selections')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage Selections</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {myApplications.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No candidate selections recorded.</p>
            ) : (
              myApplications.slice(0, 3).map((app) => {
                const studentName = app.student?.user?.name || app.studentName || 'Candidate';
                const companyName = app.job?.company_name || app.job?.company?.company_name || app.company || 'Company';
                const isPending = app.status === 'Pending TPO Approval' || app.status === 'Pending TPO Selection Approval';

                return (
                  <div key={app.application_id || app.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{studentName}</p>
                      <p className="text-slate-500 font-medium">{companyName} • {app.job?.title || 'Role'}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      isPending ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isPending ? '⏳ Pending Approval' : app.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
