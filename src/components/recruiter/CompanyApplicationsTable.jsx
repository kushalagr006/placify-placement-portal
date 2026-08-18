import React from 'react';
import { usePortal } from '../../context/PortalContext';

export const CompanyApplicationsTable = () => {
  const { myApplications } = usePortal();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
      <h3 className="font-extrabold text-slate-900 text-base">Recent Candidate Submissions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
              <th className="pb-3">Candidate</th>
              <th className="pb-3">Branch</th>
              <th className="pb-3">CGPA</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {myApplications.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-400">No candidate applications received yet.</td>
              </tr>
            ) : (
              myApplications.map((app) => (
                <tr key={app.application_id || app.id}>
                  <td className="py-3 font-bold text-slate-900">{app.student?.user?.name || app.studentName || 'Candidate'}</td>
                  <td className="py-3 text-slate-600">{app.student?.branch || 'N/A'}</td>
                  <td className="py-3 text-emerald-600 font-bold">{app.student?.cgpa || 'N/A'}</td>
                  <td className="py-3 font-bold text-blue-600">{app.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
