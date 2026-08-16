import React, { useState } from 'react';
import { Briefcase, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoJobsTab = () => {
  const { jobs, verifyJobDrive } = usePortal();
  const [updatingId, setUpdatingId] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const handleVerify = async (jobId, status) => {
    setUpdatingId(jobId);
    setActionMsg('');

    const res = await verifyJobDrive(jobId, status);
    setUpdatingId(null);

    if (res.success) {
      setActionMsg(`✓ Job drive marked as ${status} successfully.`);
      setTimeout(() => setActionMsg(''), 3000);
    } else {
      setActionMsg(`Error: ${res.message}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Briefcase size={18} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Manage Posted Campus Drives & Jobs</h2>
            <p className="text-xs text-slate-500 font-medium">Review and verify job drives targeting your institution</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
          {jobs.length} Drives Listed
        </span>
      </div>

      {actionMsg && (
        <div className={`p-3 text-xs font-bold rounded-xl text-center ${
          actionMsg.includes('✓') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {actionMsg}
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-400">
            <Briefcase size={36} className="mx-auto mb-2 opacity-50" />
            <p className="font-bold text-sm">No campus drives listed for your college currently.</p>
          </div>
        ) : (
          jobs.map((job) => {
            const jobId = job.job_id || job.id;
            const companyName = job.company?.company_name || job.company || 'Company';
            const logoText = companyName.substring(0, 2).toUpperCase();
            const tpoStatus = job.tpo_status || 'Pending';
            const isLoading = updatingId === jobId;

            return (
              <div
                key={jobId}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-sm bg-blue-600"
                      >
                        {logoText}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{companyName}</span>
                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{job.title}</h3>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        tpoStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : tpoStatus === 'Rejected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {tpoStatus === 'Approved' ? '✓ Approved' : tpoStatus === 'Rejected' ? '✕ Rejected' : '⏳ Pending Review'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>💰 {job.package || 'Competitive'}</span>
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <MapPin size={12} /> {job.location || 'Remote'}
                    </span>
                  </div>

                  {/* Branches & Eligibility */}
                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      <span className="font-bold text-slate-400">Branches:</span>
                      {Array.isArray(job.branches) && job.branches.length > 0 ? (
                        job.branches.map((b, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-bold">
                            {b}
                          </span>
                        ))
                      ) : (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">All Branches</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                    <span>Deadline: <strong>{job.deadline}</strong></span>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(jobId, 'Approved')}
                        disabled={isLoading || tpoStatus === 'Approved'}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle size={13} />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleVerify(jobId, 'Rejected')}
                        disabled={isLoading || tpoStatus === 'Rejected'}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle size={13} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
