import React, { useState, useEffect } from 'react';
import { Building2, User, Mail, Globe, CheckCircle2, Save, Trash2 } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { DeleteAccountModal } from '../DeleteAccountModal';

export const CompanyProfileTab = () => {
  const { currentUser, companyProfile, updateCompanyProfile } = usePortal();

  const [companyName, setCompanyName] = useState(companyProfile?.company_name || '');
  const [hrName, setHrName] = useState(companyProfile?.hr_name || currentUser?.name || '');
  const [email, setEmail] = useState(companyProfile?.user?.email || currentUser?.email || '');
  const [website, setWebsite] = useState(companyProfile?.website || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (companyProfile) {
      setCompanyName(companyProfile.company_name || '');
      setHrName(companyProfile.hr_name || currentUser?.name || '');
      setWebsite(companyProfile.website || '');
    }
  }, [companyProfile, currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
    if (currentUser?.name && !hrName) {
      setHrName(currentUser.name);
    }
  }, [currentUser, hrName]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    let formattedWebsite = website.trim();
    if (formattedWebsite && !formattedWebsite.startsWith('http://') && !formattedWebsite.startsWith('https://')) {
      formattedWebsite = `https://${formattedWebsite}`;
    }

    const res = await updateCompanyProfile({
      company_name: companyName,
      hr_name: hrName,
      website: formattedWebsite,
    });

    setSaving(false);

    if (res.success) {
      setWebsite(formattedWebsite);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const logoText = companyName
    ? companyName.substring(0, 2).toUpperCase()
    : (hrName || 'CO').substring(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {logoText}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {companyName || 'Company Profile Setup'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                Verified Employer
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              HR Representative: <strong className="text-slate-700">{hrName || 'Not Set'}</strong>
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Profile Details Form */}
        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Company / Organization Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter official company name (e.g. Google, TechCorp)"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {/* HR Name */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              HR Representative / Recruiter Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={hrName}
                onChange={(e) => setHrName(e.target.value)}
                placeholder="Enter HR full name"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              HR Contact Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="email"
                disabled
                value={email}
                className="w-full h-11 pl-10 pr-4 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium rounded-xl outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Official Website URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.company.com"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Company Profile'}</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              <span>Company profile updated successfully!</span>
            </div>
          )}

        </form>

      </div>

      {/* Danger Zone: Delete Recruiter Account */}
      <div className="bg-red-50/60 rounded-2xl border border-red-200/80 p-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-red-950 text-sm flex items-center gap-2">
            <Trash2 size={16} className="text-red-600" /> Danger Zone: Delete Company Account
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Permanently erase your company account, posted job drives, and candidate applications.
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
        roleLabel="Company Account"
      />

    </div>
  );
};
