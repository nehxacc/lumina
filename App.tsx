
import React, { useState, useEffect } from 'react';
import { Tab, Post, User, Group, Message } from './types';
import { MOCK_POSTS, MOCK_USERS, MOCK_GROUPS } from './constants';
import Navigation from './components/Navigation';
import Feed from './components/Feed';
import Search from './components/Search';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import Community from './components/Community';
import ProfileSidebar from './components/ProfileSidebar';
import PostDetailOverlay from './components/PostDetailOverlay';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.FEED);
  const [currentUser] = useState<User>(MOCK_USERS[0]);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [groups] = useState<Group[]>(MOCK_GROUPS);
  const [unreadCount] = useState(2); // Mocked unread count
  const [activeWhisperId, setActiveWhisperId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, viewingUser]);

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setActiveTab(Tab.FEED);
  };

  const handleAuthorClick = (authorId: string) => {
    if (authorId === 'anon' || authorId.startsWith('external')) return;
    
    const user = MOCK_USERS.find(u => u.id === authorId);
    if (user) {
      setViewingUser(user);
      setActiveTab(Tab.PROFILE);
      setSelectedPost(null);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setViewingUser(null);
    setActiveTab(tab);
    setSelectedPost(null);
    if (tab !== Tab.COMMUNITY) {
      setActiveWhisperId(null);
    }
  };

  const handleOpenWhisper = (contactId: string) => {
    setActiveWhisperId(contactId);
    setActiveTab(Tab.COMMUNITY);
    setSelectedPost(null);
  };

  const renderContent = () => {
    if (viewingUser && activeTab === Tab.PROFILE) {
      return (
        <Profile 
          user={viewingUser} 
          posts={posts.filter(p => p.authorId === viewingUser.id && !p.isAnonymous)} 
          isOwnProfile={viewingUser.id === currentUser.id}
          currentUser={currentUser}
          onBack={() => setViewingUser(null)}
          onMessageClick={() => handleOpenWhisper(viewingUser.id)}
        />
      );
    }

    switch (activeTab) {
      case Tab.FEED:
        return <Feed posts={posts} onAuthorClick={handleAuthorClick} onQuickWhisper={handleOpenWhisper} onPostClick={setSelectedPost} />;
      case Tab.SEARCH:
        return <Search onAuthorClick={handleAuthorClick} />;
      case Tab.CREATE:
        return <CreatePost onPost={handleCreatePost} user={currentUser} onClose={() => setActiveTab(Tab.FEED)} />;
      case Tab.COMMUNITY:
        return (
          <Community 
            groups={groups} 
            currentUser={currentUser} 
            initialWhisperId={activeWhisperId}
            onWhisperChange={setActiveWhisperId}
          />
        );
      case Tab.PROFILE:
        return (
          <Profile 
            user={currentUser} 
            posts={posts.filter(p => p.authorId === currentUser.id)} 
            isOwnProfile={true}
            currentUser={currentUser}
          />
        );
      default:
        return <Feed posts={posts} onAuthorClick={handleAuthorClick} onQuickWhisper={handleOpenWhisper} onPostClick={setSelectedPost} />;
    }
  };

  const MessageBadge = () => (
    unreadCount > 0 ? (
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4D4D] text-[9px] font-bold text-white shadow-sm ring-2 ring-[#FAF9F6] animate-in zoom-in duration-300">
        {unreadCount}
      </span>
    ) : null
  );

  return (
    <div className="min-h-screen min-h-[100svh] bg-[#FAF9F6] text-[#2D2D2D] flex flex-col md:flex-row overflow-x-hidden">
      <Navigation activeTab={activeTab} setActiveTab={handleTabChange} unreadCount={unreadCount} />

      <div className="flex-1 flex flex-col w-full min-w-0">
        <header className="md:hidden sticky top-0 z-40 bg-[#FAF9F6]/80 backdrop-blur-md px-6 py-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between border-b border-[#E6D5C5]/30">
          <h1 className="font-serif text-3xl italic font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#2D2D2D] to-[#7A7A7A]">Lumina</h1>
          <div className="flex gap-4">
             <button onClick={() => handleTabChange(Tab.COMMUNITY)} className="relative p-2 hover:bg-[#E6D5C5]/20 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                <MessageBadge />
             </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="hidden md:flex items-center justify-between px-10 py-10">
              <div className="relative">
                <h1 className="font-serif text-5xl italic font-medium tracking-tighter opacity-[0.08] select-none hover:opacity-20 transition-opacity duration-700 cursor-pointer" onClick={() => handleTabChange(Tab.FEED)}>Lumina</h1>
                <div className="absolute -bottom-1 left-0 w-8 h-[2px] bg-[#E6D5C5]/40"></div>
              </div>
              
              <button onClick={() => handleTabChange(Tab.COMMUNITY)} className="relative p-3.5 bg-white shadow-[0_4px_20px_-4px_rgba(230,213,197,0.4)] border border-[#E6D5C5]/10 rounded-[1.25rem] text-[#7A7A7A] hover:text-[#2D2D2D] hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                <MessageBadge />
              </button>
            </div>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-10 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-12 w-full min-w-0">
              {renderContent()}
            </main>
          </div>

          <ProfileSidebar 
            user={currentUser} 
            onEditClick={() => handleTabChange(Tab.PROFILE)} 
            onWhisperClick={handleOpenWhisper}
          />
        </div>
      </div>

      {selectedPost && (
        <PostDetailOverlay 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onAuthorClick={handleAuthorClick}
        />
      )}
    </div>
  );
};

export default App;
