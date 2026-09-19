import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Image, Send, X, FolderGit2, Trophy, Award, Sparkles, Plus } from 'lucide-react';

export const CreatePostBox = ({ onPostCreated, onNavigateProjects }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General Update');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['General Update', 'Project Update', 'Achievement', 'Certification', 'Learning'];

  const handleOpenWithCategory = (cat) => {
    setCategory(cat);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      // Prepend category tag if not General
      const finalContent = category !== 'General Update' 
        ? `[${category}] ${content.trim()}`
        : content.trim();

      formData.append('content', finalContent);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.post('/posts', formData);

      if (res.data.success) {
        setContent('');
        setImageFile(null);
        setImagePreview(null);
        setShowImageInput(false);
        setCategory('General Update');
        setIsOpen(false);
        if (onPostCreated) onPostCreated(res.data.data);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-4 mb-4 transition-colors">
      {/* Top row: Avatar + "What's on your mind?" */}
      <div className="flex items-center space-x-3">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt=""
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700 shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            {user?.firstName?.charAt(0)}
          </div>
        )}
        <button
          onClick={() => handleOpenWithCategory('General Update')}
          className="flex-1 text-left px-4 py-2.5 bg-gray-100 dark:bg-slate-900/80 hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer border border-transparent dark:border-slate-800"
        >
          What's on your mind, {user?.firstName || 'there'}?
        </button>
      </div>

      {/* Action Buttons Row: Post, Add Project, Achievement, Certificate */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
        <button
          onClick={() => handleOpenWithCategory('General Update')}
          className="py-2 px-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Post</span>
        </button>

        <button
          onClick={() => handleOpenWithCategory('Project Update')}
          className="py-2 px-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <FolderGit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Add Project</span>
        </button>

        <button
          onClick={() => handleOpenWithCategory('Achievement')}
          className="py-2 px-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Achievement</span>
        </button>

        <button
          onClick={() => handleOpenWithCategory('Certification')}
          className="py-2 px-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Certificate</span>
        </button>
      </div>

      {/* Create Post Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <span>Create a Professional Post</span>
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              {/* User Identity & Category Selector */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {user?.firstName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-xs text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">
                      Public • Anyone on LinkSphere
                    </p>
                  </div>
                </div>

                {/* Category Pill Tag */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-xl focus:outline-hidden cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Area */}
              <textarea
                placeholder={
                  category === 'Project Update'
                    ? "Share your latest project! What problem does it solve, what technologies did you use, and where can we see the code?"
                    : category === 'Certification'
                    ? "Celebrate your new credential! What was your learning journey and key takeaways?"
                    : category === 'Achievement'
                    ? "Share a milestone, hackathon win, or career breakthrough..."
                    : "Share an engineering update, learning insight, or technical question..."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full text-xs sm:text-sm text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-hidden border-none resize-none bg-transparent"
                autoFocus
              />

              {/* Image Input Preview */}
              {showImageInput && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                    Upload Visual Evidence / Screenshot
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-xs p-1.5 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div className="relative mt-2">
                      <img src={imagePreview} alt="Preview" className="h-36 w-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <Image className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Attach Media</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={(!content.trim() && !imageFile) || loading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    {loading ? (
                      <span>Publishing...</span>
                    ) : (
                      <>
                        <span>Publish Post</span>
                        <Send className="h-3.5 w-3.5 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
