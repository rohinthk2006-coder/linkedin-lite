import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, UserPlus, MapPin } from 'lucide-react';

export const SearchView = ({ initialKeyword, onSelectUser }) => {
  const [keyword, setKeyword] = useState(initialKeyword || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialKeyword) {
      performSearch(initialKeyword);
    }
  }, [initialKeyword]);

  const performSearch = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/users/search?keyword=${encodeURIComponent(query.trim())}`);
      if (res.data.success) {
        setUsers(res.data.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(keyword);
  };

  const handleConnect = async (targetId) => {
    try {
      const res = await api.post(`/connections/request/${targetId}`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetId ? { ...u, connectionStatus: 'PENDING' } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, headline, location, or skill..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-blue-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Search Results {keyword ? `for "${keyword}"` : ''} ({users.length})
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500 italic text-center py-6">Searching network...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-6">No matching professionals found.</p>
        ) : (
          <div className="space-y-4 divide-y divide-gray-100">
            {users.map((person) => (
              <div key={person.id} className="pt-4 first:pt-0 flex items-center justify-between">
                <div 
                  onClick={() => onSelectUser && onSelectUser(person.id)}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  {person.profileImage ? (
                    <img src={person.profileImage} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {person.firstName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600">
                      {person.firstName} {person.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{person.headline}</p>
                    {person.location && (
                      <p className="text-[11px] text-gray-400 flex items-center mt-0.5">
                        <MapPin className="h-3 w-3 mr-0.5" />
                        {person.location}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {person.connectionStatus === 'SELF' ? (
                    <span className="text-xs text-gray-400 italic">You</span>
                  ) : person.connectionStatus === 'ACCEPTED' ? (
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Connected
                    </span>
                  ) : person.connectionStatus === 'PENDING' ? (
                    <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnect(person.id)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700 transition flex items-center space-x-1"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
