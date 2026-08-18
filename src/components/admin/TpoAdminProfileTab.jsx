import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, Building, Phone, MapPin, Save, Briefcase, Trash2 } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { DeleteAccountModal } from '../DeleteAccountModal';

export const TpoAdminProfileTab = () => {
  const { currentUser, adminProfile, updateAdminProfile } = usePortal();

  const [name, setName] = useState(currentUser?.name || 'TPO Officer');
  const [designation, setDesignation] = useState(adminProfile?.designation || 'Head Placement Officer');
  const [department, setDepartment] = useState(adminProfile?.department || 'Training & Placement Cell');
  const [phone, setPhone] = useState(adminProfile?.phone || '');
  const [office, setOffice] = useState(adminProfile?.office || 'Main Building, TPO Block - Room 101');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.name) setName(currentUser.name);
    if (adminProfile) {
      if (adminProfile.designation) setDesignation(adminProfile.designation);
      if (adminProfile.department) setDepartment(adminProfile.department);
      if (adminProfile.phone !== undefined) setPhone(adminProfile.phone);
      if (adminProfile.office) setOffice(adminProfile.office);
    }
  }, [currentUser, adminProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    const res = await updateAdminProfile({
      name,
      designation,
      department,
      phone,
      office,
    });

    setSaving(false);
    if (res.success) {
      setSaveMsg('✓ Admin Profile updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } else {
      setSaveMsg(res.message || 'Failed to update profile');
    }
  };

  const email = currentUser?.email || 'admin@tpo.edu';
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900">{name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1">
                <ShieldCheck size={13} /> Official TPO Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {designation} • {department}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Email: {email}
            </p>
          </div>
        </div>

        {saveMsg && (
          <div className={`p-3 text-xs font-bold rounded-xl text-center ${
            saveMsg.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {saveMsg}
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5 flex items-center gap-1">
                <UserCheck size={13} /> Full Officer Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. V. K. Raman"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Official Designation */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5 flex items-center gap-1">
                <Briefcase size={13} /> Official Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Head Placement Officer (TPO)"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Department / Institution Cell */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5 flex items-center gap-1">
                <Building size={13} /> Department / Cell Name
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Training & Placement Cell (T&P)"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5 flex items-center gap-1">
                <Phone size={13} /> Official Contact Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

          </div>

          {/* Office Location */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5 flex items-center gap-1">
              <MapPin size={13} /> Office Location / Room Details
            </label>
            <input
              type="text"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              placeholder="e.g. Main Administrative Block, TPO Wing - Room 101"
              className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Readonly Email Info Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-800">Admin Account Email</p>
              <p className="text-slate-500 font-medium">{email}</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold">
              System Registered
            </span>
          </div>

          {/* Assigned College Information Box */}
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-blue-950 flex items-center gap-1.5">
                <Building size={14} className="text-blue-600" /> Assigned Institution / College
              </p>
              <p className="text-blue-800 font-semibold mt-0.5">
                {adminProfile?.college?.name || 'Unassigned / Global College'}
                {adminProfile?.college?.code ? ` (${adminProfile.college.code})` : ''}
              </p>
              {adminProfile?.college?.location && (
                <p className="text-blue-600 text-[11px] font-medium mt-0.5">
                  Location: {adminProfile.college.location}
                </p>
              )}
            </div>
            <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-bold shadow-xs">
              {adminProfile?.college?.status || 'Active'}
            </span>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={15} />
              <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>

      {/* Danger Zone: Delete TPO Admin Account */}
      <div className="bg-red-50/60 rounded-2xl border border-red-200/80 p-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-red-950 text-sm flex items-center gap-2">
            <Trash2 size={16} className="text-red-600" /> Danger Zone: Delete TPO Admin Account
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Permanently erase your TPO Admin credentials and officer profile details.
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
        roleLabel="TPO Admin Account"
      />

    </div>
  );
};
