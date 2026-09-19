import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Users, 
  FolderGit2, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Plus, 
  ChevronRight, 
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export const Sidebar = ({ 
  onNavigateProfile, 
  onNavigateProjects, 
  onNavigateNetwork,
  onAddGithub,
  onAddProject,
  onAddCert
}) => {
  const { user } = useAuth();
  const completeness = user?.profileCompleteness || 72;
  const projectCount = user?.projectCount || 4;
  const skillCount = user?.skillCount || 8;
  const connectionCount = user?.connectionCount || 18;

  return (
    <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Cover Banner Header */}
      <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/10" />
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.firstName}
            className="w-18 h-18 rounded-full border-4 border-white dark:border-[#131b2e] object-cover absolute left-1/2 transform -translate-x-1/2 top-12 shadow-md cursor-pointer hover:opacity-90 transition"
            onClick={onNavigateProfile}
          />
        ) : (
          <div 
            onClick={onNavigateProfile}
            className="w-18 h-18 rounded-full border-4 border-white dark:border-[#131b2e] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black absolute left-1/2 transform -translate-x-1/2 top-12 shadow-md cursor-pointer"
          >
            {user?.firstName?.charAt(0)}
          </div>
        )}
      </div>

      {/* User Info Details */}
      <div className="pt-10 pb-4 px-4 text-center">
        <h2 
          onClick={onNavigateProfile} 
          className="text-base font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition flex items-center justify-center gap-1.5"
        >
          <span>{user?.firstName} {user?.lastName}</span>
          {user?.role === 'ROLE_ADMIN' && (
            <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" title="Administrator" />
          )}
        </h2>

        <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 line-clamp-2">
          {user?.headline || 'Full-Stack Developer • Student & Builder'}
        </p>

        {/* Department / Field Tag */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-100 dark:border-blue-900/50">
          <GraduationCap className="w-3 h-3" />
          <span>Computer Science & Engineering</span>
        </div>

        {user?.location && (
          <div className="flex items-center justify-center text-[11px] text-gray-500 dark:text-slate-400 mt-1.5">
            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
            <span>{user.location}</span>
          </div>
        )}
      </div>

      {/* Profile Strength Progress Widget */}
      <div className="border-t border-gray-100 dark:border-slate-800 p-4 bg-gray-50/50 dark:bg-slate-900/40">
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span className="flex items-center text-gray-700 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500" />
            Profile Strength
          </span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">{completeness}%</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* Stats Counter: Connections, Projects, Skills */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-slate-800 border-t border-gray-100 dark:border-slate-800 py-3 text-center text-xs">
        <button 
          onClick={onNavigateNetwork} 
          className="hover:bg-gray-50 dark:hover:bg-slate-800/60 py-1 transition cursor-pointer"
        >
          <span className="font-extrabold text-gray-900 dark:text-white block text-sm">{connectionCount}</span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">Connections</span>
        </button>

        <button 
          onClick={onNavigateProjects} 
          className="hover:bg-gray-50 dark:hover:bg-slate-800/60 py-1 transition cursor-pointer"
        >
          <span className="font-extrabold text-gray-900 dark:text-white block text-sm">{projectCount}</span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">Projects</span>
        </button>

        <button 
          onClick={onNavigateProfile} 
          className="hover:bg-gray-50 dark:hover:bg-slate-800/60 py-1 transition cursor-pointer"
        >
          <span className="font-extrabold text-gray-900 dark:text-white block text-sm">{skillCount}</span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">Skills</span>
        </button>
      </div>

      {/* Complete Your Profile Suggestions */}
      <div className="border-t border-gray-100 dark:border-slate-800 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
          Complete your profile
        </p>

        <div className="space-y-1.5">
          <button
            onClick={() => {
              if (onAddGithub) onAddGithub();
              else if (onNavigateProfile) onNavigateProfile();
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-500" />
              <span>Add GitHub Link</span>
            </span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </button>

          <button
            onClick={() => {
              if (onAddProject) onAddProject();
              else if (onNavigateProjects) onNavigateProjects();
              else if (onNavigateProfile) onNavigateProfile();
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-500" />
              <span>Add Portfolio Project</span>
            </span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </button>

          <button
            onClick={() => {
              if (onAddCert) onAddCert();
              else if (onNavigateProfile) onNavigateProfile();
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-purple-500" />
              <span>Add Certification</span>
            </span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </button>
        </div>

        {/* View Profile Button */}
        <button
          onClick={onNavigateProfile}
          className="w-full mt-4 py-2 text-center text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition cursor-pointer border border-blue-100 dark:border-blue-900/50"
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
};
