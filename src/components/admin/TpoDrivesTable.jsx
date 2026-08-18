import React, { useState } from 'react';
import { Briefcase, ChevronRight, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoDrivesTable = () => {
  const { jobs } = usePortal();
  const [selectedDrive, setSelectedDrive] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Briefcase size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Recent Placement Drives</h3>
            <p className="text-xs text-slate-500 font-medium">Active and recent campus recruitment drives</p>
          </div>
        </div>
        
        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
          Total ({jobs.length})
        </span>
      </div>

      {/* Drives Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
              <th className="pb-3 pl-1">Company</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Package</th>
              <th className="pb-3">Deadline</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-1">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-400">No campus drives listed currently.</td>
              </tr>
            ) : (
              jobs.map((drive) => {
                const companyName = drive.company?.company_name || drive.company || 'Company';
                const logoText = companyName.substring(0, 2).toUpperCase();

                return (
                  <tr key={drive.job_id || drive.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Company */}
                    <td className="py-3.5 pl-1">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-sm flex-shrink-0 bg-blue-600"
                        >
                          {logoText}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{companyName}</span>
                          <span className="text-[10px] text-blue-600 font-semibold">{drive.location || 'Remote'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 max-w-[220px]">
                      <span className="font-bold text-slate-800 text-xs truncate block">{drive.title}</span>
                    </td>

                    {/* Package */}
                    <td className="py-3.5 text-slate-900 font-bold">
                      {drive.package || 'Competitive'}
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 text-slate-500 font-medium">
                      {drive.deadline}
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {drive.status || 'Active'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 text-right pr-1">
                      <button
                        onClick={() => setSelectedDrive(drive)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Drive Details Drawer Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-slate-100">
            <button
              onClick={() => setSelectedDrive(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-md bg-blue-600"
              >
                {(selectedDrive.company?.company_name || 'CO').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">{selectedDrive.company?.company_name || 'Company'}</span>
                <h4 className="text-lg font-extrabold text-slate-900 leading-snug">{selectedDrive.title}</h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl mb-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Package</span>
                <span className="font-extrabold text-blue-600 text-sm">{selectedDrive.package || 'Competitive'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Status</span>
                <span className="font-bold text-slate-900">{selectedDrive.status || 'Active'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Location</span>
                <span className="font-bold text-slate-800">{selectedDrive.location || 'Remote'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Deadline</span>
                <span className="font-bold text-slate-800">{selectedDrive.deadline}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs mb-6">
              <span className="font-bold text-slate-900 block">Eligibility:</span>
              <p className="text-slate-600">{selectedDrive.eligibility || 'Open criteria'}</p>
            </div>

            <button
              onClick={() => setSelectedDrive(null)}
              className="w-full h-11 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Close Drive Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
