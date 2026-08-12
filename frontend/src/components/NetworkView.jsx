import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, UserPlus, X, Check, MapPin, Users } from 'lucide-react';

export const NetworkView = ({ onSelectUser }) => {
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
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-gray-500">Loading your network...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Network Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-2 flex space-x-2">
        <button
          onClick={() => setActiveSubTab('recommended')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition ${
            activeSubTab === 'recommended' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Recommended People
        </button>
        <button
          onClick={() => setActiveSubTab('pending')}
          className={`relative flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition ${
            activeSubTab === 'pending' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span>Pending Invitations</span>
          {pendingRequests.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('connections')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition ${
            activeSubTab === 'connections' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          My Connections ({connections.length})
        </button>
      </div>

      {/* PENDING REQUESTS SECTION */}
      {activeSubTab === 'pending' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Connection Invitations</h2>
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-4 text-center">No pending invitations at this time.</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div 
                    onClick={() => onSelectUser && onSelectUser(req.sender.id)}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    {req.sender?.profileImage ? (
                      <img src={req.sender.profileImage} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {req.sender?.firstName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 hover:text-blue-600">
                        {req.sender?.firstName} {req.sender?.lastName}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{req.sender?.headline}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition"
                      title="Ignore"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700 transition flex items-center space-x-1"
                    >
                      <Check className="h-4 w-4 mr-1" />
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
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">People You May Know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedUsers.map((person) => (
              <div key={person.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition text-center flex flex-col justify-between p-4">
                <div 
                  onClick={() => onSelectUser && onSelectUser(person.id)}
                  className="cursor-pointer"
                >
                  {person.profileImage ? (
                    <img src={person.profileImage} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-white shadow-xs" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-3">
                      {person.firstName?.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-semibold text-sm text-gray-900 hover:text-blue-600">
                    {person.firstName} {person.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 px-2 min-h-8">{person.headline || 'Professional Member'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  {person.connectionStatus === 'PENDING' ? (
                    <button disabled className="w-full py-1.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full border border-gray-200">
                      Request Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectUser(person.id)}
                      className="w-full py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold rounded-full transition flex items-center justify-center space-x-1"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MY CONNECTIONS LIST */}
      {activeSubTab === 'connections' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Connections</h2>
          {connections.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-6">You have no accepted connections yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((c) => (
                <div key={c.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div 
                    onClick={() => onSelectUser && onSelectUser(c.id)}
                    className="cursor-pointer"
                  >
                    {c.profileImage ? (
                      <img src={c.profileImage} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {c.firstName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 
                      onClick={() => onSelectUser && onSelectUser(c.id)}
                      className="font-semibold text-sm text-gray-900 hover:text-blue-600 cursor-pointer"
                    >
                      {c.firstName} {c.lastName}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{c.headline}</p>
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
