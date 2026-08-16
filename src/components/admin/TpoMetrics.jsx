import React from 'react';
import { Users, Building2, Briefcase, GraduationCap } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoMetrics = () => {
  const { students, companies, jobs, announcements } = usePortal();

  const metrics = [
    { id: 1, label: 'Total Students', value: students.length, change: 'Registered', icon: Users, colorBg: 'bg-blue-50', colorText: 'text-blue-600' },
    { id: 2, label: 'Companies', value: companies.length, change: 'Hiring Partners', icon: Building2, colorBg: 'bg-indigo-50', colorText: 'text-indigo-600' },
    { id: 3, label: 'Job Drives', value: jobs.length, change: 'Active Listings', icon: Briefcase, colorBg: 'bg-amber-50', colorText: 'text-amber-600' },
    { id: 4, label: 'Announcements', value: announcements.length, change: 'Broadcasted', icon: GraduationCap, colorBg: 'bg-purple-50', colorText: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                {metric.label}
              </span>
              <div className={`w-9 h-9 rounded-xl ${metric.colorBg} ${metric.colorText} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon size={19} />
              </div>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                {metric.value}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 mt-2 truncate">
                {metric.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
