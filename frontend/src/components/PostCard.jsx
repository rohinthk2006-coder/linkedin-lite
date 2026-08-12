import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Send,
  User as UserIcon,
  CheckCircle
} from 'lucide-react';

export const PostCard = ({ post, onPostUpdated, onPostDeleted, onSelectUser }) => {
  const { user: currentUser } = useAuth();
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isAuthor = currentUser?.id === post.author?.id;

  const handleToggleLike = async () => {
    try {
      const res = await api.post(`/posts/${post.id}/like`);
      if (res.data.success) {
        const isNowLiked = res.data.data;
        setLiked(isNowLiked);
        setLikeCount((prev) => (isNowLiked ? prev + 1 : prev - 1));
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
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
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content: commentText.trim() });
      if (res.data.success) {
        setComments([res.data.data, ...comments]);
        setCommentCount((prev) => prev + 1);
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
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

  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 mb-4">
      {/* Post Author Info */}
      <div className="flex items-center justify-between mb-3">
        <div 
          onClick={() => onSelectUser && onSelectUser(post.author.id)}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {post.author?.profileImage ? (
            <img
              src={post.author.profileImage}
              alt={post.author.firstName}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {post.author?.firstName?.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition flex items-center gap-1">
              {post.author?.firstName} {post.author?.lastName}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-1">{post.author?.headline}</p>
            <p className="text-[11px] text-gray-400">{formatTimestamp(post.createdAt)}</p>
          </div>
        </div>

        {/* Options Menu */}
        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit3 className="h-3.5 w-3.5 text-gray-500" />
                  <span>Edit Post</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  <span>Delete Post</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-blue-500 rounded-md text-sm focus:outline-hidden"
            rows={3}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-800 whitespace-pre-wrap mb-3 leading-relaxed">{post.content}</p>
      )}

      {/* Optional Post Image */}
      {post.imageUrl && !isEditing && (
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-100 max-h-96">
          <img src={post.imageUrl} alt="Post attachment" className="w-full object-cover" />
        </div>
      )}

      {/* Counts Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 pb-1 border-b border-gray-100">
        <span className="flex items-center">
          <span className="bg-blue-500 text-white p-0.5 rounded-full mr-1">
            <ThumbsUp className="h-2.5 w-2.5" />
          </span>
          {likeCount} likes
        </span>
        <button onClick={handleToggleComments} className="hover:underline">
          {commentCount} comments
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around py-1 text-xs font-semibold text-gray-600 border-b border-gray-100 mt-1">
        <button
          onClick={handleToggleLike}
          className={`flex items-center justify-center space-x-1.5 py-1.5 w-full rounded-md transition hover:bg-gray-50 ${
            liked ? 'text-blue-600 font-bold' : 'hover:text-gray-900'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-blue-600' : ''}`} />
          <span>Like</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center justify-center space-x-1.5 py-1.5 w-full hover:bg-gray-50 hover:text-gray-900 rounded-md transition"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 pt-2">
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-2 mb-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-gray-100 border border-transparent rounded-full focus:outline-hidden focus:bg-white focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-1.5 bg-blue-600 text-white rounded-full disabled:opacity-50 hover:bg-blue-700 transition"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Comment List */}
          {loadingComments ? (
            <p className="text-xs text-gray-400 text-center py-2">Loading comments...</p>
          ) : (
            <div className="space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2 text-xs bg-gray-50 p-2.5 rounded-lg">
                  <div 
                    onClick={() => onSelectUser && onSelectUser(comment.user.id)}
                    className="cursor-pointer"
                  >
                    {comment.user?.profileImage ? (
                      <img src={comment.user.profileImage} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {comment.user?.firstName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span 
                        onClick={() => onSelectUser && onSelectUser(comment.user.id)}
                        className="font-semibold text-gray-900 cursor-pointer hover:underline"
                      >
                        {comment.user?.firstName} {comment.user?.lastName}
                      </span>
                      <span className="text-[10px] text-gray-400">{formatTimestamp(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 mt-0.5">{comment.content}</p>
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
