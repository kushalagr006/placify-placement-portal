import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Building2, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const CompanyNavbar = ({ activeTab, setActiveTab, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { currentUser, companyProfile, myApplications } = usePortal();

  const totalApplications = myApplications?.length || 0;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'post_job', label: 'Post Job', icon: PlusCircle },
    { 
      id: 'applications', 
      label: 'Applications', 
      icon: FileText, 
      badge: totalApplications > 0 ? String(totalApplications) : null 
    },
    { id: 'company_profile', label: 'Company Profile', icon: Building2 },
  ];

  const displayName = companyProfile?.hr_name || currentUser?.name || currentUser?.email?.split('@')[0] || 'Recruiter';
  const companyTitle = companyProfile?.company_name || 'Employer Space';
  const userInitials = displayName.substring(0, 2).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-md">
            💼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">
                Placify
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 uppercase">
                Employer Space
              </span>
            </div>
          </div>
        </div>

        {/* 4 Header Nav Tabs */}
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

        {/* Recruiter Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {userInitials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {companyTitle}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 mr-1" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{displayName}</p>
                  <p className="text-[11px] text-slate-500">{currentUser?.email || 'recruiter@company.com'}</p>
                </div>
                <button
                  onClick={() => { setActiveTab('company_profile'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors mb-1"
                >
                  <Building2 size={15} />
                  <span>Company Profile</span>
                </button>
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
