import React, { useState } from 'react';
import { MapPin, Briefcase, Sparkles, CheckCircle2, Building2, Send, X, ArrowUpRight } from 'lucide-react';

export const JobCard = ({ job, onApplySuccess }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [note, setNote] = useState('');

  if (!job) return null;

  const handleApply = (e) => {
    e.preventDefault();
    setApplied(true);
    setShowApplyModal(false);
    if (onApplySuccess) onApplySuccess(job);
  };

  const getMatchColor = (pct) => {
    if (pct >= 90) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (pct >= 80) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  };

  return (
    <>
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 transition duration-200 flex flex-col justify-between">
        <div>
          {/* Header row: Company logo + Title + Match Badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start space-x-3">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-slate-700 shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white hover:text-blue-600 transition">
                  {job.title}
                </h3>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                  {job.company}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-gray-500 dark:text-slate-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="px-1.5 py-0.2 rounded-sm bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-medium">
                    {job.workplaceType}
                  </span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
              </div>
            </div>

            {/* Skill Match Gauge */}
            {job.skillMatchPercentage && (
              <div className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border flex items-center gap-1 shrink-0 ${getMatchColor(job.skillMatchPercentage)}`}>
                <Sparkles className="w-3 h-3" />
                <span>{job.skillMatchPercentage}% Match</span>
              </div>
            )}
          </div>

          {/* Stipend / Salary & Experience */}
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50/80 dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-800 mb-3 text-xs">
            <span className="font-bold text-gray-900 dark:text-white">{job.stipend}</span>
            <span className="text-gray-500 dark:text-slate-400 font-medium">{job.experienceLevel}</span>
          </div>

          <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {job.description}
          </p>

          {/* Required Skills Chips */}
          {job.requiredSkills && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-gray-400 dark:text-slate-500">
            {job.postedDate} • {job.applicantsCount} applicants
          </span>

          {applied ? (
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Applied
            </span>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span>{job.isEasyApply ? 'Easy Apply' : 'View Opportunity'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-lg border border-gray-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Apply to {job.company}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">{job.title} • {job.location}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-5 space-y-4">
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200">
                <p className="font-semibold mb-1">Your LinkSphere Verified Profile will be submitted:</p>
                <p className="text-[11px] opacity-80">• Proof Chain skill scores & certifications attached</p>
                <p className="text-[11px] opacity-80">• Projects and GitHub repositories included</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Cover Note / Why you're a good fit (Optional)
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Mention relevant projects or why you'd love to work with the team..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
