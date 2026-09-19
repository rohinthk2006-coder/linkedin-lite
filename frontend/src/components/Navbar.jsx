import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  Home, 
  Users, 
  Briefcase,
  FolderGit2,
  MessageSquare,
  Bell, 
  User as UserIcon, 
  Search, 
  LogOut, 
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Settings,
  Edit3
} from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab, onSearch, onOpenEditProfile }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setShowSearchDropdown(false);
        setShowProfileMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    if (e) e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      setShowSearchDropdown(false);
    }
  };

  const handleSuggestionClick = (query) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
    setShowSearchDropdown(false);
  };

  const navigateTo = (tab) => {
    setCurrentTab(tab);
    setIsDrawerOpen(false);
    setShowProfileMenu(false);
  };

  const searchSuggestions = [
    { category: "People", query: "React developers", icon: Users },
    { category: "Jobs", query: "Java internships", icon: Briefcase },
    { category: "Projects", query: "Spring Boot projects", icon: FolderGit2 },
    { category: "Skills", query: "UI/UX designers", icon: Sparkles },
    { category: "Posts", query: "Virtual Threads", icon: TrendingUp }
  ];

  const navItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Smart Search */}
            <div className="flex items-center space-x-3 flex-1 min-w-0 mr-4">
              {/* Hamburger Button (Mobile / Tablet Drawer) */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden p-2 -ml-1.5 rounded-xl text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Open menu"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Logo */}
              <div 
                onClick={() => navigateTo('feed')} 
                className="flex items-center space-x-2 cursor-pointer group shrink-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                  LS
                </div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-white hidden sm:inline">
                  Link<span className="text-blue-600 dark:text-blue-400">Sphere</span>
                </span>
              </div>

              {/* Smart Search Bar with Dropdown */}
              <div ref={searchRef} className="relative max-w-sm sm:max-w-md w-full ml-1 sm:ml-2">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search professionals, skills, projects..."
                    value={searchQuery}
                    onFocus={() => setShowSearchDropdown(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-slate-900/80 border border-transparent dark:border-slate-800 rounded-xl text-xs sm:text-sm placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-white focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition"
                  />
                </form>

                {/* Search Autocomplete Suggestions Dropdown */}
                {showSearchDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#131b2e] rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                      Popular Searches
                    </div>
                    {searchSuggestions.map((sug, idx) => {
                      const Icon = sug.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSuggestionClick(sug.query)}
                          className="px-3.5 py-2 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 flex items-center justify-between cursor-pointer transition"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">
                              {sug.query}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800">
                            {sug.category}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`relative flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl transition cursor-pointer group ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5 mb-0.5" />
                      {item.badge > 0 && (
                        <span className="absolute -top-1 -right-2.5 bg-red-500 text-white text-[10px] font-extrabold rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-xs">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium">{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Theme Toggle & User Menu */}
            <div className="flex items-center space-x-2 pl-2">
              {/* Quick Dark Mode Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {/* User Profile Avatar Dropdown Menu */}
              <div ref={profileMenuRef} className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-1.5 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer focus:outline-hidden"
                  aria-label="User menu"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user?.firstName?.charAt(0)}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400 hidden sm:inline" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#131b2e] rounded-2xl shadow-xl py-2 z-50 border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                      <div className="flex items-center space-x-3 mb-2">
                        {user?.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                            {user?.firstName?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                            {user?.headline || user?.email}
                          </p>
                        </div>
                      </div>

                      {user?.role === 'ROLE_ADMIN' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Admin
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => navigateTo('profile')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/80 flex items-center space-x-2.5 transition"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (onOpenEditProfile) onOpenEditProfile();
                        else navigateTo('profile');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/80 flex items-center space-x-2.5 transition"
                    >
                      <Edit3 className="w-4 h-4 text-indigo-600" />
                      <span>Edit Profile</span>
                    </button>

                    <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600 dark:text-slate-400">Dark Mode</span>
                      <button
                        onClick={toggleTheme}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition ${
                          isDark ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center space-x-2.5 border-t border-gray-100 dark:border-slate-800 transition"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Sliding Navigation Drawer (Mobile & Tablet) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-[#131b2e] shadow-2xl z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* Drawer Top Header */}
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div 
              onClick={() => navigateTo('feed')}
              className="flex items-center space-x-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
                LS
              </div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white">
                Link<span className="text-blue-600 dark:text-blue-400">Sphere</span>
              </span>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sessions in Drawer */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Account & Theme Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/60">
          <div className="flex items-center space-x-3 mb-3">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-slate-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {user?.firstName?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                {user?.headline || user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleTheme}
              className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                logout();
              }}
              className="px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 rounded-xl transition flex items-center justify-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 py-1.5 px-3 flex items-center justify-around shadow-lg">
        {[
          { id: 'feed', label: 'Home', icon: Home },
          { id: 'network', label: 'Network', icon: Users },
          { id: 'jobs', label: 'Jobs', icon: Briefcase },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: UserIcon },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
