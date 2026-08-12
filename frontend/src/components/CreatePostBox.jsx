import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Image, Send, X } from 'lucide-react';

export const CreatePostBox = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/posts', {
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
      });

      if (res.data.success) {
        setContent('');
        setImageUrl('');
        setShowImageInput(false);
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
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 mb-4">
      <div className="flex items-center space-x-3">
        {user?.profileImage ? (
          <img src={user.profileImage} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.firstName?.charAt(0)}
          </div>
        )}
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 text-left px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full text-sm font-medium transition"
        >
          Start a post, share an update...
        </button>
      </div>

      {/* Post Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Create a post</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="flex items-center space-x-3 mb-4">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user?.firstName?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                    Post to Anyone
                  </span>
                </div>
              </div>

              <textarea
                placeholder="What do you want to talk about?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden border-none resize-none"
                autoFocus
              />

              {showImageInput && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-hidden focus:border-blue-500"
                  />
                  {imageUrl && (
                    <img src={imageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-md" />
                  )}
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="flex items-center space-x-1 text-xs text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition"
                >
                  <Image className="h-4 w-4 text-blue-600" />
                  <span>Media Image</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-full font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim() || loading}
                    className="px-5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700 disabled:opacity-50 transition flex items-center space-x-1"
                  >
                    {loading ? (
                      <span>Posting...</span>
                    ) : (
                      <>
                        <span>Post</span>
                        <Send className="h-3 w-3 ml-1" />
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
