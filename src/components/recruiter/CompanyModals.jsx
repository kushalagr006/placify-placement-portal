import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Briefcase } from 'lucide-react';

export const CompanyPostJobModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Full-Time Job');
  const [location, setLocation] = useState('');
  const [pkg, setPkg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 size={42} className="text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-900">Job Posted Successfully!</h3>
            <p className="text-xs text-slate-500 mt-1">{title} opening is now active for campus applicants.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="text-blue-600" size={20} />
              <h3 className="text-lg font-extrabold text-slate-900">Post New Job / Internship</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer / Design Intern"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">Job Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                >
                  <option value="Full-Time Job">Full-Time Job</option>
                  <option value="6-Month Internship">6-Month Internship</option>
                  <option value="Summer Internship">Summer Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote / Bengaluru"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">Package CTC / Stipend</label>
              <input
                type="text"
                placeholder="e.g. 24.5 LPA or 85,000 / month"
                required
                value={pkg}
                onChange={e => setPkg(e.target.value)}
                className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600"
              />
            </div>

            <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all">
              Publish Opening
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
