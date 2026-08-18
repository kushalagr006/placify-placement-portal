import React, { useState, useEffect } from 'react';
import { StudentNavbar } from './StudentNavbar';
import { StudentDashboardTab } from './StudentDashboardTab';
import { StudentBrowseJobsTab } from './StudentBrowseJobsTab';
import { StudentMyApplicationsTab } from './StudentMyApplicationsTab';
import { StudentProfileTab } from './StudentProfileTab';
import { CheckCircle2, X, Clock, ShieldAlert, RotateCcw, Building, BookOpen, ArrowRight } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { authService } from '../../services/authService';

const BRANCH_OPTIONS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

const FALLBACK_COLLEGES = [
  { id: 'SSIPMT', _id: 'SSIPMT', name: 'SSIPMT Raipur C.G', code: 'SSIPMT', location: 'Raipur, C.G.' },
  { id: 'CSVTU', _id: 'CSVTU', name: 'CSVTU Bhilai C.G', code: 'CSVTU', location: 'Bhilai, C.G.' },
  { id: 'AMITY', _id: 'AMITY', name: 'Amity University Raipur', code: 'AMITY', location: 'Raipur, C.G.' },
  { id: 'BIT', _id: 'BIT', name: 'BIT DURG', code: 'BIT', location: 'Durg, C.G.' },
  { id: 'MAIC', _id: 'MAIC', name: 'MAIC Raipur', code: 'MAIC', location: 'Raipur, C.G.' },
  { id: 'SSPU', _id: 'SSPU', name: 'SSPU Bhilai', code: 'SSPU', location: 'Bhilai, C.G.' },
];

