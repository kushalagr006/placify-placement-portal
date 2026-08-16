import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  User, 
  LogOut, 
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const StudentNavbar = ({ activeTab, setActiveTab, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { myApplications, currentUser, studentProfile } = usePortal();

  const appCount = myApplications.length;
  const isApproved = studentProfile?.verification_status === 'Approved';
  const isPending = studentProfile && studentProfile?.verification_status === 'Pending';
  const isRejected = studentProfile?.verification_status === 'Rejected';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'browse_jobs', label: 'Browse Jobs', icon: Briefcase },
    { 
      id: 'my_applications', 
      label: 'My Applications', 
      icon: FileText, 
      badge: appCount > 0 ? String(appCount) : null 
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const displayName = studentProfile?.user?.name || currentUser?.name || currentUser?.email?.split('@')[0] || 'Student Account';
  const displayEmail = studentProfile?.user?.email || currentUser?.email || '';
  const userInitials = displayName.substring(0, 2).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => isApproved && setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-md">
            💼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">
                Placify
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 uppercase">
                Student
              </span>
            </div>
          </div>
        </div>

        {/* Verification Status Pill if not Approved */}
        {!isApproved && (
          <div className="flex items-center gap-2">
            {isPending && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Clock size={13} /> Pending TPO Approval
              </span>
            )}
            {isRejected && (
              <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                <XCircle size={13} /> Verification Rejected
              </span>
            )}
          </div>
        )}

        {/* Header Nav Tabs (Only for Approved Students) */}
        {isApproved && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Student Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {userInitials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {studentProfile?.college?.code ? `${studentProfile.college.code} • ` : ''}{studentProfile?.branch || 'Student'}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 mr-1" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{displayName}</p>
                  <p className="text-[11px] text-slate-500">{displayEmail}</p>
                </div>
                {isApproved && (
                  <button
                    onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors mb-1"
                  >
                    <User size={15} />
                    <span>My Profile Settings</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={15} />
                  <span>Log Out / Switch Account</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
