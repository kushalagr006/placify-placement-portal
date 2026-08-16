import React, { useState } from 'react';
import { CompanyNavbar } from './CompanyNavbar';
import { CompanySidebar } from './CompanySidebar';
import { CompanyBanner } from './CompanyBanner';
import { CompanySummaryCards } from './CompanySummaryCards';
import { CompanyPostedJobs } from './CompanyPostedJobs';
import { CompanyApplicationsTable } from './CompanyApplicationsTable';
import { CompanyPostJobModal } from './CompanyModals';

export const CompanyDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      
      {/* Navbar */}
      <CompanyNavbar onLogout={onLogout} />

      {/* Main Body Layout with Sidebar */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        
        {/* Sidebar */}
        <CompanySidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={onLogout}
          onOpenPostJob={() => setIsPostJobOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          
          {/* Welcome Banner */}
          <CompanyBanner onOpenPostJob={() => setIsPostJobOpen(true)} />

          {/* 4 Summary Cards */}
          <CompanySummaryCards />

          {/* Posted Jobs Section */}
          <CompanyPostedJobs />

          {/* Recent Applications Table */}
          <CompanyApplicationsTable />

        </main>

      </div>

      {/* Post Job Modal */}
      <CompanyPostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400 font-medium mt-auto">
        <p>© 2026 Placement Portal • Employer Hiring Workspace</p>
      </footer>

    </div>
  );
};
