import React, { useState } from 'react';
import { TpoNavbar } from './TpoNavbar';
import { TpoSidebar } from './TpoSidebar';
import { TpoHero } from './TpoHero';
import { TpoMetrics } from './TpoMetrics';
import { TpoDrivesTable } from './TpoDrivesTable';
import { TpoApplicationsList } from './TpoApplicationsList';
import { TpoUpcomingDrives } from './TpoUpcomingDrives';
import { TpoStatsSection } from './TpoStatsSection';
import { AddCompanyModal, CreateDriveModal, AnnouncementModal } from './TpoModals';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const TpoAdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isCreateDriveOpen, setIsCreateDriveOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [reportToast, setReportToast] = useState(false);

  const handleGenerateReport = () => {
    setReportToast(true);
    setTimeout(() => {
      setReportToast(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      
      {/* Top Navbar */}
      <TpoNavbar 
        onLogout={onLogout} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Body Layout with Sidebar */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        
        {/* Sidebar Navigation */}
        <TpoSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={onLogout} 
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          
          {/* Toast Alert for Report Generation */}
          {reportToast && (
            <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <div className="text-xs">
                <p className="font-bold">Annual Placement Report Generated!</p>
                <p className="text-slate-400">Exported to PDF/Excel format successfully.</p>
              </div>
            </div>
          )}

          {/* HERO BANNER SECTION */}
          <TpoHero
            onAddCompany={() => setIsAddCompanyOpen(true)}
            onCreateDrive={() => setIsCreateDriveOpen(true)}
            onPublishAnnouncement={() => setIsAnnouncementOpen(true)}
            onGenerateReport={handleGenerateReport}
          />

          {/* 6 DASHBOARD KEY METRIC CARDS */}
          <TpoMetrics />

          {/* 4 MAIN SECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Recent Drives & Student Applications */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section 1: Recent Placement Drives */}
              <TpoDrivesTable />

              {/* Section 2: Recent Student Applications */}
              <TpoApplicationsList />
            </div>

            {/* Right Column: Upcoming Drives & Placement Statistics */}
            <div className="space-y-6">
              {/* Section 3: Upcoming Campus Drives */}
              <TpoUpcomingDrives />

              {/* Section 4: Placement Statistics */}
              <TpoStatsSection />
            </div>

          </div>

        </main>

      </div>

      {/* Modals */}
      <AddCompanyModal 
        isOpen={isAddCompanyOpen} 
        onClose={() => setIsAddCompanyOpen(false)} 
      />

      <CreateDriveModal 
        isOpen={isCreateDriveOpen} 
        onClose={() => setIsCreateDriveOpen(false)} 
      />

      <AnnouncementModal 
        isOpen={isAnnouncementOpen} 
        onClose={() => setIsAnnouncementOpen(false)} 
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400 font-medium mt-auto">
        <p>© 2026 Placement Portal • Training & Placement Officer (TPO) Admin System</p>
      </footer>

    </div>
  );
};
