import React, { useState } from 'react';
import { FileText, FileCheck, CheckCircle2, XCircle, Eye, X, User, Filter, Search } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { companyService } from '../../services/companyService';
import { StudentDetailsModal } from '../StudentDetailsModal';

export const CompanyApplicationsTab = () => {
  const { myApplications, jobs, updateCandidateStatus } = usePortal();
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [searchCandidate, setSearchCandidate] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedApplicantStudent, setSelectedApplicantStudent] = useState(null);
  const [loadingProfileId, setLoadingProfileId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Selected':
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shortlisted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const [rejectingModalTarget, setRejectingModalTarget] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const handleAccept = async (id, studentName) => {
    if (actionLoadingId === id) return;
    setActionLoadingId(id);
    try {
      const res = await updateCandidateStatus(id, 'Selected');
      if (res.success) {
        showToast(`✓ Candidate selection submitted for TPO approval (${studentName})`);
      } else {
        showToast(`✕ ${res.message}`);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id, studentName, remarks = '') => {
    if (actionLoadingId === id) return;
    setActionLoadingId(id);
    try {
      const res = await updateCandidateStatus(id, 'Rejected', remarks);
      if (res.success) {
        showToast(`✕ Rejected application for ${studentName}`);
      } else {
        showToast(`✕ ${res.message}`);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleViewApplicantProfile = async (app) => {
    const studentId =
      app.student_id ||
      app.student?._id ||
      app.student?.student_id ||
      app.student?.id ||
      app.student?.user_id ||
      app.student?.user?.id ||
      (typeof app.student === 'string' ? app.student : null);

    if (!studentId) {
      showToast('✕ Student profile identifier not found on this application');
      return;
    }

    setLoadingProfileId(app.application_id || app.id);
    try {
      const detailed = await companyService.getApplicantDetails(studentId);
      setSelectedApplicantStudent(detailed);
    } catch (err) {
      showToast(`✕ ${err.response?.data?.detail || 'Failed to load applicant profile'}`);
    } finally {
      setLoadingProfileId(null);
    }
  };

  const isJobMatch = (app, filterValue) => {
    if (!filterValue || filterValue === 'All') return true;

    // 1. Direct ID match
    const appJobId = app.job_id || app.job?.id || app.job?._id || (typeof app.job === 'string' ? app.job : null);
    if (appJobId && appJobId.toString() === filterValue.toString()) {
      return true;
    }

    // 2. Title fallback match for legacy/populated applications
    const targetJob = jobs.find((j) => (j.job_id || j.id || j._id)?.toString() === filterValue.toString());
    if (targetJob) {
      const targetTitle = (targetJob.title || '').trim().toLowerCase();
      const appTitle = (app.job?.title || app.jobTitle || app.jobRole || '').trim().toLowerCase();
      if (targetTitle && appTitle && targetTitle === appTitle) {
        return true;
      }
    }

    return false;
  };

  const filteredApplications = myApplications.filter((app) => {
    const matchesJob = isJobMatch(app, selectedJobFilter);
    const studentName = app.student?.user?.name || app.studentName || '';
    const matchesSearch = !searchCandidate || studentName.toLowerCase().includes(searchCandidate.toLowerCase());

    return matchesJob && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Student Applications Management</h2>
            <p className="text-xs text-slate-500 font-medium">Review candidates, filter by job drive, inspect portfolio & resume</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 self-start sm:self-auto">
          {filteredApplications.length} of {myApplications.length} Applicants
        </span>
      </div>

      {/* Filter Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
        {/* Job Drive Dropdown Filter */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
          <Filter size={15} className="text-purple-600 shrink-0" />
          <span className="text-xs font-bold text-slate-500 shrink-0">Job Drive:</span>
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
          >
            <option value="All">All Job Drives ({myApplications.length} Applicants)</option>
            {jobs.map((job) => {
              const jobId = job.job_id || job.id || job._id;
              const jobAppsCount = myApplications.filter((a) => isJobMatch(a, jobId)).length;
              return (
                <option key={jobId} value={jobId}>
                  {job.title} — ({jobAppsCount} {jobAppsCount === 1 ? 'Applicant' : 'Applicants'})
                </option>
              );
            })}
          </select>
        </div>

        {/* Candidate Name Search Input */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search candidate by name..."
            value={searchCandidate}
            onChange={(e) => setSearchCandidate(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          />
          {searchCandidate && (
            <button
              onClick={() => setSearchCandidate('')}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
              <th className="pb-3 pl-1">Student Name</th>
              <th className="pb-3">Branch</th>
              <th className="pb-3">CGPA</th>
              <th className="pb-3">Full Profile</th>
              <th className="pb-3">Resume</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-1">Action (Accept / Reject)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                  {myApplications.length === 0
                    ? 'No candidate applications received yet.'
                    : 'No applications match your selected job drive filter.'}
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => {
                const appId = app.application_id || app.id;
                const studentName = app.student?.user?.name || app.studentName || 'Candidate';
                const jobTitle = app.job?.title || app.jobRole || 'Job Posting';
                const branch = app.student?.branch || app.branch || 'N/A';
                const cgpa = app.student?.cgpa || app.cgpa || 'N/A';
                const avatar = studentName.substring(0, 2).toUpperCase();
                const isLoadingProfile = loadingProfileId === appId;

                return (
                  <tr key={appId} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Student Name (Clickable) */}
                    <td className="py-3.5 pl-1">
                      <div
                        onClick={() => handleViewApplicantProfile(app)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-600 group-hover:bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm transition-colors">
                          {avatar}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-purple-600 text-xs block transition-colors">
                            {studentName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{jobTitle}</span>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 font-bold text-slate-800">
                      {branch}
                    </td>

                    {/* CGPA */}
                    <td className="py-3.5 text-emerald-600 font-bold">
                      {cgpa}
                    </td>

                    {/* Full Profile Button */}
                    <td className="py-3.5">
                      <button
                        onClick={() => handleViewApplicantProfile(app)}
                        disabled={isLoadingProfile}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <User size={13} />
                        <span>{isLoadingProfile ? 'Loading...' : 'Full Profile'}</span>
                      </button>
                    </td>

                    {/* Resume Button */}
                    <td className="py-3.5">
                      <button
                        onClick={() => setSelectedResume(app)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileCheck size={14} />
                        <span>View Resume</span>
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(app.status)}`}>
                        {app.status === 'Pending TPO Approval' || app.status === 'Pending TPO Selection Approval'
                          ? '⏳ Pending TPO Approval'
                          : app.status === 'Selected' || app.status === 'Accepted'
                          ? '✓ Selected (TPO Approved)'
                          : app.status === 'Rejected'
                          ? '✕ Selection Rejected'
                          : app.status}
                      </span>
                    </td>

                    {/* Accept / Reject Action Buttons */}
                    <td className="py-3.5 text-right pr-1">
                      {(() => {
                        const isPendingApproval = app.status === 'Pending TPO Approval' || app.status === 'Pending TPO Selection Approval';
                        const isSelectedOrApproved = app.status === 'Selected' || app.status === 'Accepted';
                        const isRejected = app.status === 'Rejected';
                        const isProcessing = actionLoadingId === appId;

                        const isAcceptDisabled = isPendingApproval || isSelectedOrApproved || isRejected || isProcessing;
                        const isRejectDisabled = isPendingApproval || isSelectedOrApproved || isRejected || isProcessing;

                        return (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleAccept(appId, studentName)}
                              disabled={isAcceptDisabled}
                              className={`px-3 py-1.5 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow-xs ${
                                isAcceptDisabled
                                  ? 'bg-slate-200 text-slate-500 opacity-70 cursor-not-allowed border border-slate-300'
                                  : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                              }`}
                            >
                              <CheckCircle2 size={13} />
                              <span>
                                {isProcessing
                                  ? 'Saving...'
                                  : isPendingApproval
                                  ? 'Pending Approval'
                                  : isSelectedOrApproved
                                  ? 'Accepted'
                                  : 'Accept'}
                              </span>
                            </button>

                            <button
                              onClick={() => setRejectingModalTarget({ appId, studentName, jobTitle })}
                              disabled={isRejectDisabled}
                              className={`px-3 py-1.5 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow-xs ${
                                isRejectDisabled
                                  ? 'bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed border border-slate-200'
                                  : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                              }`}
                            >
                              <XCircle size={13} />
                              <span>{isRejected ? 'Rejected' : 'Reject'}</span>
                            </button>
                          </div>
                        );
                      })()}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Complete Student Details Modal */}
      <StudentDetailsModal
        isOpen={!!selectedApplicantStudent}
        onClose={() => setSelectedApplicantStudent(null)}
        student={selectedApplicantStudent}
      />

      {/* Resume Preview Modal */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-100">
            <button
              onClick={() => setSelectedResume(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="text-center py-2 mb-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileCheck size={32} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {selectedResume.student?.user?.name || selectedResume.studentName || 'Candidate'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {selectedResume.student?.branch || 'Candidate'} • CGPA {selectedResume.student?.cgpa || 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Attached Resume</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Verified PDF</span>
              </div>
              <p className="font-bold text-slate-800 text-xs">
                📄 {selectedResume.student?.resume || 'resume.pdf'}
              </p>
            </div>

            <div className="flex gap-2">
              {selectedResume.student?.resume && selectedResume.student.resume.includes('resume-') ? (
                <a
                  href={`http://127.0.0.1:5000/uploads/resumes/${selectedResume.student.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <Eye size={16} />
                  <span>Open PDF Document</span>
                </a>
              ) : (
                <div className="flex-1 text-center py-2 text-xs font-bold text-slate-400">
                  Standard Sample Resume
                </div>
              )}

              <button
                onClick={() => setSelectedResume(null)}
                className="px-4 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
                <XCircle size={20} />
                <span>Reject Candidate Application</span>
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
              <p className="text-red-700 font-medium">Job Drive: {rejectingModalTarget.jobTitle}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Rejection / Feedback for Student <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Specify rejection reason (e.g. Candidate CGPA below criteria, lacking required skills, failed technical evaluation...)"
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
                  const { appId, studentName } = rejectingModalTarget;
                  const remarks = rejectionReasonInput.trim();
                  setRejectingModalTarget(null);
                  setRejectionReasonInput('');
                  await handleReject(appId, studentName, remarks);
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
