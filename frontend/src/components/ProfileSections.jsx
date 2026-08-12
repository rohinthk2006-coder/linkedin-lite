import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
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
  X
} from 'lucide-react';

export const ProfileSections = ({ targetProfile, isOwnProfile, onProfileReload, onNavigateNetwork }) => {
  const { user: currentUser, refreshUser } = useAuth();
  
  // Modals state
  const [showBasicEdit, setShowBasicEdit] = useState(false);
  const [showAboutEdit, setShowAboutEdit] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Active edit item
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [basicForm, setBasicForm] = useState({
    firstName: targetProfile?.firstName || '',
    lastName: targetProfile?.lastName || '',
    headline: targetProfile?.headline || '',
    location: targetProfile?.location || '',
    profileImage: targetProfile?.profileImage || '',
  });

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
    try {
      const res = await api.put(`/users/${targetProfile.id}`, {
        ...basicForm,
        about: targetProfile.about
      });
      if (res.data.success) {
        setShowBasicEdit(false);
        refreshUser();
        if (onProfileReload) onProfileReload();
      }
    } catch (err) {
      console.error(err);
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
      if (editingItem) {
        await api.put(`/certifications/${editingItem.id}`, certForm);
      } else {
        await api.post(`/users/${targetProfile.id}/certifications`, certForm);
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

  return (
    <div className="space-y-6">
      
      {/* HEADER CARD */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden relative">
        <div className="h-36 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700"></div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex justify-between items-end -mt-16 mb-4">
            {targetProfile.profileImage ? (
              <img
                src={targetProfile.profileImage}
                alt={targetProfile.firstName}
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-600 text-white flex items-center justify-center font-bold text-4xl shadow-lg">
                {targetProfile.firstName?.charAt(0)}
              </div>
            )}

            <div className="flex space-x-3 mt-4 sm:mt-0">
              {isOwnProfile ? (
                <button
                  onClick={() => {
                    setBasicForm({
                      firstName: targetProfile.firstName,
                      lastName: targetProfile.lastName,
                      headline: targetProfile.headline || '',
                      location: targetProfile.location || '',
                      profileImage: targetProfile.profileImage || '',
                    });
                    setShowBasicEdit(true);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold rounded-full flex items-center space-x-1.5 transition"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={handleConnectAction}
                  className={`px-5 py-2 text-sm font-semibold rounded-full flex items-center space-x-1.5 transition ${
                    targetProfile.connectionStatusWithCurrentUser === 'ACCEPTED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                      : targetProfile.connectionStatusWithCurrentUser === 'PENDING'
                      ? 'bg-amber-50 text-amber-700 border border-amber-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  }`}
                >
                  {targetProfile.connectionStatusWithCurrentUser === 'ACCEPTED' ? (
                    <>
                      <UserCheck className="h-4 w-4" />
                      <span>Connected</span>
                    </>
                  ) : targetProfile.connectionStatusWithCurrentUser === 'PENDING' ? (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Request Pending</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-2">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {targetProfile.firstName} {targetProfile.lastName}
              {targetProfile.role === 'ROLE_ADMIN' && (
                <ShieldCheck className="h-5 w-5 text-purple-600" title="Administrator" />
              )}
            </h1>
            <p className="text-base text-gray-700 font-medium mt-1">{targetProfile.headline}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-3">
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
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                {targetProfile.connectionCount || 0} connections
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">About</h2>
          {isOwnProfile && (
            <button
              onClick={() => {
                setAboutForm(targetProfile.about || '');
                setShowAboutEdit(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {targetProfile.about || (isOwnProfile ? 'Add a summary about yourself to stand out to connections.' : 'No summary provided.')}
        </p>
      </div>

      {/* EXPERIENCE SECTION */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
            Experience
          </h2>
          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingItem(null);
                setExpForm({ company: '', position: '', location: '', startDate: '', endDate: '', description: '' });
                setShowExpModal(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.experiences?.length > 0 ? (
          <div className="space-y-4 divide-y divide-gray-100">
            {targetProfile.experiences.map((exp) => (
              <div key={exp.id} className="pt-3 first:pt-0 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{exp.position}</h3>
                  <p className="text-xs font-medium text-gray-700">{exp.company}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  {exp.description && <p className="text-xs text-gray-600 mt-2">{exp.description}</p>}
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
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No experience entries added yet.</p>
        )}
      </div>

      {/* EDUCATION SECTION */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
            Education
          </h2>
          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingItem(null);
                setEduForm({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
                setShowEduModal(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.educations?.length > 0 ? (
          <div className="space-y-4 divide-y divide-gray-100">
            {targetProfile.educations.map((edu) => (
              <div key={edu.id} className="pt-3 first:pt-0 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{edu.institution}</h3>
                  <p className="text-xs font-medium text-gray-700">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                  {edu.description && <p className="text-xs text-gray-600 mt-2">{edu.description}</p>}
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
          <p className="text-xs text-gray-400 italic">No education entries added yet.</p>
        )}
      </div>

      {/* SKILLS SECTION */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Skills</h2>
          {isOwnProfile && (
            <button
              onClick={() => setShowSkillModal(true)}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {targetProfile.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
              >
                {skill.name}
                {isOwnProfile && (
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="ml-1.5 text-blue-400 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No skills listed yet.</p>
        )}
      </div>

      {/* PROJECTS SECTION */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <FolderGit2 className="h-5 w-5 mr-2 text-blue-600" />
            Projects
          </h2>
          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingItem(null);
                setProjectForm({ title: '', description: '', technologies: '', projectUrl: '' });
                setShowProjectModal(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.projects?.length > 0 ? (
          <div className="space-y-4 divide-y divide-gray-100">
            {targetProfile.projects.map((proj) => (
              <div key={proj.id} className="pt-3 first:pt-0 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm text-gray-900">{proj.title}</h3>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline text-xs flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-0.5" /> Link
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <p className="text-xs font-mono text-gray-500 mt-0.5">Tech: {proj.technologies}</p>
                  )}
                  {proj.description && <p className="text-xs text-gray-700 mt-1">{proj.description}</p>}
                </div>
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
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No projects listed yet.</p>
        )}
      </div>

      {/* CERTIFICATIONS SECTION */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Award className="h-5 w-5 mr-2 text-blue-600" />
            Certifications
          </h2>
          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingItem(null);
                setCertForm({ name: '', issuingOrganization: '', issueDate: '', credentialId: '', credentialUrl: '' });
                setShowCertModal(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {targetProfile.certifications?.length > 0 ? (
          <div className="space-y-4 divide-y divide-gray-100">
            {targetProfile.certifications.map((cert) => (
              <div key={cert.id} className="pt-3 first:pt-0 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{cert.name}</h3>
                  <p className="text-xs font-medium text-gray-700">{cert.issuingOrganization}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Issued: {cert.issueDate}</p>
                  {cert.credentialId && <p className="text-[11px] font-mono text-gray-400">ID: {cert.credentialId}</p>}
                </div>
                {isOwnProfile && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingItem(cert);
                        setCertForm(cert);
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
          <p className="text-xs text-gray-400 italic">No certifications added yet.</p>
        )}
      </div>

      {/* BASIC INFO EDIT MODAL */}
      {showBasicEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Basic Info</h3>
            <form onSubmit={handleSaveBasic} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={basicForm.firstName}
                  onChange={(e) => setBasicForm({ ...basicForm, firstName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={basicForm.lastName}
                  onChange={(e) => setBasicForm({ ...basicForm, lastName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={basicForm.headline}
                  onChange={(e) => setBasicForm({ ...basicForm, headline: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={basicForm.location}
                  onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Profile Image URL</label>
                <input
                  type="url"
                  value={basicForm.profileImage}
                  onChange={(e) => setBasicForm({ ...basicForm, profileImage: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBasicEdit(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ABOUT EDIT MODAL */}
      {showAboutEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit About Summary</h3>
            <form onSubmit={handleSaveAbout}>
              <textarea
                value={aboutForm}
                onChange={(e) => setAboutForm(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-hidden focus:border-blue-500"
                placeholder="Write a summary about your professional background and interests..."
              />
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAboutEdit(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Summary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT EXPERIENCE MODAL */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingItem ? 'Edit Experience' : 'Add Experience'}</h3>
            <form onSubmit={handleSaveExp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Position / Title</label>
                <input
                  type="text"
                  value={expForm.position}
                  onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={expForm.startDate || ''}
                    onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={expForm.endDate || ''}
                    onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT EDUCATION MODAL */}
      {showEduModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingItem ? 'Edit Education' : 'Add Education'}</h3>
            <form onSubmit={handleSaveEdu} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">School / Institution</label>
                <input
                  type="text"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  value={eduForm.fieldOfStudy}
                  onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={eduForm.startDate || ''}
                    onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={eduForm.endDate || ''}
                    onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEduModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SKILL MODAL */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Java, Docker, React"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT PROJECT MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingItem ? 'Edit Project' : 'Add Project'}</h3>
            <form onSubmit={handleSaveProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Technologies Used</label>
                <input
                  type="text"
                  placeholder="Java, Spring Boot, React..."
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Project URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={projectForm.projectUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT CERTIFICATION MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingItem ? 'Edit Certification' : 'Add Certification'}</h3>
            <form onSubmit={handleSaveCert} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Certification Name</label>
                <input
                  type="text"
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={certForm.issuingOrganization}
                  onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={certForm.issueDate || ''}
                  onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Credential ID</label>
                <input
                  type="text"
                  value={certForm.credentialId}
                  onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
