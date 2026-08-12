import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Home, 
  Users, 
  Bell, 
  User as UserIcon, 
  Search, 
  LogOut, 
  Briefcase, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab, onSearch }) => {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      if (res.data.success) {
        setUnreadCount(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
      setCurrentTab('search');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Search Bar */}
          <div className="flex items-center space-x-4 flex-1">
            <div 
              onClick={() => setCurrentTab('feed')} 
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-blue-700 transition">
                LS
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:inline">
                Link<span className="text-blue-600">Sphere</span>
              </span>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xs w-full hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search professionals, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-md text-sm placeholder-gray-500 focus:outline-hidden focus:bg-white focus:border-blue-500 transition"
              />
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={() => setCurrentTab('feed')}
              className={`flex flex-col items-center py-2 px-3 text-xs font-medium rounded-md transition ${
                currentTab === 'feed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="h-5 w-5 mb-0.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentTab('network')}
              className={`flex flex-col items-center py-2 px-3 text-xs font-medium rounded-md transition ${
                currentTab === 'network' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-5 w-5 mb-0.5" />
              <span>My Network</span>
            </button>

            <button
              onClick={() => setCurrentTab('notifications')}
              className={`relative flex flex-col items-center py-2 px-3 text-xs font-medium rounded-md transition ${
                currentTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Bell className="h-5 w-5 mb-0.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex flex-col items-center py-2 px-3 text-xs font-medium rounded-md transition ${
                currentTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserIcon className="h-5 w-5 mb-0.5" />
              <span>Me</span>
            </button>

            {/* User Dropdown Menu */}
            <div className="relative ml-3">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 focus:outline-hidden p-1 rounded-full hover:bg-gray-100"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.firstName}
                    className="h-8 w-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    {user?.firstName?.charAt(0)}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.headline || user?.email}</p>
                    {user?.role === 'ROLE_ADMIN' && (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Admin
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentTab('profile');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-gray-100"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </nav>
        </div>
      </div>
    </header>
  );
};
