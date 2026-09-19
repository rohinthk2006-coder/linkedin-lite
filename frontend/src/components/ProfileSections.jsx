import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ProofChainModal } from './ProofChainModal';
import { ProjectCard } from './ProjectCard';
import { GithubIcon } from './GithubIcon';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  FolderGit2, 
  Plus, 
  Edit3, 
  Trash2, 
  UserPlus, 
  UserCheck, 
  MapPin, 
  Mail, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Trophy,
  Camera,
  Upload,
  Globe,
  X
} from 'lucide-react';
import { mockProofChains } from '../data/mockProofChains';

const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const ProfileSections = ({ 
  targetProfile, 
  isOwnProfile, 
  onProfileReload, 
  onNavigateNetwork, 
  onNavigateMessages,
  openModalOnMount,
  onClearInitialAction
}) => {
  const { user: currentUser, refreshUser } = useAuth();
  
  // Modals state
  const [showBasicEdit, setShowBasicEdit] = useState(false);
  const [showAboutEdit, setShowAboutEdit] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Proof Chain Modal state
  const [selectedProofSkill, setSelectedProofSkill] = useState(null);

  // Active edit item
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [basicForm, setBasicForm] = useState({
    firstName: targetProfile?.firstName || '',
    lastName: targetProfile?.lastName || '',
    headline: targetProfile?.headline || '',
    location: targetProfile?.location || '',
    profileImage: targetProfile?.profileImage || '',
    githubUrl: targetProfile?.githubUrl || '',
    portfolioUrl: targetProfile?.portfolioUrl || '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  // Trigger initial modal if opened from Sidebar quick links
  useEffect(() => {
    if (!openModalOnMount || !isOwnProfile) return;
    if (openModalOnMount === 'github' || openModalOnMount === 'basic') {
      setBasicForm({
        firstName: targetProfile.firstName,
        lastName: targetProfile.lastName,
        headline: targetProfile.headline || '',
        location: targetProfile.location || '',
        profileImage: targetProfile.profileImage || '',
        githubUrl: targetProfile.githubUrl || '',
        portfolioUrl: targetProfile.portfolioUrl || '',
      });
      setPhotoFile(null);
      setPhotoPreview(targetProfile.profileImage || null);
      setPhotoRemoved(false);
      setShowBasicEdit(true);
    } else if (openModalOnMount === 'project') {
      setEditingItem(null);
      setProjectForm({ title: '', description: '', technologies: '', projectUrl: '' });
      setShowProjectModal(true);
    } else if (openModalOnMount === 'cert') {
      setEditingItem(null);
      setCertForm({ name: '', issuingOrganization: '', issueDate: '', credentialId: '', credentialUrl: '' });
      setShowCertModal(true);
    }
    if (onClearInitialAction) onClearInitialAction();
  }, [openModalOnMount, isOwnProfile, targetProfile]);

  const [aboutForm, setAboutForm] = useState(targetProfile?.about || '');

  const [eduForm, setEduForm] = useState({
    institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: ''
  });

  const [expForm, setExpForm] = useState({
    company: '', position: '', location: '', startDate: '', endDate: '', description: ''
  });

  const [skillInput, setSkillInput] = useState('');

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', technologies: '', projectUrl: ''
  });

  const [certForm, setCertForm] = useState({
    name: '', issuingOrganization: '', issueDate: '', credentialId: '', credentialUrl: ''
  });

  // --- API HANDLERS ---
  const handleSaveBasic = async (e) => {
    e.preventDefault();
    setSavingPhoto(true);
    try {
      let finalProfileImageUrl = targetProfile.profileImage;

      if (photoFile) {
        // Upload photo from media
        const formData = new FormData();
        formData.append('file', photoFile);
        try {
          const uploadRes = await api.post(`/users/${targetProfile.id}/photo`, formData);
          if (uploadRes.data.success) {
            finalProfileImageUrl = uploadRes.data.data.profileImage;
          }
        } catch (uploadErr) {
          console.warn('Photo upload endpoint fallback to data URL:', uploadErr);
          if (photoPreview) {
            finalProfileImageUrl = photoPreview;
          }
        }
      } else if (photoRemoved) {
        finalProfileImageUrl = null;
      }

      const res = await api.put(`/users/${targetProfile.id}`, {
        firstName: basicForm.firstName,
        lastName: basicForm.lastName,
        headline: basicForm.headline,
        location: basicForm.location,
        profileImage: finalProfileImageUrl,
        githubUrl: basicForm.githubUrl,
        portfolioUrl: basicForm.portfolioUrl,
        about: targetProfile.about
      });

      if (res.data.success) {
        setShowBasicEdit(false);
        setPhotoFile(null);
        setPhotoPreview(null);
        setPhotoRemoved(false);
        refreshUser();
        if (onProfileReload) onProfileReload();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/users/${targetProfile.id}`, {
        firstName: targetProfile.firstName,
        lastName: targetProfile.lastName,
        headline: targetProfile.headline,
        location: targetProfile.location,
        profileImage: targetProfile.profileImage,
        githubUrl: targetProfile.githubUrl,
        portfolioUrl: targetProfile.portfolioUrl,
        about: aboutForm
      });
      if (res.data.success) {
        setShowAboutEdit(false);
        refreshUser();
        if (onProfileReload) onProfileReload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Connection Handler for non-owner viewing profile
  const handleConnectAction = async () => {
    try {
      if (targetProfile.connectionStatusWithCurrentUser === 'NONE') {
        await api.post(`/connections/request/${targetProfile.id}`);
      } else if (targetProfile.connectionIdWithCurrentUser) {
        await api.delete(`/connections/${targetProfile.connectionIdWithCurrentUser}`);
      }
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  // --- EDUCATION ---
  const handleSaveEdu = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/education/${editingItem.id}`, eduForm);
      } else {
        await api.post(`/users/${targetProfile.id}/education`, eduForm);
      }
      setShowEduModal(false);
      setEditingItem(null);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete education record?')) return;
    try {
      await api.delete(`/education/${id}`);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  // --- EXPERIENCE ---
  const handleSaveExp = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/experience/${editingItem.id}`, expForm);
      } else {
        await api.post(`/users/${targetProfile.id}/experience`, expForm);
      }
      setShowExpModal(false);
      setEditingItem(null);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Delete experience record?')) return;
    try {
      await api.delete(`/experience/${id}`);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  // --- SKILLS ---
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    try {
      await api.post(`/users/${targetProfile.id}/skills`, { name: skillInput.trim() });
      setSkillInput('');
      setShowSkillModal(false);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await api.delete(`/users/${targetProfile.id}/skills/${skillId}`);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  // --- PROJECTS ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/projects/${editingItem.id}`, projectForm);
      } else {
        await api.post(`/users/${targetProfile.id}/projects`, projectForm);
      }
      setShowProjectModal(false);
      setEditingItem(null);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  // --- CERTIFICATIONS ---
  const handleSaveCert = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: certForm.name,
        issuingOrganization: certForm.issuingOrganization || '',
        credentialId: certForm.credentialId || '',
        credentialUrl: certForm.credentialUrl || '',
        issueDate: certForm.issueDate && certForm.issueDate.trim() !== '' ? certForm.issueDate : null
      };
      if (editingItem) {
        await api.put(`/certifications/${editingItem.id}`, payload);
      } else {
        await api.post(`/users/${targetProfile.id}/certifications`, payload);
      }
      setShowCertModal(false);
      setEditingItem(null);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete certification?')) return;
    try {
      await api.delete(`/certifications/${id}`);
      if (onProfileReload) onProfileReload();
    } catch (err) {
      console.error(err);
    }
  };

  if (!targetProfile) return null;

  // Derive default skills if targetProfile has empty array for rich prototype
  const displayedSkills = targetProfile.skills && targetProfile.skills.length > 0
    ? targetProfile.skills
    : [
        { id: 101, name: 'React' },
        { id: 102, name: 'Spring Boot' },
        { id: 103, name: 'Java' },
        { id: 104, name: 'SQL' },
        { id: 105, name: 'UI/UX' },
        { id: 106, name: 'Git' }
      ];

  const profileStrength = targetProfile.profileCompleteness || 72;

  return (
    <div className="space-y-6">
      
      {/* 1. PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl shadow-xs border border-gray-200 dark:border-slate-800 overflow-hidden relative transition-colors">
        <div className="h-44 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>LinkSphere Verified Member</span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end -mt-20 sm:-mt-16 mb-4 gap-4">
            {targetProfile.profileImage ? (
              <img
                src={targetProfile.profileImage}
                alt={targetProfile.firstName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-white dark:border-[#131b2e] object-cover shadow-xl bg-white"
              />
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-white dark:border-[#131b2e] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-4xl shadow-xl">
                {targetProfile.firstName?.charAt(0)}
              </div>
            )}

            {/* Profile Header Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {isOwnProfile ? (
                <button
                  onClick={() => {
                    setBasicForm({
                      firstName: targetProfile.firstName,
                      lastName: targetProfile.lastName,
                      headline: targetProfile.headline || '',
                      location: targetProfile.location || '',
                      profileImage: targetProfile.profileImage || '',
                      githubUrl: targetProfile.githubUrl || '',
                      portfolioUrl: targetProfile.portfolioUrl || '',
                    });
                    setPhotoFile(null);
                    setPhotoPreview(targetProfile.profileImage || null);
                    setPhotoRemoved(false);
                    setShowBasicEdit(true);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer border border-gray-200 dark:border-slate-700"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigateMessages && onNavigateMessages()}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={handleConnectAction}
                    className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-xs cursor-pointer ${
                      targetProfile.connectionStatusWithCurrentUser === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : targetProfile.connectionStatusWithCurrentUser === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {targetProfile.connectionStatusWithCurrentUser === 'ACCEPTED' ? (
                      <>
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Connected</span>
                      </>
                    ) : targetProfile.connectionStatusWithCurrentUser === 'PENDING' ? (
                      <>
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Request Pending</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>{targetProfile.firstName} {targetProfile.lastName}</span>
              {targetProfile.role === 'ROLE_ADMIN' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  <ShieldCheck className="h-3 w-3 mr-1" /> Admin
                </span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
              {targetProfile.headline || 'Full-Stack Software Engineer • LinkSphere Core Contributor'}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-slate-400 mt-2.5">
              {targetProfile.location && (
                <span className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  {targetProfile.location}
                </span>
              )}
              <span className="flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1 text-gray-400" />
                {targetProfile.email}
              </span>
              <span 
                onClick={onNavigateNetwork} 
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                {targetProfile.connectionCount || 18} connections
              </span>
            </div>

            {/* Professional Links (GitHub & Portfolio) */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {targetProfile.githubUrl && (
                <a
                  href={ensureAbsoluteUrl(targetProfile.githubUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-xs font-semibold border border-gray-200 dark:border-slate-700 transition shadow-2xs"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              )}

              {targetProfile.portfolioUrl && (
                <a
                  href={ensureAbsoluteUrl(targetProfile.portfolioUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-900/50 transition shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              )}

              {isOwnProfile && (!targetProfile.githubUrl || !targetProfile.portfolioUrl) && (
                <button
                  onClick={() => {
                    setBasicForm({
                      firstName: targetProfile.firstName,
                      lastName: targetProfile.lastName,
                      headline: targetProfile.headline || '',
                      location: targetProfile.location || '',
                      profileImage: targetProfile.profileImage || '',
                      githubUrl: targetProfile.githubUrl || '',
                      portfolioUrl: targetProfile.portfolioUrl || '',
                    });
                    setPhotoFile(null);
                    setPhotoPreview(targetProfile.profileImage || null);
                    setPhotoRemoved(false);
                    setShowBasicEdit(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{!targetProfile.githubUrl ? 'Add GitHub' : 'Add Portfolio'}</span>
                </button>
              )}
            </div>


            {/* Profile Strength Bar */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Profile Strength: {profileStrength}% (All-Star)
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Strong</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT SECTION */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">About</h2>
          {isOwnProfile && (
            <button
              onClick={() => {
                setAboutForm(targetProfile.about || '');
                setShowAboutEdit(true);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {targetProfile.about || 
            "Full-Stack Software Engineer specializing in modern reactive architectures with React 19, Spring Boot 3 virtual threads, and PostgreSQL. Committed to verifiable code quality, open-source collaboration, and building production-ready applications with test-driven discipline."}
        </p>
      </div>

      {/* 3. SKILLS & PROOF CHAIN SECTION */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Skills & Proof Chain™
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Click any skill to inspect its verified pipeline of certificates, projects, and assessments.
            </p>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => setShowSkillModal(true)}
              className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              title="Add Skill"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Skills Chips Grid with Verification Badges */}
        <div className="flex flex-wrap gap-2.5 mt-4">
          {displayedSkills.map((skill) => {
            const proof = mockProofChains[skill.name];
            const isVerified = proof?.status === "Verified";
            const endorsementCount = proof?.endorsements || 12;

            return (
              <div
                key={skill.id}
                onClick={() => setSelectedProofSkill(skill.name)}
                className="group inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold bg-gray-50 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xs transition cursor-pointer"
              >
                <span className="text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {skill.name}
                </span>

                {isVerified ? (
                  <span className="inline-flex items-center text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded-md">
                    <CheckCircle2 className="w-3 h-3 mr-0.5" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-normal">
                    Self-Reported
                  </span>
                )}

                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">
                  +{endorsementCount}
                </span>

                {isOwnProfile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSkill(skill.id);
                    }}
                    className="text-gray-400 hover:text-red-600 p-0.5"
                    title="Remove skill"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PROJECTS SECTION */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <FolderGit2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Featured Projects</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Production repositories and full-stack platforms with verified skill tags.
            </p>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingItem(null);
                setProjectForm({ title: '', description: '', technologies: '', projectUrl: '' });
                setShowProjectModal(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              title="Add Project"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.projects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetProfile.projects.map((proj) => (
              <div 
                key={proj.id} 
                className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{proj.title}</h3>
                    {isOwnProfile && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingItem(proj);
                            setProjectForm(proj);
                            setShowProjectModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDeleteProject(proj.id)} className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
                      {proj.technologies.split(',').map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-medium">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-3 leading-relaxed mt-1">
                    {proj.description}
                  </p>
                </div>

                {proj.projectUrl && (
                  <div className="pt-3 mt-3 border-t border-gray-200/50 dark:border-slate-800">
                    <a
                      href={ensureAbsoluteUrl(proj.projectUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Repository / Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic py-2">No projects added yet.</p>
        )}
      </div>

      {/* 5. EXPERIENCE TIMELINE SECTION */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Experience</h2>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingItem(null);
                setExpForm({ company: '', position: '', location: '', startDate: '', endDate: '', description: '' });
                setShowExpModal(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.experiences?.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-slate-800">
            {targetProfile.experiences.map((exp) => (
              <div key={exp.id} className="relative group">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#131b2e] bg-blue-600 shadow-xs" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{exp.position}</h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{exp.company}</p>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                      {exp.startDate} – {exp.endDate || 'Present'} {exp.location ? `• ${exp.location}` : ''}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  {isOwnProfile && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingItem(exp);
                          setExpForm(exp);
                          setShowExpModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDeleteExp(exp.id)} className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No experience entries added yet.</p>
        )}
      </div>

      {/* 6. EDUCATION SECTION */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Education</h2>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingItem(null);
                setEduForm({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
                setShowEduModal(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.educations?.length > 0 ? (
          <div className="space-y-4 divide-y divide-gray-100 dark:divide-slate-800">
            {targetProfile.educations.map((edu) => (
              <div key={edu.id} className="pt-3 first:pt-0 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">{edu.institution}</h3>
                  <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                    {edu.degree} in {edu.fieldOfStudy}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1.5">{edu.description}</p>
                  )}
                </div>
                {isOwnProfile && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingItem(edu);
                        setEduForm(edu);
                        setShowEduModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDeleteEdu(edu.id)} className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No education records added yet.</p>
        )}
      </div>

      {/* 7. CERTIFICATES & ACHIEVEMENTS SECTION */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-purple-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Certificates & Achievements</h2>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingItem(null);
                setCertForm({ name: '', issuingOrganization: '', issueDate: '', credentialId: '', credentialUrl: '' });
                setShowCertModal(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.certifications?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {targetProfile.certifications.map((cert) => (
              <div key={cert.id} className="p-3.5 bg-gray-50/70 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">{cert.name}</h3>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">{cert.issuingOrganization}</p>
                  {cert.issueDate && (
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Issued: {cert.issueDate}</p>
                  )}
                  {cert.credentialId && (
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300">
                      ID: {cert.credentialId}
                    </span>
                  )}
                  {cert.credentialUrl && (
                    <div className="mt-1.5">
                      <a
                        href={ensureAbsoluteUrl(cert.credentialUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Show Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingItem(cert);
                        setCertForm({
                          name: cert.name || '',
                          issuingOrganization: cert.issuingOrganization || '',
                          credentialId: cert.credentialId || '',
                          credentialUrl: cert.credentialUrl || '',
                          issueDate: cert.issueDate || ''
                        });
                        setShowCertModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDeleteCert(cert.id)} className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No certifications listed yet.</p>
        )}
      </div>

      {/* Proof Chain Detailed Inspection Modal */}
      <ProofChainModal
        skillName={selectedProofSkill}
        isOpen={Boolean(selectedProofSkill)}
        onClose={() => setSelectedProofSkill(null)}
      />

      {/* --- ALL EXISTING EDIT MODALS --- */}
      {/* 1. Basic Edit Modal */}
      {showBasicEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-md border border-gray-100 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Edit Profile Details</h3>
              <button onClick={() => setShowBasicEdit(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSaveBasic} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={basicForm.firstName}
                    onChange={(e) => setBasicForm({ ...basicForm, firstName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={basicForm.lastName}
                    onChange={(e) => setBasicForm({ ...basicForm, lastName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={basicForm.headline}
                  onChange={(e) => setBasicForm({ ...basicForm, headline: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={basicForm.location}
                  onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>

              {/* GitHub and Portfolio Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    GitHub Profile Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={basicForm.githubUrl || ''}
                    onChange={(e) => setBasicForm({ ...basicForm, githubUrl: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Portfolio / Website Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://yourportfolio.com"
                    value={basicForm.portfolioUrl || ''}
                    onChange={(e) => setBasicForm({ ...basicForm, portfolioUrl: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
                  <div className="relative group shrink-0">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile Preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                        {basicForm.firstName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <label 
                      htmlFor="profile-media-upload"
                      className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition"
                      title="Click to select photo"
                    >
                      <Camera className="w-5 h-5" />
                    </label>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="profile-media-upload"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer inline-flex items-center space-x-1.5 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Media</span>
                      </label>
                      <input
                        id="profile-media-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPhotoFile(file);
                            setPhotoRemoved(false);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPhotoPreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview(null);
                            setPhotoRemoved(true);
                          }}
                          className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400">
                      Upload an image file (PNG, JPG, WEBP, GIF) from your media.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBasicEdit(false)}
                  className="px-4 py-2 text-xs text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPhoto}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center space-x-1.5 shadow-xs"
                >
                  {savingPhoto ? <span>Saving...</span> : <span>Save Changes</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. About Edit Modal */}
      {showAboutEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-lg border border-gray-100 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Edit About Bio</h3>
              <button onClick={() => setShowAboutEdit(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleSaveAbout} className="space-y-3">
              <textarea
                rows={6}
                value={aboutForm}
                onChange={(e) => setAboutForm(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                placeholder="Share your background, engineering passions, and experience..."
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowAboutEdit(false)} className="px-4 py-2 text-xs text-gray-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Save Bio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-sm border border-gray-100 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">Add Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <input
                type="text"
                required
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. React, Java, Docker, TypeScript..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowSkillModal(false)} className="px-4 py-2 text-xs text-gray-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Add Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-md border border-gray-100 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">
              {editingItem ? 'Edit Project' : 'Add Project'}
            </h3>
            <form onSubmit={handleSaveProject} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Project Title"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Technologies (e.g. React, Spring Boot, MySQL)"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <input
                type="url"
                placeholder="Project URL (GitHub / Demo)"
                value={projectForm.projectUrl}
                onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <textarea
                rows={3}
                placeholder="Description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white resize-none"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowProjectModal(false)} className="px-4 py-2 text-xs text-gray-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-md border border-gray-100 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">
              {editingItem ? 'Edit Experience' : 'Add Experience'}
            </h3>
            <form onSubmit={handleSaveExp} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Position / Title"
                value={expForm.position}
                onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                required
                placeholder="Company Name"
                value={expForm.company}
                onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Start Date (e.g. 2024)"
                  value={expForm.startDate}
                  onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="End Date (e.g. Present)"
                  value={expForm.endDate}
                  onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Responsibilities & Key Achievements"
                value={expForm.description}
                onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white resize-none"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowExpModal(false)} className="px-4 py-2 text-xs text-gray-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Education Modal */}
      {showEduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-md border border-gray-100 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">
              {editingItem ? 'Edit Education' : 'Add Education'}
            </h3>
            <form onSubmit={handleSaveEdu} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Institution / College"
                value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Degree (e.g. B.Tech)"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Field of Study (e.g. CSE)"
                  value={eduForm.fieldOfStudy}
                  onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowEduModal(false)} className="px-4 py-2 text-xs text-gray-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Cert Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-md border border-gray-100 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">
              {editingItem ? 'Edit Certificate' : 'Add Certificate'}
            </h3>
            <form onSubmit={handleSaveCert} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Certificate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services, Coursera, Meta"
                  value={certForm.issuingOrganization}
                  onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABC-12345"
                    value={certForm.credentialId || ''}
                    onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={certForm.issueDate || ''}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Credential URL / Verification Link
                </label>
                <input
                  type="text"
                  placeholder="https://coursera.org/verify/... or certificate link"
                  value={certForm.credentialUrl || ''}
                  onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowCertModal(false)} className="px-4 py-2 text-xs text-gray-600 dark:text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition">Save Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
