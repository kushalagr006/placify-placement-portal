import React, { useState } from 'react';
import { Building2, CheckCircle2, XCircle } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoCompaniesTab = () => {
  const { companies } = usePortal();
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Partner Companies & Employer Registrations</h2>
            <p className="text-xs text-slate-500 font-medium">Verify hiring partner registrations and grant campus recruitment access</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
          {companies.length} Companies Total
        </span>
      </div>

      {/* Companies List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
              <th className="pb-3 pl-1">Company Name</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">HR Representative</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {companies.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400 font-medium">
                  No registered companies found in database.
                </td>
              </tr>
            ) : (
              companies.map((comp) => {
                const compName = comp.company_name || 'Company';
                const logoText = compName.substring(0, 2).toUpperCase();

                return (
                  <tr key={comp.company_id || comp.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Company Name & Website */}
                    <td className="py-3.5 pl-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow-sm flex-shrink-0 bg-blue-600"
                        >
                          {logoText}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{compName}</span>
                          {comp.website && (
                            <a href={comp.website} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-semibold hover:underline">
                              {comp.website}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 font-bold text-slate-700">
                      {comp.location || 'N/A'}
                    </td>

                    {/* HR Representative */}
                    <td className="py-3.5">
                      <span className="font-bold text-slate-900 block">{comp.hr_name || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{comp.user?.email || 'N/A'}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${comp.is_verified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {comp.is_verified ? 'Verified Partner' : 'Registered'}
                      </span>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
