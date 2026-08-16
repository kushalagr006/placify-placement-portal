import React from 'react';
import { Briefcase, Users, UserCheck } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const CompanySummaryCards = () => {
  const { jobs, myApplications } = usePortal();

  const summary = [
    { label: 'Posted Jobs', value: jobs.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Applications', value: myApplications.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Shortlisted', value: myApplications.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {summary.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">{item.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{item.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
