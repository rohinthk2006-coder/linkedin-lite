import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Bell, 
  CheckCheck, 
  ThumbsUp, 
  MessageSquare, 
  UserPlus, 
  Briefcase, 
  Award, 
  Sparkles, 
  User, 
  ArrowRight,
  Info 
} from 'lucide-react';

export const NotificationsView = ({ onSelectReference, onNavigateJobs, onNavigateNetwork, onNavigateProfile }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Connections', 'Jobs', 'Profile', 'Achievements'];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data.success && Array.isArray(res.data.data)) {
        const mappedBackend = res.data.data.map((n) => ({
          ...n,
          category: n.type?.includes('CONNECTION') ? 'Connections' : 'All',
          timestamp: n.createdAt ? new Date(n.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Just now'
        }));
        setNotifications(mappedBackend);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.warn('Notifications API note:', err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      // safe fallback
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
    } catch (err) {
      // safe fallback
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CONNECTION_ACCEPT':
      case 'CONNECTION_REQUEST':
        return <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'JOB_MATCH':
        return <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'SKILL_ENDORSEMENT':
        return <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case 'PROFILE_VIEW':
      case 'PROFILE_STRENGTH':
        return <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'POST_LIKE':
        return <ThumbsUp className="w-4 h-4 text-rose-500" />;
      case 'POST_COMMENT':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === 'All') return true;
    return n.category === activeCategory;
  });

  return (
    <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Stay updated on connections, opportunities, and endorsements</p>
          </div>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 text-xs text-gray-400 dark:text-slate-500">
          No notifications in this category.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) handleMarkAsRead(n.id);
                if (n.actionHandler) n.actionHandler();
                else if (onSelectReference) onSelectReference(n.type, n.referenceId);
              }}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3.5 ${
                n.isRead
                  ? 'bg-white dark:bg-[#131b2e] border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                  : 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 shadow-2xs'
              }`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xs mt-0.5 shrink-0">
                {getNotificationIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium leading-snug">
                  {n.message}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    {n.timestamp || 'Recent'}
                  </span>
                  {n.actionText && (
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline">
                      <span>{n.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {!n.isRead && (
                <span className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 shrink-0" title="Unread" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
