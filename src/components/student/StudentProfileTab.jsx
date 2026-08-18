import React, { useState, useEffect } from 'react';
import {
  Plus,
  UploadCloud,
  FileText,
  Eye,
  Trash2,
  Globe,
  Award,
  Code2,
  ExternalLink,
  Edit2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { studentService } from '../../services/studentService';
import { DeleteAccountModal } from '../DeleteAccountModal';

export const StudentProfileTab = () => {
  const {
    currentUser,
    studentProfile,
    updateStudentProfile,
    addStudentLink,
    deleteStudentLink,
    addStudentAchievement,
    deleteStudentAchievement,
    addStudentProject,
    deleteStudentProject,
    refreshPortalData,
  } = usePortal();

  const [branch, setBranch] = useState(studentProfile?.branch || 'Computer Science');
  const [semester, setSemester] = useState(studentProfile?.semester || 8);
  const [cgpa, setCgpa] = useState(studentProfile?.cgpa || 8.5);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [phone, setPhone] = useState(studentProfile?.phone || '');
  const [resumeName, setResumeName] = useState(studentProfile?.resume || '');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Link Form State
  const [linkTitle, setLinkTitle] = useState('GitHub');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkErr, setLinkErr] = useState('');

  // Achievement Form State
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState('Hackathon');
  const [achDesc, setAchDesc] = useState('');
  const [achIssuer, setAchIssuer] = useState('');
  const [achDate, setAchDate] = useState('');
  const [achErr, setAchErr] = useState('');

  // Project Form State
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');
  const [projErr, setProjErr] = useState('');

  useEffect(() => {
    if (studentProfile) {
      if (studentProfile.branch) setBranch(studentProfile.branch);
      if (studentProfile.semester) setSemester(studentProfile.semester);
      if (studentProfile.cgpa) setCgpa(studentProfile.cgpa);
      if (studentProfile.phone !== undefined) setPhone(studentProfile.phone);
      if (studentProfile.resume) setResumeName(studentProfile.resume);
      if (studentProfile.skills) {
        setSkills(
          typeof studentProfile.skills === 'string'
            ? studentProfile.skills.split(',').map((s) => s.trim()).filter(Boolean)
            : studentProfile.skills
        );
      }
    }
  }, [studentProfile]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handlePdfFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadMsg('Error: Please select a valid .pdf document');
      return;
    }
    setUploadingPdf(true);
    setUploadMsg('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await studentService.uploadResume(formData);
      setResumeName(res.filename);
      setUploadMsg('✓ PDF Resume uploaded and saved successfully!');
      await refreshPortalData();
    } catch (err) {
      setUploadMsg(err.response?.data?.detail || 'PDF Upload failed');
    } finally {
      setUploadingPdf(false);
      setTimeout(() => setUploadMsg(''), 4000);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    const res = await updateStudentProfile({
      branch: branch || 'Computer Science',
      semester: semester ? parseInt(semester, 10) : 8,
      cgpa: cgpa ? parseFloat(cgpa) : 8.5,
      skills: Array.isArray(skills) ? skills.join(', ') : skills,
      phone,
      resume: resumeName,
    });
    setSaving(false);
    if (res.success) {
      setSaveMsg('Profile saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } else {
      setSaveMsg(res.message || 'Failed to update profile');
    }
  };

  const normalizeUrl = (url) => {
    if (!url || !url.trim()) return '';
    let trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = `https://${trimmed}`;
    }
    return trimmed;
  };

  // Add Link Handler
  const handleAddLink = async (e) => {
    e.preventDefault();
    setLinkErr('');
    const normalized = normalizeUrl(linkUrl);
    if (!normalized) {
      setLinkErr('Please enter a valid website URL');
      return;
    }
    const res = await addStudentLink({ title: linkTitle, url: normalized });
    if (res.success) {
      setLinkUrl('');
    } else {
      setLinkErr(res.message);
    }
  };

  // Add Achievement Handler
  const handleAddAchievement = async (e) => {
    e.preventDefault();
    setAchErr('');
    if (!achTitle.trim()) {
      setAchErr('Title is required');
      return;
    }
    const res = await addStudentAchievement({
      title: achTitle,
      category: achCategory,
      description: achDesc,
      issuer: achIssuer,
      date: achDate,
    });
    if (res.success) {
      setAchTitle('');
      setAchDesc('');
      setAchIssuer('');
      setAchDate('');
    } else {
      setAchErr(res.message);
    }
  };

  // Add Project Handler
  const handleAddProject = async (e) => {
    e.preventDefault();
    setProjErr('');
    if (!projName.trim()) {
      setProjErr('Project name is required');
      return;
    }

    const normalizedGithub = projGithub ? normalizeUrl(projGithub) : '';
    const normalizedLive = projLive ? normalizeUrl(projLive) : '';

    const res = await addStudentProject({
      name: projName,
      description: projDesc,
      technologies: projTech,
      github_link: normalizedGithub,
      live_link: normalizedLive,
    });

    if (res.success) {
      setProjName('');
      setProjDesc('');
      setProjTech('');
      setProjGithub('');
      setProjLive('');
    } else {
      setProjErr(res.message);
    }
  };

  const studentName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Student';
  const email = currentUser?.email || '';
  const initials = studentName.substring(0, 2).toUpperCase();

  const pdfViewUrl =
    resumeName && resumeName.includes('resume-')
      ? `http://127.0.0.1:5000/uploads/resumes/${resumeName}`
      : null;

  const externalLinks = studentProfile?.external_links || [];
  const achievements = studentProfile?.achievements || [];
  const projects = studentProfile?.projects || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Basic Academic Profile */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900">{studentName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Email: {email}</p>
          </div>
        </div>

        {saveMsg && (
          <div
            className={`p-3 text-xs font-bold rounded-xl text-center ${
              saveMsg.includes('successfully')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {saveMsg}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Academic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Academic Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Semester (1-8)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. 8"
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                CGPA (0.0 - 10.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 8.5"
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Phone / Mobile Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter mobile number (e.g. +91 9876543210)"
              className="w-full max-w-sm h-9 px-3 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* PDF RESUME UPLOAD SECTION */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-slate-900 text-sm">Resume Document (.pdf)</h3>
            <div className="p-5 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 rounded-2xl transition-all">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      {resumeName ? `Uploaded: ${resumeName}` : 'Upload your PDF Resume'}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Max file size: 10MB • Format: PDF (.pdf)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {pdfViewUrl && (
                    <a
                      href={pdfViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Eye size={14} />
                      <span>View PDF</span>
                    </a>
                  )}

                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                    <UploadCloud size={16} />
                    <span>{uploadingPdf ? 'Uploading...' : 'Choose PDF File'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfFileSelect}
                      disabled={uploadingPdf}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {uploadMsg && (
                <div
                  className={`mt-3 text-xs font-bold text-center ${
                    uploadMsg.includes('✓') ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {uploadMsg}
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-slate-900 text-sm">Technical Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium">No skills added yet.</p>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl text-xs border border-blue-100 shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2 max-w-sm pt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add new skill..."
                className="flex-1 h-9 px-3 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none focus:border-blue-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* 🌐 EXTERNAL LINKS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Globe size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">External Links & Social Profiles</h3>
            <p className="text-xs text-slate-500 font-medium">Link your GitHub, LinkedIn, LeetCode, or Portfolio</p>
          </div>
        </div>

        {/* Existing Links List */}
        <div className="space-y-2">
          {externalLinks.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium italic">No external links added yet.</p>
          ) : (
            externalLinks.map((link) => (
              <div
                key={link._id || link.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-[11px] font-extrabold">
                    {link.title}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>{link.url}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => deleteStudentLink(link._id || link.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Link"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Link Form */}
        <form onSubmit={handleAddLink} className="p-4 bg-slate-50 rounded-xl space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase">Add External Profile Link</h4>
          
          {linkErr && <div className="text-xs text-red-600 font-bold">{linkErr}</div>}

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl outline-none"
            >
              <option value="GitHub">GitHub</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="LeetCode">LeetCode</option>
              <option value="Portfolio">Portfolio</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="e.g. github.com/yourusername or https://..."
              className="flex-1 h-9 px-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none focus:border-purple-600"
              required
            />

            <button
              type="submit"
              className="px-4 h-9 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Link
            </button>
          </div>
        </form>
      </div>

      {/* 🏆 ACHIEVEMENTS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Achievements & Certifications</h3>
            <p className="text-xs text-slate-500 font-medium">Highlight hackathons, awards, certifications, and competitions</p>
          </div>
        </div>

        {/* Existing Achievements List */}
        <div className="space-y-3">
          {achievements.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium italic">No achievements recorded yet.</p>
          ) : (
            achievements.map((ach) => (
              <div
                key={ach._id || ach.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                      {ach.category || 'Other'}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-xs">{ach.title}</h4>
                  </div>
                  {ach.issuer && <p className="text-[11px] text-slate-500 font-semibold">Issuer / Organizer: {ach.issuer}</p>}
                  {ach.description && <p className="text-xs text-slate-600">{ach.description}</p>}
                  {ach.date && <p className="text-[10px] text-slate-400 font-bold">Date: {ach.date}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => deleteStudentAchievement(ach._id || ach.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                  title="Delete Achievement"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Achievement Form */}
        <form onSubmit={handleAddAchievement} className="p-4 bg-slate-50 rounded-xl space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase">Add New Achievement / Certification</h4>
          
          {achErr && <div className="text-xs text-red-600 font-bold">{achErr}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={achTitle}
              onChange={(e) => setAchTitle(e.target.value)}
              placeholder="Achievement / Award Title *"
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
              required
            />

            <select
              value={achCategory}
              onChange={(e) => setAchCategory(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl outline-none"
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Certification">Certification</option>
              <option value="Award">Award</option>
              <option value="Competition">Competition</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              value={achIssuer}
              onChange={(e) => setAchIssuer(e.target.value)}
              placeholder="Issuing Organization (e.g. AWS, Smart India Hackathon)"
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
            />

            <input
              type="text"
              value={achDate}
              onChange={(e) => setAchDate(e.target.value)}
              placeholder="Date / Month Year (e.g. Aug 2026)"
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
            />
          </div>

          <textarea
            value={achDesc}
            onChange={(e) => setAchDesc(e.target.value)}
            placeholder="Short description of achievement or rank..."
            rows="2"
            className="w-full p-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 h-9 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Achievement
            </button>
          </div>
        </form>
      </div>

      {/* 🚀 PROJECTS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Code2 size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Projects & Technical Works</h3>
            <p className="text-xs text-slate-500 font-medium">Showcase personal or academic projects with repository and live links</p>
          </div>
        </div>

        {/* Existing Projects List */}
        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium italic">No projects added yet.</p>
          ) : (
            projects.map((proj) => (
              <div
                key={proj._id || proj.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{proj.name}</h4>
                  {proj.description && <p className="text-xs text-slate-600">{proj.description}</p>}

                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.split(',').map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    {proj.github_link && (
                      <a
                        href={proj.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                      >
                        <ExternalLink size={12} /> GitHub Repo
                      </a>
                    )}
                    {proj.live_link && (
                      <a
                        href={proj.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={12} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteStudentProject(proj._id || proj.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject} className="p-4 bg-slate-50 rounded-xl space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase">Add Technical Project</h4>
          
          {projErr && <div className="text-xs text-red-600 font-bold">{projErr}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              placeholder="Project Name *"
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
              required
            />

            <input
              type="text"
              value={projTech}
              onChange={(e) => setProjTech(e.target.value)}
              placeholder="Technologies Used (e.g. React, Node.js, MongoDB)"
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
            />

            <input
              type="text"
              value={projGithub}
              onChange={(e) => setProjGithub(e.target.value)}
              placeholder="GitHub Repository URL (e.g. github.com/user/repo)"
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
            />

            <input
              type="text"
              value={projLive}
              onChange={(e) => setProjLive(e.target.value)}
              placeholder="Live Demo / Website URL (e.g. myproject.vercel.app)"
              className="h-9 px-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
            />
          </div>

          <textarea
            value={projDesc}
            onChange={(e) => setProjDesc(e.target.value)}
            placeholder="Project summary and key features..."
            rows="2"
            className="w-full p-3 bg-white border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Delete Student Account */}
      <div className="bg-red-50/60 rounded-2xl border border-red-200/80 p-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-red-950 text-sm flex items-center gap-2">
            <Trash2 size={16} className="text-red-600" /> Danger Zone: Delete Student Account
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Permanently erase your student profile, resumes, skills, external links, achievements, projects, and application records.
          </p>
        </div>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm shrink-0 cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        roleLabel="Student Account"
      />
    </div>
  );
};
