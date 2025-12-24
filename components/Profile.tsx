
import React, { useState } from 'react';
import { User, Post } from '../types';
import PostCard from './PostCard';
import { User as UserIcon, Grid, Bookmark, Users, ChevronLeft, UserPlus, MessageSquare, ShieldAlert, Check, PenLine, Save, X } from 'lucide-react';

interface ProfileProps {
  user: User;
  posts: Post[];
  isOwnProfile?: boolean;
  currentUser?: User;
  onBack?: () => void;
  onMessageClick?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user: initialUser, posts, isOwnProfile = false, currentUser, onBack, onMessageClick }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'info'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>(initialUser);
  const [editValues, setEditValues] = useState({
    bio: user.bio || '',
    mbti: user.mbti || '',
    interests: user.interests.join(', ')
  });

  const followsYou = currentUser && user.following.includes(currentUser.id);

  const handleSave = () => {
    setUser({
      ...user,
      bio: editValues.bio,
      mbti: editValues.mbti,
      interests: editValues.interests.split(',').map(i => i.trim()).filter(i => i !== '')
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      bio: user.bio || '',
      mbti: user.mbti || '',
      interests: user.interests.join(', ')
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Profile Header Stats - Matched to Screenshot */}
      {!isEditing && (
        <div className="flex justify-center items-center gap-12 mb-12 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-medium tracking-tighter text-[#2D2D2D]">{user.followers.length + (isFollowing ? 1 : 0)}</span>
            <span className="text-[10px] uppercase font-bold text-[#AFAFAF] tracking-[0.2em] mt-1">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-medium tracking-tighter text-[#2D2D2D]">{user.following.length}</span>
            <span className="text-[10px] uppercase font-bold text-[#AFAFAF] tracking-[0.2em] mt-1">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-medium tracking-tighter text-[#2D2D2D]">{posts.length}</span>
            <span className="text-[10px] uppercase font-bold text-[#AFAFAF] tracking-[0.2em] mt-1">Posts</span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mb-10 px-4 relative">
        {(onBack && !isEditing) && (
          <button 
            onClick={onBack} 
            className="absolute left-4 top-0 p-2 hover:bg-[#E6D5C5]/20 rounded-full transition-colors text-[#7A7A7A]"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div className="relative mb-6">
          <div className="p-1.5 rounded-full bg-gradient-to-tr from-[#E6D5C5] via-[#C2D1C2] to-[#E5B7B7]">
            <img src={user.avatar} className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover" />
          </div>
          {isOwnProfile && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-1 -right-1 bg-white p-3 rounded-full shadow-xl border border-[#E6D5C5]/10 hover:scale-110 transition-transform group" 
              title="Edit Profile"
            >
              <UserIcon size={18} className="text-[#2D2D2D] group-hover:text-[#C2D1C2]" />
              <div className="absolute -top-1 -right-1 bg-[#2D2D2D] text-white p-1 rounded-full border-2 border-white">
                <PenLine size={8} />
              </div>
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="w-full bg-white rounded-[3rem] p-8 shadow-xl border border-[#E6D5C5]/20 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-serif italic text-center mb-8">Refine your Soul</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-[0.3em] block mb-2 px-2">Your Whisper (Bio)</label>
                <textarea 
                  value={editValues.bio}
                  onChange={(e) => setEditValues({...editValues, bio: e.target.value})}
                  className="w-full bg-[#FAF9F6] border border-transparent focus:border-[#E6D5C5]/30 rounded-2xl p-4 text-[15px] italic font-light focus:outline-none min-h-[100px] transition-all"
                  placeholder="Share a quiet thought..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-[0.3em] block mb-2 px-2">Archetype (MBTI)</label>
                  <input 
                    type="text"
                    value={editValues.mbti}
                    onChange={(e) => setEditValues({...editValues, mbti: e.target.value})}
                    className="w-full bg-[#FAF9F6] border border-transparent focus:border-[#E6D5C5]/30 rounded-2xl px-4 py-3 text-[14px] font-medium focus:outline-none transition-all"
                    placeholder="e.g. INFJ"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-[0.3em] block mb-2 px-2">Interests (Split by comma)</label>
                  <input 
                    type="text"
                    value={editValues.interests}
                    onChange={(e) => setEditValues({...editValues, interests: e.target.value})}
                    className="w-full bg-[#FAF9F6] border border-transparent focus:border-[#E6D5C5]/30 rounded-2xl px-4 py-3 text-[14px] font-medium focus:outline-none transition-all"
                    placeholder="Art, Coffee, Silence"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#2D2D2D] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#FAF9F6] text-[#7A7A7A] border border-[#E6D5C5]/30 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#E6D5C5]/10 active:scale-[0.98] transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-3xl font-serif italic tracking-tight">{user.name}</h2>
                {followsYou && !isOwnProfile && (
                  <span className="bg-[#FAF9F6] text-[9px] font-bold text-[#7A7A7A] px-2 py-0.5 rounded-md border border-[#E6D5C5]/30 uppercase tracking-widest">
                    Follows you
                  </span>
                )}
              </div>
              <span className="text-sm text-[#7A7A7A] font-medium tracking-wide">@{user.username}</span>
            </div>
            
            {user.bio && (
              <p className="text-center text-[15px] text-[#5A5A5A] leading-relaxed mb-8 px-6 max-w-md italic font-light">
                "{user.bio}"
              </p>
            )}

            {/* Action Buttons for Other Profiles */}
            {!isOwnProfile && (
              <div className="flex gap-4 mb-4 w-full max-w-sm">
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-sm ${
                    isFollowing 
                      ? 'bg-[#FAF9F6] border border-[#E6D5C5] text-[#2D2D2D]' 
                      : 'bg-[#2D2D2D] text-white hover:shadow-lg'
                  }`}
                >
                  {isFollowing ? <><Check size={16}/> Following</> : <><UserPlus size={16}/> Follow</>}
                </button>
                <button 
                  onClick={onMessageClick}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border border-[#E6D5C5]/30 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-[#2D2D2D] hover:bg-[#E6D5C5]/10 transition-all transform active:scale-95 shadow-sm"
                >
                  <MessageSquare size={16} /> Message
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {!isEditing && (
        <>
          {/* Profile Tabs - Redesigned to match Screenshot */}
          <div className="flex justify-center items-center mb-10 px-4">
            <div className="flex bg-[#F2F1ED]/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-white/50 shadow-sm">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`py-2.5 px-6 flex items-center gap-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'posts' ? 'bg-white text-[#2D2D2D] shadow-md' : 'text-[#AFAFAF] hover:text-[#2D2D2D]'}`}
              >
                <Grid size={18} strokeWidth={activeTab === 'posts' ? 2.5 : 2} />
                Posts
              </button>
              {isOwnProfile && (
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`py-2.5 px-6 flex items-center gap-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'saved' ? 'bg-white text-[#2D2D2D] shadow-md' : 'text-[#AFAFAF] hover:text-[#2D2D2D]'}`}
                >
                  <Bookmark size={18} strokeWidth={activeTab === 'saved' ? 2.5 : 2} />
                  Saved
                </button>
              )}
              <button 
                onClick={() => setActiveTab('info')}
                className={`py-2.5 px-6 flex items-center gap-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'info' ? 'bg-white text-[#2D2D2D] shadow-md' : 'text-[#AFAFAF] hover:text-[#2D2D2D]'}`}
              >
                <Users size={18} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
                Soul
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-2 pb-12">
            {activeTab === 'posts' && (
              <div className="grid grid-cols-2 gap-6">
                {posts.map(post => <PostCard key={post.id} post={post} />)}
                {posts.length === 0 && (
                  <div className="col-span-2 py-24 text-center bg-white rounded-[3rem] border border-[#E6D5C5]/20 border-dashed">
                    <p className="font-serif italic text-gray-300 text-xl">No public whispers yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && isOwnProfile && (
              <div className="py-24 text-center bg-white rounded-[3rem] border border-[#E6D5C5]/20 border-dashed animate-in fade-in zoom-in-95">
                <Bookmark size={48} className="mx-auto text-gray-100 mb-6" />
                <p className="font-serif italic text-gray-400 text-xl">Your private gallery of inspiration.</p>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="bg-white rounded-[3rem] p-12 shadow-[0_15px_50px_-15px_rgba(230,213,197,0.2)] flex flex-col gap-10 border border-[#E6D5C5]/10 animate-in fade-in slide-in-from-bottom-4">
                {user.showMBTI && user.mbti && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <span className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-[0.3em] block mb-2">Inner Archetype</span>
                    <p className="font-serif text-3xl italic text-[#2D2D2D]">{user.mbti}</p>
                  </div>
                )}
                
                {user.showAge && user.age && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                    <span className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-[0.3em] block mb-2">Age</span>
                    <p className="font-serif text-3xl italic text-[#2D2D2D]">{user.age} solar cycles</p>
                  </div>
                )}

                {user.showInterests && user.interests.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                    <span className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-[0.3em] block mb-4">Interests</span>
                    <div className="flex flex-wrap gap-3">
                      {user.interests.map(interest => (
                        <span key={interest} className="px-5 py-3 bg-[#FAF9F6] border border-[#E6D5C5]/20 rounded-2xl text-[12px] font-bold text-[#2D2D2D] hover:bg-[#E6D5C5]/10 transition-colors shadow-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!user.showAge && !user.showMBTI && !user.showInterests && (
                  <div className="text-center py-12">
                    <ShieldAlert size={48} className="mx-auto text-gray-100 mb-6" />
                    <p className="text-gray-400 font-serif italic text-xl">This soul values their privacy.</p>
                  </div>
                )}

                {!isOwnProfile && (
                  <div className="pt-8 border-t border-gray-100 flex justify-end">
                    <button className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em] hover:text-[#FF4D4D] transition-colors flex items-center gap-2">
                      Report Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
