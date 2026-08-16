import React from 'react';
import { BarChart3 } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoStatsSection = () => {
  const { students, jobs, myApplications } = usePortal();

  const totalStudents = students.length || 1;
  const activeJobs = jobs.length;
  const totalApps = myApplications.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Placement Statistics</h3>
            <p className="text-xs text-slate-500 font-medium">Batch metrics, active jobs, and student applications</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
          Campus Season
        </span>
      </div>

      {/* 4 Stat Metric Highlight Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Students</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">
            {students.length}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Drives</span>
          <p className="text-xl font-extrabold text-blue-600 mt-1">
            {activeJobs}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Submitted Applications</span>
          <p className="text-xl font-extrabold text-indigo-600 mt-1">
            {totalApps}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Portal Status</span>
          <p className="text-xl font-extrabold text-purple-600 mt-1">
            Active
          </p>
        </div>

      </div>

    </div>
  );
};
