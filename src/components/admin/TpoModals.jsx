import React, { useState } from 'react';
import { X, Building2, PlusCircle, Megaphone, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

/* 1. ADD COMPANY MODAL */
export const AddCompanyModal = ({ isOpen, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
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
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 size={42} className="text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-900">Company Onboarded!</h3>
            <p className="text-xs text-slate-500 mt-1">{companyName} added to TPO partner network.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-blue-600" size={20} />
              <h3 className="text-lg font-extrabold text-slate-900">Add Hiring Partner Company</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Razorpay / Google"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">Official Portal Website</label>
              <input
                type="url"
                placeholder="https://company.com/careers"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all">
              Save Company Partner
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* 2. CREATE DRIVE MODAL */
export const CreateDriveModal = ({ isOpen, onClose }) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
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
            <h3 className="text-lg font-bold text-slate-900">Placement Drive Published!</h3>
            <p className="text-xs text-slate-500 mt-1">{role} drive is now live for eligible students.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <PlusCircle className="text-blue-600" size={20} />
              <h3 className="text-lg font-extrabold text-slate-900">Create Campus Recruitment Drive</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy"
                  required
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">Job Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. SDE-1 / APM"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">Package CTC / Stipend</label>
              <input
                type="text"
                placeholder="e.g. 18.0 LPA / 75,000 / month"
                required
                value={pkg}
                onChange={e => setPkg(e.target.value)}
                className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-blue-600"
              />
            </div>

            <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all">
              Publish Recruitment Drive
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* 3. PUBLISH ANNOUNCEMENT MODAL */
export const AnnouncementModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 size={42} className="text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-900">Announcement Broadcasted!</h3>
            <p className="text-xs text-slate-500 mt-1">Notice sent to all registered student inboxes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="text-purple-600" size={20} />
              <h3 className="text-lg font-extrabold text-slate-900">Publish Campus TPO Notice</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">Notice Title</label>
              <input
                type="text"
                placeholder="e.g. OA Schedule / Resume Verification"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-10 px-3.5 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">Details & Message</label>
              <textarea
                rows="3"
                placeholder="Write notice instructions..."
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full p-3 bg-white text-slate-900 text-xs font-medium border border-slate-200 rounded-xl outline-none focus:border-purple-600"
              ></textarea>
            </div>

            <button type="submit" className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all">
              Broadcast Notice
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
