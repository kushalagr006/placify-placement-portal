import React, { useState } from 'react';
import { TpoNavbar } from './TpoNavbar';
import { TpoDashboardTab } from './TpoDashboardTab';
import { TpoStudentsTab } from './TpoStudentsTab';
import { TpoCompaniesTab } from './TpoCompaniesTab';
import { TpoJobsTab } from './TpoJobsTab';
import { TpoAnnouncementsTab } from './TpoAnnouncementsTab';
import { TpoAdminProfileTab } from './TpoAdminProfileTab';
import { TpoApplicationsList } from './TpoApplicationsList';

export const TpoAdminPortalContainer = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      
      {/* TPO Navbar with tabs */}
      <TpoNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <TpoDashboardTab onNavigateToTab={setActiveTab} />
        )}

        {activeTab === 'students' && (
          <TpoStudentsTab />
        )}

        {activeTab === 'companies' && (
          <TpoCompaniesTab />
        )}

        {activeTab === 'jobs' && (
          <TpoJobsTab />
        )}

        {activeTab === 'selections' && (
          <TpoApplicationsList />
        )}

        {activeTab === 'announcements' && (
          <TpoAnnouncementsTab />
        )}

        {activeTab === 'profile' && (
          <TpoAdminProfileTab />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400 font-medium mt-auto">
        <p>© 2026 Placify • Training & Placement Officer (TPO) Admin System</p>
      </footer>

    </div>
  );
};
