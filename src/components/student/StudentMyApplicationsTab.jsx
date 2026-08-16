import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const StudentMyApplicationsTab = () => {
  const { myApplications } = usePortal();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Pending TPO Selection Approval':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Shortlisted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">My Applications & Status</h2>
            <p className="text-xs text-slate-500 font-medium">Track submitted job & internship applications</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          {myApplications.length} Total Submissions
        </span>
      </div>

      {/* Applications List Cards */}
      <div className="space-y-4">
        {myApplications.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm font-semibold text-slate-600">You haven't submitted any applications yet.</p>
            <p className="text-xs text-slate-400 mt-1">Browse jobs and submit applications to track progress here.</p>
          </div>
        ) : (
          myApplications.map((app) => {
            const companyName = app.job?.company?.company_name || app.company || 'Company';
            const jobTitle = app.job?.title || app.title || 'Job Posting';
            const logoText = companyName.substring(0, 2).toUpperCase();
            const appliedDate = app.applied_date
              ? new Date(app.applied_date).toLocaleDateString()
              : app.appliedDate || 'Recently';

            // Find latest rejection remarks if available in status_history
            const historyList = app.status_history || [];
            const rejectionEntry = [...historyList].reverse().find((h) => h.status === 'Rejected' && h.remarks);
            const lastEntryWithRemarks = [...historyList].reverse().find((h) => h.remarks && h.remarks.trim() !== '');

            const rejectionRemark =
              rejectionEntry?.remarks ||
              lastEntryWithRemarks?.remarks ||
              app.remarks ||
              'Application was not selected during recruitment review.';

            return (
              <div
                key={app.application_id || app.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-200 hover:shadow-sm transition-all flex flex-col space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Company & Title */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white text-sm shadow-sm flex-shrink-0 bg-indigo-600"
                    >
                      {logoText}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{companyName}</span>
                      <h3 className="font-extrabold text-slate-900 text-base">{jobTitle}</h3>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">
                        Applied on {appliedDate} • Package: <strong className="text-slate-800">{app.job?.package || app.package || 'Competitive'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Status Badge Tag */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(app.status)}`}>
                      {app.status === 'Pending TPO Approval' || app.status === 'Pending TPO Selection Approval'
                        ? '⏳ Pending TPO Approval'
                        : app.status === 'Selected'
                        ? '🎉 Selected (TPO Approved)'
                        : app.status === 'Rejected'
                        ? '✕ Selection Rejected'
                        : app.status}
                    </span>
                  </div>
                </div>

                {/* Rejection Reason Feedback Box */}
                {app.status === 'Rejected' && (
                  <div className="p-3.5 bg-red-50/90 rounded-xl border border-red-200 text-xs flex items-start gap-2.5 text-red-950 mt-1">
                    <AlertCircle size={17} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block text-red-950">Rejection Feedback / Reason:</span>
                      <p className="text-red-900 font-semibold mt-0.5 leading-relaxed">{rejectionRemark}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
