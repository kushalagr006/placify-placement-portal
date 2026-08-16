import React, { useState } from 'react';
import { FileText, Eye, CheckCircle2, XCircle, Clock, ShieldCheck, UserCheck, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { adminService } from '../../services/adminService';
import { StudentDetailsModal } from '../StudentDetailsModal';

export const TpoApplicationsList = () => {
  const { myApplications, verifyCandidateSelection } = usePortal();
  const [selectedApplicantStudent, setSelectedApplicantStudent] = useState(null);
  const [loadingProfileId, setLoadingProfileId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectingModalTarget, setRejectingModalTarget] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleInspectStudentProfile = async (app) => {
    const studentId =
      app.student_id ||
      app.student?._id ||
      app.student?.student_id ||
      app.student?.id ||
      app.student?.user_id ||
      (typeof app.student === 'string' ? app.student : null);

    if (!studentId) {
      showToast('✕ Student profile identifier not found on this application');
      return;
    }

    setLoadingProfileId(app.application_id || app.id);
    try {
      const detailed = await adminService.getStudentDetails(studentId);
      setSelectedApplicantStudent(detailed);
    } catch (err) {
      showToast(`✕ ${err.response?.data?.detail || 'Failed to fetch student details'}`);
    } finally {
      setLoadingProfileId(null);
    }
  };

  const handleDecision = async (appId, status, remarks = '') => {
    setActionLoadingId(appId);
    const res = await verifyCandidateSelection(appId, status, remarks);
    if (res.success) {
      showToast(status === 'Selected' ? '✓ Candidate selection APPROVED by TPO' : '✕ Candidate selection REJECTED by TPO');
    } else {
      showToast(`✕ ${res.message}`);
    }
    setActionLoadingId(null);
  };

  const pendingCount = myApplications.filter(
    (app) => app.status === 'Pending TPO Approval' || app.status === 'Pending TPO Selection Approval'
  ).length;

  const filteredApplications = myApplications.filter((app) => {
    if (filterStatus === 'pending') return app.status === 'Pending TPO Approval' || app.status === 'Pending TPO Selection Approval';
    if (filterStatus === 'selected') return app.status === 'Selected';
    if (filterStatus === 'rejected') return app.status === 'Rejected';
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg border border-slate-700 animate-fadeIn flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white font-extrabold text-xs">✕</button>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <UserCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">TPO Candidate Selection Verification</h3>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-200 animate-pulse">
                  {pendingCount} Pending Approval
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">Review and verify recruiter candidate selections for your college</p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All ({myApplications.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('selected')}
            className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'selected' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center italic">No candidate application records matching filter.</p>
        ) : (
          filteredApplications.map((app) => {
            const appId = app.application_id || app.id;
            const studentName = app.student?.user?.name || app.studentName || 'Candidate';
            const companyName = app.job?.company_name || app.job?.company?.company_name || app.company || 'Company';
            const avatar = studentName.substring(0, 2).toUpperCase();
            const isPending = app.status === 'Pending TPO Approval' || app.status === 'Pending TPO Selection Approval';
            const isSelected = app.status === 'Selected';
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={appId}
                className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isPending
                    ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
                    : isSelected
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200/80 bg-slate-50/50'
                }`}
              >
                {/* Candidate Info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInspectStudentProfile(app)}
                        className="font-extrabold text-slate-900 text-sm hover:text-blue-600 transition-colors text-left"
                      >
                        {studentName}
                      </button>
                      <span className="text-xs font-semibold text-slate-400">• {app.branch || app.student?.branch || 'N/A'}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold block">
                      CGPA: <strong className="text-emerald-600">{app.cgpa || app.student?.cgpa || 'N/A'}</strong>
                    </span>
                  </div>
                </div>

                {/* Job Drive & Recruiter Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                  <div className="text-left lg:text-right">
                    <span className="font-extrabold text-slate-900 text-xs block">{companyName}</span>
                    <span className="text-xs text-slate-500 font-medium block">{app.job?.title || 'Role'}</span>
                  </div>

                  {/* Status Pill */}
                  <div className="shrink-0">
                    {isPending ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                        <Clock size={13} className="animate-spin" />
                        <span>⏳ Pending TPO Approval</span>
                      </span>
                    ) : isSelected ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 size={13} />
                        <span>✓ Selection Approved</span>
                      </span>
                    ) : isRejected ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5 shadow-2xs">
                        <XCircle size={13} />
                        <span>✕ Selection Rejected</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {app.status}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    <button
                      onClick={() => handleInspectStudentProfile(app)}
                      disabled={loadingProfileId === appId}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>{loadingProfileId === appId ? 'Loading...' : 'Full Profile'}</span>
                    </button>

                    {isPending && (
                      <>
                        <button
                          onClick={() => handleDecision(appId, 'Selected')}
                          disabled={actionLoadingId === appId}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setRejectingModalTarget({ appId, studentName, companyName, jobTitle: app.job?.title || 'Role' })}
                          disabled={actionLoadingId === appId}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Full Student Profile Modal */}
      {selectedApplicantStudent && (
        <StudentDetailsModal
          isOpen={!!selectedApplicantStudent}
          onClose={() => setSelectedApplicantStudent(null)}
          student={selectedApplicantStudent}
        />
      )}

      {/* TPO Rejection Reason Modal */}
      {rejectingModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
                <XCircle size={20} />
                <span>Reject Candidate Selection</span>
              </div>
              <button
                onClick={() => { setRejectingModalTarget(null); setRejectionReasonInput(''); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-100 space-y-1 text-xs">
              <p className="font-bold text-red-900">Candidate: {rejectingModalTarget.studentName}</p>
              <p className="text-red-700 font-medium">Company: {rejectingModalTarget.companyName} • {rejectingModalTarget.jobTitle}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Rejection / TPO Remarks <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Specify TPO rejection reason (e.g. Student already placed, CGPA verification failed, student declined offer...)"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => { setRejectingModalTarget(null); setRejectionReasonInput(''); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  const { appId } = rejectingModalTarget;
                  const remarks = rejectionReasonInput.trim();
                  setRejectingModalTarget(null);
                  setRejectionReasonInput('');
                  await handleDecision(appId, 'Rejected', remarks);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
