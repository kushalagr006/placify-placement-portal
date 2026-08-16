import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle2, Building, BookOpen, CheckSquare, Square } from 'lucide-react';
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

const DEFAULT_COLLEGES = [
  { id: 'SSIPMT', code: 'SSIPMT', name: 'SSIPMT Raipur C.G' },
  { id: 'CSVTU', code: 'CSVTU', name: 'CSVTU Bhilai C.G' },
  { id: 'AMITY', code: 'AMITY', name: 'Amity University Raipur' },
  { id: 'BIT', code: 'BIT', name: 'BIT DURG' },
  { id: 'MAIC', code: 'MAIC', name: 'MAIC Raipur' },
  { id: 'SSPU', code: 'SSPU', name: 'SSPU Bhilai' },
];

export const CompanyPostJobTab = ({ onJobCreated }) => {
  const { addNewJob } = usePortal();
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pkg, setPkg] = useState('');
  const [location, setLocation] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [deadline, setDeadline] = useState('');
  const [jobType, setJobType] = useState('Full-Time Job');

  const [colleges, setColleges] = useState(DEFAULT_COLLEGES);
  const [selectedColleges, setSelectedColleges] = useState(DEFAULT_COLLEGES.map((c) => c.id || c._id || c.code));
  const [selectedBranches, setSelectedBranches] = useState(BRANCH_OPTIONS);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    authService
      .getColleges()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setColleges(data);
          setSelectedColleges(data.map((c) => c.id || c._id || c.code));
        }
      })
      .catch((err) => {
        console.log('Using default colleges fallback list for job posting:', err);
      });
  }, []);

  const toggleCollege = (collegeId) => {
    if (selectedColleges.includes(collegeId)) {
      setSelectedColleges(selectedColleges.filter((id) => id !== collegeId));
    } else {
      setSelectedColleges([...selectedColleges, collegeId]);
    }
  };

  const toggleAllColleges = () => {
    const allIds = colleges.map((c) => c.id || c._id || c.code);
    if (selectedColleges.length === allIds.length) {
      setSelectedColleges([]);
    } else {
      setSelectedColleges(allIds);
    }
  };

  const toggleBranch = (branchName) => {
    if (selectedBranches.includes(branchName)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== branchName));
    } else {
      setSelectedBranches([...selectedBranches, branchName]);
    }
  };

  const toggleAllBranches = () => {
    if (selectedBranches.length === BRANCH_OPTIONS.length) {
      setSelectedBranches([]);
    } else {
      setSelectedBranches(BRANCH_OPTIONS);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedColleges.length === 0) {
      setErrorMsg('Please select at least one eligible college for this drive.');
      return;
    }

    if (selectedBranches.length === 0) {
      setErrorMsg('Please select at least one eligible academic branch.');
      return;
    }

    setLoading(true);

    const res = await addNewJob({
      title: jobTitle,
      description,
      package: pkg,
      location,
      eligibility,
      deadline,
      colleges: selectedColleges,
      branches: selectedBranches,
    });

    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setJobTitle('');
        setDescription('');
        setPkg('');
        setLocation('');
        setEligibility('');
        setDeadline('');
        setSelectedColleges(colleges.map((c) => c.id || c._id || c.code));
        setSelectedBranches(BRANCH_OPTIONS);
        if (onJobCreated) onJobCreated();
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <PlusCircle size={20} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-xl">Post New Job / Internship</h2>
            <p className="text-xs text-slate-500 font-medium">Create a multi-college recruitment drive for targeted candidates</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold text-center">
          {errorMsg}
        </div>
      )}

      {submitted ? (
        <div className="text-center py-12 space-y-3">
          <CheckCircle2 size={54} className="text-emerald-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-slate-900">Job Opening Published!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {jobTitle} is now live on the Student Portal for eligible colleges and branches.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Job Title & Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Software Development Engineer - I (SDE-1)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Employment Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Full-Time Job">Full-Time Job</option>
                <option value="6-Month Internship">6-Month Internship</option>
                <option value="Summer Internship">Summer Internship</option>
              </select>
            </div>
          </div>

          {/* MULTI-COLLEGE ELIGIBILITY SELECTION SECTION */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building size={16} className="text-blue-600" /> Select Eligible Colleges / Institutions <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={toggleAllColleges}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                {selectedColleges.length === colleges.length ? 'Deselect All' : 'Select All Colleges'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {colleges.map((c) => {
                const cid = c.id || c._id || c.code;
                const isSelected = selectedColleges.includes(cid);
                return (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => toggleCollege(cid)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? <CheckSquare size={16} className="text-blue-600 shrink-0" /> : <Square size={16} className="text-slate-400 shrink-0" />}
                    <span className="truncate">{c.name || c.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MULTI-BRANCH ELIGIBILITY SELECTION SECTION */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <BookOpen size={16} className="text-blue-600" /> Select Eligible Academic Branches <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={toggleAllBranches}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                {selectedBranches.length === BRANCH_OPTIONS.length ? 'Deselect All' : 'Select All Branches'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BRANCH_OPTIONS.map((b) => {
                const isSelected = selectedBranches.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBranch(b)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? <CheckSquare size={16} className="text-blue-600 shrink-0" /> : <Square size={16} className="text-slate-400 shrink-0" />}
                    <span className="truncate">{b}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Package & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Package / Stipend <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 24.5 LPA or 85,000 / month"
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Job Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru, KA (Hybrid) or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {/* Eligibility & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Eligibility Criteria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CSE / IT with Min CGPA 7.5+"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Job Description & Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              required
              placeholder="Provide job details, key technical requirements, key responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 leading-relaxed"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>{loading ? 'Publishing Job Drive...' : 'Publish Targeted Job Drive'}</span>
          </button>

        </form>
      )}

    </div>
  );
};
