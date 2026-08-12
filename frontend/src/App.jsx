import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CreatePostBox } from './components/CreatePostBox';
import { PostCard } from './components/PostCard';
import { ProfileSections } from './components/ProfileSections';
import { NetworkView } from './components/NetworkView';
import { NotificationsView } from './components/NotificationsView';
import { SearchView } from './components/SearchView';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import api from './services/api';
import { Sparkles, TrendingUp, Users, ExternalLink } from 'lucide-react';

const MainLayout = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'network', 'profile', 'notifications', 'search'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile state for viewing current user or other selected user
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [targetProfile, setTargetProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Feed state
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Recommended widget users
  const [recommendedWidget, setRecommendedWidget] = useState([]);

  useEffect(() => {
    if (currentTab === 'feed') {
      fetchFeedPosts();
    }
    fetchRecommendedWidget();
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === 'profile') {
      const targetId = selectedUserId || user?.id;
      if (targetId) {
        fetchUserProfile(targetId);
      }
    }
  }, [currentTab, selectedUserId, user?.id]);

  const fetchFeedPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await api.get('/posts/feed');
      if (res.data.success) {
        setPosts(res.data.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    setLoadingProfile(true);
    try {
      const res = await api.get(`/users/${userId}`);
      if (res.data.success) {
        setTargetProfile(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchRecommendedWidget = async () => {
    try {
      const res = await api.get('/users/recommended');
      if (res.data.success) {
        setRecommendedWidget(res.data.data.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUserId(id);
    setCurrentTab('profile');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentTab('search');
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handlePostDeleted = (deletedId) => {
    setPosts(posts.filter((p) => p.id !== deletedId));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={(tab) => {
        if (tab === 'profile') setSelectedUserId(null); // Reset to logged in user profile when clicking "Me"
        setCurrentTab(tab);
      }} onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR (Profile Summary & Quick Stats) */}
          <div className="lg:col-span-3">
            <Sidebar onNavigateProfile={() => {
              setSelectedUserId(null);
              setCurrentTab('profile');
            }} />
          </div>

          {/* MAIN DYNAMIC CONTENT AREA */}
          <div className="lg:col-span-6">
            
            {/* FEED TAB */}
            {currentTab === 'feed' && (
              <>
                <CreatePostBox onPostCreated={handlePostCreated} />
                
                {loadingPosts ? (
                  <div className="bg-white rounded-xl p-8 text-center text-sm text-gray-500 shadow-xs border border-gray-200">
                    Loading professional feed...
                  </div>
                ) : posts.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center shadow-xs border border-gray-200">
                    <p className="text-gray-600 font-semibold text-sm">Your feed is empty.</p>
                    <p className="text-gray-400 text-xs mt-1">Connect with other professionals or create a post to start!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onPostUpdated={handlePostUpdated}
                      onPostDeleted={handlePostDeleted}
                      onSelectUser={handleSelectUser}
                    />
                  ))
                )}
              </>
            )}

            {/* MY NETWORK TAB */}
            {currentTab === 'network' && (
              <NetworkView onSelectUser={handleSelectUser} />
            )}

            {/* PROFILE TAB */}
            {currentTab === 'profile' && (
              loadingProfile || !targetProfile ? (
                <div className="bg-white rounded-xl p-12 text-center text-sm text-gray-500 shadow-xs border border-gray-200">
                  Loading profile details...
                </div>
              ) : (
                <ProfileSections
                  targetProfile={targetProfile}
                  isOwnProfile={targetProfile.id === user?.id}
                  onProfileReload={() => fetchUserProfile(targetProfile.id)}
                  onNavigateNetwork={() => setCurrentTab('network')}
                />
              )
            )}

            {/* NOTIFICATIONS TAB */}
            {currentTab === 'notifications' && (
              <NotificationsView onSelectReference={(type, refId) => {
                if (type === 'CONNECTION_REQUEST' || type === 'CONNECTION_ACCEPT') {
                  setCurrentTab('network');
                } else {
                  setCurrentTab('feed');
                }
              }} />
            )}

            {/* SEARCH TAB */}
            {currentTab === 'search' && (
              <SearchView initialKeyword={searchQuery} onSelectUser={handleSelectUser} />
            )}

          </div>

          {/* RIGHT WIDGETS PANEL */}
          <div className="lg:col-span-3 space-y-4 hidden lg:block">
            {/* LinkSphere News & Trends */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center justify-between mb-3">
                <span>LinkSphere News</span>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                    Java 21 Virtual Threads adoption surges
                  </h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">Top Tech News • 1,420 readers</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                    Remote Work Trends in 2026
                  </h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">Career Insights • 980 readers</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                    Spring Boot 3.2 Security Best Practices
                  </h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">Engineering • 3,210 readers</p>
                </div>
              </div>
            </div>

            {/* Recommended Connections Box */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Add to your feed</h3>
              
              <div className="space-y-3">
                {recommendedWidget.map((person) => (
                  <div key={person.id} className="flex items-center space-x-2.5">
                    {person.profileImage ? (
                      <img src={person.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {person.firstName?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p 
                        onClick={() => handleSelectUser(person.id)}
                        className="font-semibold text-xs text-gray-900 truncate hover:text-blue-600 cursor-pointer"
                      >
                        {person.firstName} {person.lastName}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{person.headline}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentTab('network')}
                className="w-full mt-3 pt-2 text-center text-xs font-semibold text-blue-600 hover:underline border-t border-gray-100 flex items-center justify-center"
              >
                <span>View all recommendations</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        LinkSphere Networking Platform &copy; 2026 — Built with Spring Boot 3 & React 18
      </footer>
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-semibold">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold animate-pulse">
            LS
          </div>
          <span>Loading LinkSphere...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <LoginPage onNavigateRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onNavigateLogin={() => setAuthView('login')} />
    );
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
