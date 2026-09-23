import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Heart,
  MessageSquare, 
  Share2, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Send,
  ExternalLink,
  ShieldCheck,
  FolderGit2,
  Award,
  Trophy,
  Sparkles,
  Check
} from 'lucide-react';

export const PostCard = ({ post, onPostUpdated, onPostDeleted, onSelectUser }) => {
  const { user: currentUser } = useAuth();
  const [liked, setLiked] = useState(post.likedByCurrentUser || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [sharedToast, setSharedToast] = useState(false);

  const isAuthor = currentUser?.id === post.author?.id;
  const author = isAuthor && currentUser ? {
    ...post.author,
    id: currentUser.id,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    headline: currentUser.headline || post.author?.headline,
    profileImage: currentUser.profileImage !== undefined ? currentUser.profileImage : post.author?.profileImage,
    role: currentUser.role || post.author?.role
  } : post.author;

  // Extract category if enclosed in brackets e.g. "[Project Update] Rest of text"
  let detectedCategory = post.category || null;
  let displayContent = post.content || '';

  if (!detectedCategory && displayContent.startsWith('[')) {
    const match = displayContent.match(/^\[(.*?)\]\s*/);
    if (match) {
      detectedCategory = match[1];
      displayContent = displayContent.replace(/^\[(.*?)\]\s*/, '');
    }
  }

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Project Update':
        return {
          icon: FolderGit2,
          class: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        };
      case 'Certification':
        return {
          icon: Award,
          class: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        };
      case 'Achievement':
        return {
          icon: Trophy,
          class: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        };
      case 'Learning':
        return {
          icon: Sparkles,
          class: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        };
      default:
        return {
          icon: Sparkles,
          class: 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700'
        };
    }
  };

  const handleToggleLike = async () => {
    // Optimistic update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await api.post(`/posts/${post.id}/like`);
      if (res.data.success) {
        setLiked(res.data.data);
      }
    } catch (err) {
      // Revert if API fails (e.g. mock posts)
      console.warn('Like toggle backend notice:', err.message);
    }
  };

  const handleToggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await api.get(`/posts/${post.id}/comments`);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.warn('Comments fetch notice:', err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newCommentPayload = {
      id: Date.now(),
      content: commentText.trim(),
      author: {
        id: currentUser?.id,
        firstName: currentUser?.firstName || 'User',
        lastName: currentUser?.lastName || '',
        headline: currentUser?.headline || 'LinkSphere Member',
        profileImage: currentUser?.profileImage
      },
      createdAt: new Date().toISOString()
    };

    setComments([newCommentPayload, ...comments]);
    setCommentCount((prev) => prev + 1);
    setCommentText('');

    try {
      await api.post(`/posts/${post.id}/comments`, { content: newCommentPayload.content });
    } catch (err) {
      console.warn('Comment backend notice:', err.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    try {
      const res = await api.put(`/posts/${post.id}`, { content: editContent.trim(), imageUrl: post.imageUrl });
      if (res.data.success) {
        setIsEditing(false);
        if (onPostUpdated) onPostUpdated(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await api.delete(`/posts/${post.id}`);
      if (res.data.success && onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const diffHours = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const days = Math.floor(diffHours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-5 mb-4 hover:border-gray-300 dark:hover:border-slate-700 transition duration-200">
      {/* Author Header Row */}
      <div className="flex justify-between items-start mb-3">
        <div 
          onClick={() => onSelectUser && onSelectUser(author?.id)}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {author?.profileImage ? (
            <img
              src={author.profileImage}
              alt=""
              className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-slate-700 group-hover:ring-2 ring-blue-500 transition"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {author?.firstName?.charAt(0)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {author?.firstName} {author?.lastName}
              </h4>
              {author?.role === 'ROLE_ADMIN' && (
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" title="Administrator" />
              )}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-1 max-w-sm">
              {author?.headline || 'LinkSphere Member'}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
              {formatTimestamp(post.createdAt)} • Public
            </p>
          </div>
        </div>

        {/* Right side: Category badge & Options Menu */}
        <div className="flex items-center space-x-2">
          {detectedCategory && (
            (() => {
              const badge = getCategoryBadge(detectedCategory);
              const BadgeIcon = badge.icon;
              return (
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.class}`}>
                  <BadgeIcon className="w-3 h-3" />
                  <span>{detectedCategory}</span>
                </span>
              );
            })()
          )}

          {isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0f172a] rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 py-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Post</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content Body */}
      {isEditing ? (
        <div className="space-y-2 mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full text-xs p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xs sm:text-sm text-gray-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-3">
          {displayContent}
        </div>
      )}

      {/* Project snippet card attachment (if post links a project) */}
      {post.projectSnippet && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/60 mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-gray-900 dark:text-white">
                {post.projectSnippet.title}
              </h5>
              <div className="flex gap-1.5 mt-0.5">
                {post.projectSnippet.stack?.map((s, idx) => (
                  <span key={idx} className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                    #{s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {post.projectSnippet.demoUrl && (
            <a
              href={post.projectSnippet.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 text-xs font-bold rounded-lg hover:bg-blue-50 transition flex items-center gap-1 shrink-0"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Certificate snippet (if post celebrates certification) */}
      {post.certificateSnippet && (
        <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-600 text-white shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-gray-900 dark:text-white">
                {post.certificateSnippet.name}
              </h5>
              <p className="text-[10px] text-purple-700 dark:text-purple-300">
                Issued by {post.certificateSnippet.issuer} • ID: {post.certificateSnippet.credentialId}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Post Image Banner */}
      {post.imageUrl && (
        <div className="mb-3 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 max-h-96 bg-black">
          <img src={post.imageUrl} alt="Post media" className="w-full h-auto object-cover max-h-96" />
        </div>
      )}

      {/* Engagement Counter Strip */}
      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 pb-2 mb-1 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center space-x-1">
          <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] shadow-2xs">
            ❤️
          </span>
          <span>{likeCount} {likeCount === 1 ? 'reaction' : 'reactions'}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
          {author?.location && (
            <>
              <span>•</span>
              <span>{author.location}</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons: Like, Comment, Share */}
      <div className="grid grid-cols-3 gap-1 pt-1">
        {/* Like Button */}
        <button
          onClick={handleToggleLike}
          className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
            liked
              ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/80'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={handleToggleComments}
          className="py-2 px-3 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/80 flex items-center justify-center space-x-1.5 transition cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="py-2 px-3 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/80 flex items-center justify-center space-x-1.5 transition cursor-pointer relative"
        >
          {sharedToast ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Inline Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add a constructive, professional comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comment list */}
          {loadingComments ? (
            <div className="text-center py-2 text-xs text-gray-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-2 text-xs text-gray-400">No comments yet. Start the conversation!</div>
          ) : (
            <div className="space-y-2.5">
              {comments.map((cmt) => (
                <div key={cmt.id} className="flex items-start space-x-2.5 text-xs bg-gray-50/60 dark:bg-slate-900/50 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {cmt.author?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {cmt.author?.firstName} {cmt.author?.lastName}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">
                        {formatTimestamp(cmt.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-slate-300 mt-0.5">{cmt.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
