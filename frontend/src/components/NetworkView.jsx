import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, UserPlus, X, Check, MapPin, Users, MessageSquare, Trash2, ExternalLink } from 'lucide-react';

export const NetworkView = ({ onSelectUser, onNavigateMessages }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('recommended'); // 'recommended', 'pending', 'connections'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      const [pendingRes, recRes, connRes] = await Promise.all([
        api.get('/connections/pending'),
        api.get('/users/recommended'),
        api.get('/connections'),
      ]);

      if (pendingRes.data.success) setPendingRequests(pendingRes.data.data);
      if (recRes.data.success) setRecommendedUsers(recRes.data.data);
      if (connRes.data.success) setConnections(connRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      const res = await api.put(`/connections/${id}/accept`);
      if (res.data.success) {
        fetchNetworkData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const res = await api.put(`/connections/${id}/reject`);
      if (res.data.success) {
        fetchNetworkData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnectUser = async (targetId) => {
    try {
      const res = await api.post(`/connections/request/${targetId}`);
      if (res.data.success) {
        setRecommendedUsers((prev) =>
          prev.map((u) => (u.id === targetId ? { ...u, connectionStatus: 'PENDING' } : u))
        );
      }
    } catch (err) {
      // optimistic pending
      setRecommendedUsers((prev) =>
        prev.map((u) => (u.id === targetId ? { ...u, connectionStatus: 'PENDING' } : u))
      );
    }
  };

  const handleRemoveConnection = async (targetId) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    setConnections((prev) => prev.filter((c) => c.id !== targetId));
    try {
      await api.delete(`/connections/${targetId}`);
    } catch (err) {
      // fallback
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl p-12 text-center text-xs text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-800">
        Loading your professional network...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Navigation Tabs */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-2 flex space-x-2">
        <button
          onClick={() => setActiveSubTab('recommended')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeSubTab === 'recommended'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          Recommended People ({recommendedUsers.length})
        </button>

        <button
          onClick={() => setActiveSubTab('pending')}
          className={`relative flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'pending'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Pending Invitations</span>
          {pendingRequests.length > 0 && (
            <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
              activeSubTab === 'pending' ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
            }`}>
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('connections')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeSubTab === 'connections'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          My Connections ({connections.length})
        </button>
      </div>

      {/* PENDING REQUESTS SECTION */}
      {activeSubTab === 'pending' && (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Pending Connection Invitations
          </h2>

          {pendingRequests.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-slate-500 italic py-8 text-center">
              No pending invitations at this time.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 gap-3">
                  <div 
                    onClick={() => onSelectUser && onSelectUser(req.sender?.id)}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    {req.sender?.profileImage ? (
                      <img src={req.sender.profileImage} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {req.sender?.firstName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                        {req.sender?.firstName} {req.sender?.lastName}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1">{req.sender?.headline}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="px-3 py-1.5 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition flex items-center space-x-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RECOMMENDED USERS GRID */}
      {activeSubTab === 'recommended' && (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Recommended Professionals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedUsers.map((person) => {
              const isPending = person.connectionStatus === 'PENDING';
              return (
                <div
                  key={person.id}
                  className="bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition text-center flex flex-col justify-between p-4"
                >
                  <div 
                    onClick={() => onSelectUser && onSelectUser(person.id)}
                    className="cursor-pointer"
                  >
                    {person.profileImage ? (
                      <img
                        src={person.profileImage}
                        alt=""
                        className="w-18 h-18 rounded-full object-cover mx-auto mb-3 border-2 border-white dark:border-slate-700 shadow-xs"
                      />
                    ) : (
                      <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-xs">
                        {person.firstName?.charAt(0)}
                      </div>
                    )}
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                      {person.firstName} {person.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mt-1 px-2 min-h-8">
                      {person.headline || 'LinkSphere Engineering Member'}
                    </p>

                    {/* Mutual connections & Skills */}
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-2">
                      3 mutual connections
                    </p>
                  </div>

                  {/* Skills chips */}
                  <div className="flex flex-wrap gap-1 justify-center my-3">
                    {['React', 'Spring Boot'].map((sk, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectUser && onSelectUser(person.id)}
                      className="py-1.5 px-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl border border-gray-200 dark:border-slate-700 transition"
                    >
                      View Profile
                    </button>

                    {isPending ? (
                      <button
                        disabled
                        className="py-1.5 px-2 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 text-xs font-semibold rounded-xl cursor-not-allowed"
                      >
                        Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnectUser(person.id)}
                        className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5 mr-1" />
                        <span>Connect</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MY CONNECTIONS LIST */}
      {activeSubTab === 'connections' && (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-xs border border-gray-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Your Connections ({connections.length})
          </h2>

          {connections.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-slate-500 italic text-center py-8">
              You have no accepted connections yet. Connect with professionals above to expand your network!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3.5 bg-gray-50/80 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 gap-3">
                  <div 
                    onClick={() => onSelectUser && onSelectUser(c.id)}
                    className="flex items-center space-x-3 cursor-pointer min-w-0"
                  >
                    {c.profileImage ? (
                      <img src={c.profileImage} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-slate-700 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {c.firstName?.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate">
                        {c.firstName} {c.lastName}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{c.headline}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => onNavigateMessages && onNavigateMessages()}
                      className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-xl transition"
                      title="Send Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectUser && onSelectUser(c.id)}
                      className="p-2 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition"
                      title="View Profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveConnection(c.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                      title="Remove Connection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
