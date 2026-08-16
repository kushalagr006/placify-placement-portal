import React, { useState } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const StudentBrowseJobsTab = ({ onApplyJob }) => {
  const { jobs } = usePortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || '';
    const company = job.company?.company_name || job.company || '';
    const location = job.location || '';
    const type = job.type || 'Full Time Job';

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'All' ||
      (filterType === 'Job' && type.includes('Job')) ||
      (filterType === 'Internship' && type.includes('Internship'));

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Browse Placement & Internship Opportunities</h2>
          <p className="text-xs text-slate-500 font-medium">Explore active openings from verified company partners</p>
        </div>

        {/* Search Input & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company name, location..."
              className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['All', 'Job', 'Internship'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Briefcase size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No openings found matching your search.</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const companyName = job.company?.company_name || job.company || 'Company';
            const logoText = companyName.substring(0, 2).toUpperCase();
            const jobType = job.type || 'Full Time Job';

            return (
              <div
                key={job.job_id || job.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-sm bg-indigo-600"
                      >
                        {logoText}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{companyName}</span>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">{job.title}</h3>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      jobType.includes('Job') ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {jobType}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl mb-4 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">💰 {job.package || 'Competitive'}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin size={13} /> {job.location || 'Remote'}
                    </span>
                    <span className="text-blue-600">{job.eligibility || 'Open Criteria'}</span>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-2">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Deadline: {job.deadline}</span>
                  <button
                    onClick={() => onApplyJob(job)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
