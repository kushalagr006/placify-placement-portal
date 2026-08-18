import React from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  GraduationCap,
  Award,
  Code2,
  Globe,
  FileText,
  Eye,
  ExternalLink,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

export const StudentDetailsModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  const studentName = student.user?.name || student.name || 'Student Profile';
  const email = student.user?.email || student.email || 'N/A';
  const avatar = studentName.substring(0, 2).toUpperCase();
  const collegeName = student.college?.name || student.college?.code || 'Institution';
  const branch = student.branch || 'Computer Science';
  const semester = student.semester || 8;
  const cgpa = student.cgpa || 8.5;
  const phone = student.phone || 'N/A';
  const status = student.verification_status || 'Pending';
  const resumeName = student.resume;

  const skillsList = typeof student.skills === 'string'
    ? student.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : Array.isArray(student.skills)
    ? student.skills
    : [];

  const pdfViewUrl = resumeName && resumeName.includes('resume-')
    ? `http://127.0.0.1:5000/uploads/resumes/${resumeName}`
    : null;

  const externalLinks = student.external_links || [];
  const achievements = student.achievements || [];
  const projects = student.projects || [];

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200/80 max-h-[85vh] flex flex-col my-auto">
        
        {/* Premium Modal Header */}
        <div className="bg-slate-900 p-6 text-white relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-all cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg border border-blue-400/30 shrink-0">
              {avatar}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-extrabold text-white">{studentName}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                    status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : status === 'Rejected'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {status === 'Approved' ? '✓ Verified Student' : status === 'Rejected' ? '✕ Verification Rejected' : '⏳ Verification Pending'}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-semibold mt-1">
                {collegeName} • {branch} (Semester {semester})
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 scrollbar-thin">
          
          {/* Quick Metrics & Contacts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">CGPA Score</span>
              <span className="font-extrabold text-emerald-600 text-sm">{cgpa} / 10.0</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Semester</span>
              <span className="font-bold text-slate-800 text-sm">Sem {semester}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Email Address</span>
              <span className="font-semibold text-slate-700 truncate block">{email}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Mobile Phone</span>
              <span className="font-semibold text-slate-700 block">{phone}</span>
            </div>
          </div>

          {/* Resume Viewer */}
          {pdfViewUrl && (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  <FileText size={20} />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-slate-900 text-xs">Student Resume Document</h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{resumeName}</p>
                </div>
              </div>

              <a
                href={pdfViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer"
              >
                <Eye size={14} />
                <span>View PDF</span>
              </a>
            </div>
          )}

          {/* Technical Skills */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Technical Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {skillsList.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No skills specified</span>
              ) : (
                skillsList.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg text-xs border border-slate-200">
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* External Profiles & Links */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={14} className="text-purple-600" /> External Links & Profiles
            </h4>
            <div className="flex flex-wrap gap-2">
              {externalLinks.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No external links provided</span>
              ) : (
                externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{link.title}</span>
                    <ExternalLink size={12} />
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Projects Portfolio */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 size={14} className="text-blue-600" /> Technical Projects ({projects.length})
            </h4>

            {projects.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No projects listed by candidate</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-2">
                    <h5 className="font-extrabold text-slate-900 text-xs">{proj.name}</h5>
                    {proj.description && <p className="text-xs text-slate-600 leading-snug">{proj.description}</p>}
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {proj.technologies.split(',').map((tech, tIdx) => (
                          <span key={tIdx} className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded text-[10px] font-bold border border-blue-100">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 pt-1 text-xs">
                      {proj.github_link && (
                        <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 cursor-pointer">
                          <ExternalLink size={11} /> GitHub
                        </a>
                      )}
                      {proj.live_link && (
                        <a href={proj.live_link} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer">
                          <ExternalLink size={11} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements & Certifications */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-amber-600" /> Achievements & Certifications ({achievements.length})
            </h4>

            {achievements.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No achievements listed by candidate</p>
            ) : (
              <div className="space-y-2">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                          {ach.category || 'Other'}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">{ach.title}</h5>
                      </div>
                      {ach.issuer && <p className="text-[11px] text-slate-500 font-semibold">Issuer: {ach.issuer}</p>}
                      {ach.description && <p className="text-xs text-slate-600">{ach.description}</p>}
                    </div>
                    {ach.date && <span className="text-[10px] font-bold text-slate-400 shrink-0">{ach.date}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Premium Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
