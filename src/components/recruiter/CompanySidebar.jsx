import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  FileText, 
  Building2, 
  LogOut 
} from 'lucide-react';

export const CompanySidebar = ({ activeTab, setActiveTab, onLogout, onOpenPostJob }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'post_job', label: 'Post Job', icon: PlusCircle, isAction: true },
    { id: 'posted_jobs', label: 'Posted Jobs', icon: Briefcase, badge: '4' },
    { id: 'applications', label: 'Applications', icon: FileText, badge: '184' },
    { id: 'profile', label: 'Company Profile', icon: Building2 },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden lg:flex flex-shrink-0">
      
      {/* Navigation Items */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Company Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction) {
                  onOpenPostJob();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout System</span>
        </button>
      </div>

    </aside>
  );
};
