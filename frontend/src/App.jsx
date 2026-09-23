import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CreatePostBox } from './components/CreatePostBox';
import { PostCard } from './components/PostCard';
import { ProfileSections } from './components/ProfileSections';
import { NetworkView } from './components/NetworkView';
import { NotificationsView } from './components/NotificationsView';
import { SearchView } from './components/SearchView';
import { ProjectsView } from './components/ProjectsView';
import { JobsView } from './components/JobsView';
import { MessagesView } from './components/MessagesView';
import { RightSidebar } from './components/RightSidebar';
import { SkeletonPost } from './components/SkeletonLoader';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { IntroPage } from './pages/IntroPage';
import api from './services/api';

const MainLayout = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'network', 'jobs', 'projects', 'messages', 'notifications', 'profile', 'search'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile state for viewing current user or other selected user
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [targetProfile, setTargetProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileInitialAction, setProfileInitialAction] = useState(null);

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
      if (res.data.success && Array.isArray(res.data.data?.content)) {
        setPosts(res.data.data.content);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Failed to fetch feed posts:', err);
      setPosts([]);
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
        setRecommendedWidget(res.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUserId(id);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentTab('search');
  };

  const handlePostCreated = (newPost) => {
    if (!newPost) return;
    setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== newPost.id)]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handlePostDeleted = (deletedId) => {
    setPosts(posts.filter((p) => p.id !== deletedId));
  };

  // Determine whether to use 3-column layout or wide 2-column layout for messages/projects
  const isWideContent = currentTab === 'messages';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          if (tab === 'profile') setSelectedUserId(null); // Reset to logged in user profile when clicking "Me"
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        onSearch={handleSearch} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full pb-20 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR (Profile Summary & Quick Stats) */}
          <div className="lg:col-span-3">
            <Sidebar 
              onNavigateProfile={() => {
                setSelectedUserId(null);
                setCurrentTab('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateProjects={() => {
                setCurrentTab('projects');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateNetwork={() => {
                setCurrentTab('network');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddGithub={() => {
                setSelectedUserId(null);
                setProfileInitialAction('github');
                setCurrentTab('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddProject={() => {
                setSelectedUserId(null);
                setProfileInitialAction('project');
                setCurrentTab('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddCert={() => {
                setSelectedUserId(null);
                setProfileInitialAction('cert');
                setCurrentTab('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* MAIN DYNAMIC CONTENT AREA */}
          <div className={isWideContent ? "lg:col-span-9" : "lg:col-span-6"}>
            
            {/* FEED TAB */}
            {currentTab === 'feed' && (
              <>
                <CreatePostBox onPostCreated={handlePostCreated} />
                
                {loadingPosts ? (
                  <div className="space-y-4">
                    <SkeletonPost />
                    <SkeletonPost />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="bg-white dark:bg-[#131b2e] rounded-2xl p-8 text-center shadow-xs border border-gray-200 dark:border-slate-800">
                    <p className="text-gray-600 dark:text-slate-300 font-semibold text-sm">Your feed is empty.</p>
                    <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">Connect with other professionals or create a post to start!</p>
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

            {/* PROJECTS VIEW */}
            {currentTab === 'projects' && (
              <ProjectsView onSelectProject={() => {}} />
            )}

            {/* JOBS & OPPORTUNITIES VIEW */}
            {currentTab === 'jobs' && (
              <JobsView />
            )}

            {/* MESSAGES VIEW */}
            {currentTab === 'messages' && (
              <MessagesView />
            )}

            {/* PROFILE TAB */}
            {currentTab === 'profile' && (
              loadingProfile || !targetProfile ? (
                <div className="bg-white dark:bg-[#131b2e] rounded-2xl p-12 text-center text-sm text-gray-500 dark:text-slate-400 shadow-xs border border-gray-200 dark:border-slate-800">
                  Loading profile details...
                </div>
              ) : (
                <ProfileSections
                  targetProfile={targetProfile}
                  isOwnProfile={targetProfile.id === user?.id}
                  onProfileReload={() => fetchUserProfile(targetProfile.id)}
                  onNavigateNetwork={() => setCurrentTab('network')}
                  openModalOnMount={profileInitialAction}
                  onClearInitialAction={() => setProfileInitialAction(null)}
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

          {/* RIGHT WIDGETS PANEL (Hidden when viewing wide content like Messages) */}
          {!isWideContent && (
            <div className="lg:col-span-3 space-y-4 hidden lg:block">
              <RightSidebar 
                recommendedUsers={recommendedWidget}
                onSelectUser={handleSelectUser}
                onNavigateJobs={() => {
                  setCurrentTab('jobs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateNetwork={() => {
                  setCurrentTab('network');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

        </div>
      </main>

      <footer className="bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        LinkSphere Networking Platform &copy; 2026 — Verified Skills, Projects & Opportunities
      </footer>
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [showIntro, setShowIntro] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040816] flex items-center justify-center text-white font-semibold">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold animate-pulse shadow-lg shadow-blue-500/30">
            LS
          </div>
          <span className="text-slate-300 text-sm tracking-wide">Loading LinkSphere...</span>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return <IntroPage onComplete={() => setShowIntro(false)} />;
  }

  if (!user) {
    return authView === 'login' ? (
      <LoginPage 
        onNavigateRegister={() => setAuthView('register')} 
      />
    ) : (
      <RegisterPage onNavigateLogin={() => setAuthView('login')} />
    );
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
