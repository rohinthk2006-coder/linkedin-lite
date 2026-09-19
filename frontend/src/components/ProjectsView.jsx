import React, { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProofChainModal } from './ProofChainModal';
import { EmptyState } from './EmptyState';
import { mockProjects } from '../data/mockProjects';
import { Plus, Search, FolderGit2, Filter, Sparkles } from 'lucide-react';

export const ProjectsView = ({ onSelectProject }) => {
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProofSkill, setSelectedProofSkill] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New project form
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTechs, setNewTechs] = useState('');
  const [newGithub, setNewGithub] = useState('');
  const [newLive, setNewLive] = useState('');
  const [newSkill, setNewSkill] = useState('React');

  const allTechnologies = ['All', 'React', 'Spring Boot', 'Java', 'PostgreSQL', 'Tailwind CSS', 'TypeScript'];
  const allStatuses = ['All', 'Production', 'Completed', 'In Progress'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTech = selectedTech === 'All' || (p.technologies && p.technologies.includes(selectedTech));
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesTech && matchesStatus;
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = {
      id: Date.now(),
      title: newTitle.trim(),
      tagline: newTagline.trim() || 'Verified LinkSphere Portfolio Project',
      description: newDesc.trim() || 'Showcasing real-world system architecture, frontend components, and backend API routes.',
      technologies: newTechs ? newTechs.split(',').map((t) => t.trim()).filter(Boolean) : ['React', 'Spring Boot'],
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      githubUrl: newGithub.trim() || 'https://github.com',
      liveDemoUrl: newLive.trim() || 'https://linksphere.live',
      status: 'Completed',
      verifiedSkill: newSkill,
      stars: 1,
      forks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects([created, ...projects]);
    setShowAddModal(false);
    setNewTitle('');
    setNewTagline('');
    setNewDesc('');
    setNewTechs('');
    setNewGithub('');
    setNewLive('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <FolderGit2 className="w-4 h-4" />
              <span>Verifiable Project Portfolio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Projects & Engineering Proof
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
              Explore verified repositories, live production platforms, and interactive Proof Chains built by LinkSphere professionals.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Controls: Search Bar & Filters */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project name, description, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto py-1">
            {allStatuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack Chips Filter */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-slate-800 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase text-gray-400 dark:text-slate-500 shrink-0">
            Tech:
          </span>
          {allTechnologies.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedTech === tech
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-bold'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects match your filter"
          description="Try broadening your technology or search criteria, or add a new verified project."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedTech('All');
            setSelectedStatus('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onInspectProofChain={(skill) => setSelectedProofSkill(skill)}
            />
          ))}
        </div>
      )}

      {/* Proof Chain Inspection Modal */}
      <ProofChainModal
        skillName={selectedProofSkill}
        isOpen={Boolean(selectedProofSkill)}
        onClose={() => setSelectedProofSkill(null)}
      />

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-lg border border-gray-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-1.5">
                <FolderGit2 className="w-5 h-5 text-blue-600" />
                <span>Add Portfolio Project</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-5 space-y-3 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. FoodGo Delivery App"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="e.g. Real-Time Food Delivery Platform"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={newTechs}
                  onChange={(e) => setNewTechs(e.target.value)}
                  placeholder="React, Spring Boot, PostgreSQL, Tailwind"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={newLive}
                    onChange={(e) => setNewLive(e.target.value)}
                    placeholder="https://myproject.app"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Verified Skill for Proof Chain
                </label>
                <select
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="React">React (Verified Proof Chain)</option>
                  <option value="Spring Boot">Spring Boot (Verified Proof Chain)</option>
                  <option value="Java">Java (Verified Proof Chain)</option>
                  <option value="SQL">SQL (Verified Proof Chain)</option>
                  <option value="UI/UX">UI/UX (Verified Proof Chain)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain architectural decisions, key features, and engineering accomplishments..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
