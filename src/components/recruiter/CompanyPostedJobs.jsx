import React, { useState } from 'react';
import { Briefcase, MapPin, Users, ChevronRight, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { companyService } from '../../services/companyService';

export const CompanyPostedJobs = () => {
  const { jobs } = usePortal();
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const handleOpenApplicants = async (job) => {
    setSelectedJob(job);
    setLoadingApps(true);
    try {
      const jobId = job.job_id || job.id;
      const apps = await companyService.getJobApplications(jobId);
      setJobApplications(apps || []);
    } catch {
      setJobApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
      
      {/* Section Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Briefcase size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Posted Jobs & Internships</h3>
            <p className="text-xs text-slate-500 font-medium">Active hiring openings created by your company</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          {jobs.length} Posted Openings
        </span>
      </div>

      {/* Grid of Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 col-span-2 text-center">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.job_id || job.id}
              className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Title & Status */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {job.title}
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                      job.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : job.status === 'Rejected by TPO'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {job.status === 'Active' ? '✓ TPO Approved' : job.status === 'Rejected by TPO' ? '✕ Rejected by TPO' : '⏳ Pending TPO Approval'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px]">
                    💰 {job.package || 'Competitive'}
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin size={13} className="text-slate-400" /> {job.location || 'Remote'}
                  </span>
                </div>

                {/* Colleges & Branches Eligibility Badges */}
                <div className="space-y-1.5 mt-2 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-bold text-slate-500">Colleges & TPO Status:</span>
                    {Array.isArray(job.colleges) && job.colleges.length > 0 ? (
                      job.colleges.map((c, i) => {
                        const collegeCode = c.code || c.name || c;
                        const cId = c._id ? c._id.toString() : c.toString();
                        const app = Array.isArray(job.college_approvals)
                          ? job.college_approvals.find(ca => (ca.college?._id || ca.college)?.toString() === cId)
                          : null;
                        const tpoStatus = app ? app.status : 'Pending';

                        return (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded font-bold border ${
                              tpoStatus === 'Approved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : tpoStatus === 'Rejected'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {collegeCode} ({tpoStatus === 'Approved' ? '✓ Approved' : tpoStatus === 'Rejected' ? '✕ Rejected' : '⏳ Pending'})
                          </span>
                        );
                      })
                    ) : (
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">All Colleges</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-bold text-slate-500">Branches:</span>
                    {Array.isArray(job.branches) && job.branches.length > 0 ? (
                      job.branches.map((b, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold">
                          {b}
                        </span>
                      ))
                    ) : (
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">All Branches</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Applications & Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Users size={15} className="text-blue-600" />
                  <strong className="text-slate-900 font-bold">Applications</strong>
                </div>

                <button
                  onClick={() => handleOpenApplicants(job)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>View Applicants</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Applicants Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 uppercase">Applicants List</span>
              <h3 className="text-xl font-extrabold text-slate-900">{selectedJob.title}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Showing candidate applications submitted for this opening ({jobApplications.length} Total)
              </p>
            </div>

            {loadingApps ? (
              <p className="text-xs text-slate-500 text-center py-6">Loading applications...</p>
            ) : jobApplications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No applications received yet for this job.</p>
            ) : (
              <div className="space-y-3">
                {jobApplications.map((candidate) => {
                  const studentName = candidate.student?.user?.name || 'Candidate';
                  const branch = candidate.student?.branch || 'N/A';
                  const cgpa = candidate.student?.cgpa || 'N/A';
                  const avatar = studentName.substring(0, 2).toUpperCase();

                  return (
                    <div key={candidate.application_id || candidate.id} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                          {avatar}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{studentName}</p>
                          <p className="text-slate-500">{branch} • CGPA: {cgpa}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full font-bold border bg-blue-50 text-blue-700 border-blue-200">
                        {candidate.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setSelectedJob(null)}
              className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs mt-6 transition-colors"
            >
              Close Applicants List
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