export const StudentPortal = ({ onLogout }) => {
  const { studentProfile, applyForJob, reapplyStudentVerification } = usePortal();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Re-application state
  const [colleges, setColleges] = useState(FALLBACK_COLLEGES);
  const [reapplyCollegeId, setReapplyCollegeId] = useState(
    studentProfile?.college?._id || studentProfile?.college?.code || FALLBACK_COLLEGES[0].id
  );
  const [reapplyBranch, setReapplyBranch] = useState(studentProfile?.branch || BRANCH_OPTIONS[0]);
  const [reapplying, setReapplying] = useState(false);
  const [reapplyError, setReapplyError] = useState('');

  useEffect(() => {
    authService
      .getColleges()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setColleges(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (studentProfile?.college) {
      setReapplyCollegeId(studentProfile.college._id || studentProfile.college.code || studentProfile.college);
    }
    if (studentProfile?.branch) {
      setReapplyBranch(studentProfile.branch);
    }
  }, [studentProfile]);

  const handleConfirmApply = async () => {
    if (!selectedApplyJob) return;
    setSubmitting(true);
    const res = await applyForJob(selectedApplyJob);
    setSubmitting(false);

    if (res.success) {
      setAppliedSuccess(true);
      setTimeout(() => {
        setAppliedSuccess(false);
        setSelectedApplyJob(null);
      }, 1200);
    }
  };

  const handleReapply = async (e) => {
    e.preventDefault();
    setReapplyError('');
    setReapplying(true);

    const res = await reapplyStudentVerification({
      collegeId: reapplyCollegeId,
      branch: reapplyBranch,
    });

    setReapplying(false);
    if (!res.success) {
      setReapplyError(res.message || 'Failed to submit re-application');
    }
  };

  const studentCgpa = studentProfile?.cgpa ? `${studentProfile.cgpa} / 10` : 'Verified';
  const resumeName = studentProfile?.resume || 'Student_Resume.pdf';
  const companyName = selectedApplyJob?.company?.company_name || selectedApplyJob?.company || 'Employer';
  const logoText = companyName.substring(0, 2).toUpperCase();

  const isApproved = studentProfile?.verification_status === 'Approved';
  const isRejected = studentProfile?.verification_status === 'Rejected';
  const isPending = studentProfile?.verification_status === 'Pending';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      
      {/* Student Top Navbar */}
      <StudentNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {!studentProfile ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500">Verifying account status...</p>
          </div>
        ) : isRejected ? (
          <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-red-200 shadow-xl p-8 sm:p-10 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <X size={34} />
            </div>
            <div>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-extrabold uppercase border border-red-200 inline-block mb-2">
                Registration Verification Rejected
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Verification Unsuccessful
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed max-w-lg mx-auto">
                Your student registration was rejected by the TPO of{' '}
                <strong className="text-slate-900">{studentProfile?.college?.name || 'your college'}</strong>. You can correct your College and Branch details below and re-submit your verification request.
              </p>
            </div>

            {reapplyError && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold">
                {reapplyError}
              </div>
            )}

            {/* Re-Application Form */}
            <form onSubmit={handleReapply} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                <RotateCcw size={16} className="text-blue-600" />
                <span>Re-Apply for Student Verification</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building size={14} className="text-blue-600" /> Confirm College / Institution
                </label>
                <select
                  value={reapplyCollegeId}
                  onChange={(e) => setReapplyCollegeId(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 bg-white text-slate-900 text-xs font-semibold border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                >
                  {colleges.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      {c.name} ({c.code}){c.location ? ` - ${c.location}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-blue-600" /> Confirm Academic Branch
                </label>
                <select
                  value={reapplyBranch}
                  onChange={(e) => setReapplyBranch(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 bg-white text-slate-900 text-xs font-semibold border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                >
                  {BRANCH_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={reapplying}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>{reapplying ? 'Submitting Re-Application...' : 'Re-Apply for Verification'}</span>
                {!reapplying && <ArrowRight size={15} />}
              </button>
            </form>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onLogout}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Log Out / Switch Account
              </button>
            </div>
          </div>
        ) : isPending ? (
          <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-amber-200/80 shadow-xl p-8 sm:p-10 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Clock size={34} />
            </div>
            <div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-extrabold uppercase border border-amber-200 inline-block mb-2">
                Registration Verification Pending
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Awaiting TPO Approval
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed max-w-lg mx-auto">
                Welcome, <strong className="text-slate-900">{studentProfile?.user?.name || 'Student'}</strong>! Your student account registration for{' '}
                <strong className="text-blue-700">{studentProfile?.college?.name || 'your selected College'}</strong> ({studentProfile?.branch || 'Engineering'}) is currently pending verification.
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-left text-xs space-y-2 text-slate-700">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert size={15} className="text-amber-600" /> Account Verification Standard Operating Procedure:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-medium">
                <li>Your college TPO Officer will review your student record and confirm your branch enrollment.</li>
                <li><strong>No features</strong> (job drives, company applications, announcements) are accessible until your account is approved.</li>
                <li>Upon approval by your TPO, your student portal dashboard will automatically unlock with full access.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onLogout}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Log Out / Switch Account
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboardTab
                onNavigateToBrowse={setActiveTab}
                onApplyJob={setSelectedApplyJob}
              />
            )}

            {activeTab === 'browse_jobs' && (
              <StudentBrowseJobsTab
                onApplyJob={setSelectedApplyJob}
              />
            )}

            {activeTab === 'my_applications' && (
              <StudentMyApplicationsTab />
            )}

            {activeTab === 'profile' && (
              <StudentProfileTab />
            )}
          </>
        )}
      </main>

      {/* Apply Confirmation Modal */}
      {selectedApplyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-100">
            <button
              onClick={() => setSelectedApplyJob(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            {appliedSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 size={42} className="text-emerald-500 mx-auto mb-2 animate-bounce" />
                <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-500 mt-1">Your verified profile and resume sent to {companyName}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-sm bg-blue-600"
                  >
                    {logoText}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">{companyName}</span>
                    <h3 className="font-extrabold text-slate-900 text-sm">{selectedApplyJob.title}</h3>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package / Stipend:</span>
                    <span className="font-bold text-slate-900">{selectedApplyJob.package || 'Competitive'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Candidate CGPA:</span>
                    <span className="font-bold text-emerald-600">{studentCgpa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attached Resume:</span>
                    <span className="font-bold text-blue-600">{resumeName}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmApply}
                  disabled={submitting}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                >
                  {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400 font-medium mt-auto">
        <p>© 2026 Placify • Student Career Dashboard</p>
      </footer>

    </div>
  );
};
