import React from 'react';
import { Calendar } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoUpcomingDrives = () => {
  const { jobs } = usePortal();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Upcoming Campus Drives</h3>
            <p className="text-xs text-slate-500 font-medium">Scheduled test rounds and interview sessions</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
          Active Schedule
        </span>
      </div>

      {/* Drives Timeline List */}
      <div className="space-y-3">
        {jobs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No upcoming campus drives scheduled.</p>
        ) : (
          jobs.slice(0, 3).map((item) => {
            const companyName = item.company?.company_name || item.company || 'Company';

            return (
              <div
                key={item.job_id || item.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:border-indigo-200 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                    {companyName}
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-600 pt-1">
                  <span>Deadline: <strong>{item.deadline}</strong> • Location: <strong>{item.location || 'Remote'}</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
