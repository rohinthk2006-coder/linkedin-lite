import React, { useState } from 'react';
import { JobCard } from './JobCard';
import { EmptyState } from './EmptyState';
import { mockJobs } from '../data/mockJobs';
import { Briefcase, Search, MapPin, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

export const JobsView = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  const jobTypes = ['All', 'Internships', 'Full-Time', 'Freelance'];
  const experienceLevels = ['All', 'Student / Fresher', 'Entry Level / Student', '0-2 Years', '1-3 Years'];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = 
      !locationQuery || job.location.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesLevel = selectedLevel === 'All' || job.experienceLevel === selectedLevel;
    return matchesSearch && matchesLocation && matchesType && matchesLevel;
  });

  const handleApplySuccess = (job) => {
    setApplicationSuccess(job);
    setTimeout(() => {
      setApplicationSuccess(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-cyan-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Opportunities & Internships</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Find Roles Matched to Your Proof Chain
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 leading-relaxed">
            Discover internships and engineering roles filtered by verified skills, project proof, and automatic skill match percentages.
          </p>
        </div>
      </div>

      {/* Application Success Notification Toast */}
      {applicationSuccess && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Application Sent! </span>
              Your LinkSphere verified profile was submitted to {applicationSuccess.company} for {applicationSuccess.title}.
            </div>
          </div>
          <button
            onClick={() => setApplicationSuccess(null)}
            className="text-white/80 hover:text-white text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Box */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, skill (e.g. React), or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Location Search */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by location (e.g. Bangalore, Remote)..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Job Type Pills */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-slate-800 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase text-gray-400 dark:text-slate-500 shrink-0">
            Type:
          </span>
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}

          {/* Experience level selector */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="ml-auto text-xs px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-hidden shrink-0"
          >
            {experienceLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl === 'All' ? 'All Experience Levels' : lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Cards List */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found matching your criteria"
          description="Try clearing your search terms or expanding to remote roles."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchQuery('');
            setLocationQuery('');
            setSelectedType('All');
            setSelectedLevel('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplySuccess={handleApplySuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
};
