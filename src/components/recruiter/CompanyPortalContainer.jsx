import React, { useState } from 'react';
import { CompanyNavbar } from './CompanyNavbar';
import { CompanyDashboardTab } from './CompanyDashboardTab';
import { CompanyPostJobTab } from './CompanyPostJobTab';
import { CompanyApplicationsTab } from './CompanyApplicationsTab';
import { CompanyProfileTab } from './CompanyProfileTab';

export const CompanyPortalContainer = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      
      {/* Employer Top Navbar with 4 tabs */}
      <CompanyNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <CompanyDashboardTab onNavigateToTab={setActiveTab} />
        )}

        {activeTab === 'post_job' && (
          <CompanyPostJobTab onJobCreated={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'applications' && (
          <CompanyApplicationsTab />
        )}

        {activeTab === 'company_profile' && (
          <CompanyProfileTab />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400 font-medium mt-auto">
        <p>© 2026 Placify • Employer Hiring Workspace</p>
      </footer>

    </div>
  );
};
