import React from 'react';
import { ExternalLink, ShieldCheck, Star, GitFork, FolderGit2 } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const ProjectCard = ({ project, onInspectProofChain }) => {
  if (!project) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Production':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300 border-gray-200 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Thumbnail Container */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-950 text-white">
            <FolderGit2 className="w-12 h-12 text-blue-400 opacity-60" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs backdrop-blur-md ${getStatusBadge(project.status)}`}>
            {project.status || 'Active'}
          </span>
        </div>

        {/* Verified Proof Chain Chip */}
        {project.verifiedSkill && (
          <button
            onClick={() => onInspectProofChain && onInspectProofChain(project.verifiedSkill)}
            className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-blue-500/40 text-blue-300 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-blue-600 hover:text-white transition cursor-pointer shadow-sm"
            title={`View ${project.verifiedSkill} Proof Chain`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Proof: {project.verifiedSkill}</span>
          </button>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {project.title}
            </h3>
            
            {/* Stars / Forks Stats */}
            {(project.stars || project.forks) && (
              <div className="flex items-center space-x-2 text-[11px] text-gray-400 dark:text-slate-500">
                {project.stars && (
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {project.stars}
                  </span>
                )}
                {project.forks && (
                  <span className="flex items-center gap-0.5">
                    <GitFork className="w-3 h-3" />
                    {project.forks}
                  </span>
                )}
              </div>
            )}
          </div>

          {project.tagline && (
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
              {project.tagline}
            </p>
          )}

          <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Technology Stack Chips */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-[10px] font-semibold rounded-md border border-gray-200/60 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {(project.githubUrl || (project.projectUrl && project.projectUrl.includes('github.com'))) && (
            <a
              href={ensureAbsoluteUrl(project.githubUrl || project.projectUrl)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 text-xs font-semibold text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {(project.liveDemoUrl || (project.projectUrl && !project.projectUrl.includes('github.com'))) && (
            <a
              href={ensureAbsoluteUrl(project.liveDemoUrl || project.projectUrl)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit Link</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
