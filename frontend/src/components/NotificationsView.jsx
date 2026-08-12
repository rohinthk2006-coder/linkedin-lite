import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, CheckCheck, ThumbsUp, MessageSquare, UserPlus, Info } from 'lucide-react';

export const NotificationsView = ({ onSelectReference }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'POST_LIKE':
        return <ThumbsUp className="h-4 w-4 text-blue-600" />;
      case 'POST_COMMENT':
        return <MessageSquare className="h-4 w-4 text-emerald-600" />;
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPT':
        return <UserPlus className="h-4 w-4 text-purple-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-gray-500">Loading notifications...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          Notifications
        </h2>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-blue-600 hover:underline font-semibold flex items-center"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500 italic text-center py-8">You have no notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) handleMarkAsRead(n.id);
                if (onSelectReference) onSelectReference(n.type, n.referenceId);
              }}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                n.isRead ? 'bg-white border-gray-100 hover:bg-gray-50' : 'bg-blue-50/60 border-blue-200'
              }`}
            >
              <div className="p-2 rounded-full bg-white border border-gray-200 shadow-xs mt-0.5">
                {getNotificationIcon(n.type)}
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium leading-tight">{n.message}</p>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {new Date(n.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {!n.isRead && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2" title="Unread"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
