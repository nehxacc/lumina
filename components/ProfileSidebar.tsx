
import React from 'react';
import { User } from '../types';
import { PenLine, Users, Heart, Sparkles, MessageCircle } from 'lucide-react';

interface ProfileSidebarProps {
  user: User;
  onEditClick: () => void;
  onWhisperClick: (contactId: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, onEditClick, onWhisperClick }) => {
  const recentWhispers = [
    { id: '2', name: 'Sarah Chen', lastMsg: 'I loved that aesthetic...', avatar: 'https://picsum.photos/id/65/100/100' },
    { id: '3', name: 'Maya Blue', lastMsg: 'Are you going to the gallery?', avatar: 'https://picsum.photos/id/70/100/100' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 border-l border-[#E6D5C5]/15 bg-[#FAF9F6]/50 backdrop-blur-sm p-8 animate-in slide-in-from-right duration-700">
      <div className="flex flex-col items-center">
        {/* Profile Card Summary */}
        <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-[0_15px_40px_-15px_rgba(230,213,197,0.3)] border border-[#E6D5C5]/10 group transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
          <div className="relative mb-6 flex justify-center">
            <div className="p-1 rounded-full bg-gradient-to-tr from-[#E6D5C5] to-[#C2D1C2] shadow-sm">
              <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-white object-cover" alt={user.name} />
            </div>
            <button 
              onClick={onEditClick}
              className="absolute -bottom-1 right-1/2 translate-x-12 bg-[#2D2D2D] text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 border-2 border-white"
            >
              <PenLine size={14} />
            </button>
          </div>

          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl italic tracking-tight text-[#2D2D2D]">{user.name}</h3>
            <p className="text-[10px] text-[#AFAFAF] font-bold uppercase tracking-[0.2em] mt-1">@{user.username}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
            <div className="text-center">
              <span className="block text-xl font-medium text-[#2D2D2D]">{user.followers.length}</span>
              <span className="text-[8px] uppercase font-bold text-[#AFAFAF] tracking-[0.2em]">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-medium text-[#2D2D2D]">{user.following.length}</span>
              <span className="text-[8px] uppercase font-bold text-[#AFAFAF] tracking-[0.2em]">Following</span>
            </div>
          </div>
        </div>

        {/* Recent Whispers Shortcut */}
        <div className="w-full mt-10">
          <div className="flex items-center gap-2 mb-6">
             <MessageCircle size={14} className="text-[#E6D5C5]" />
             <h4 className="text-[10px] uppercase font-black text-[#AFAFAF] tracking-[0.3em]">Recent Whispers</h4>
          </div>
          
          <div className="space-y-4">
            {recentWhispers.map(whisper => (
              <button 
                key={whisper.id}
                onClick={() => onWhisperClick(whisper.id)}
                className="w-full bg-white/40 border border-[#E6D5C5]/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all group/whisper"
              >
                <div className="relative flex-shrink-0">
                  <img src={whisper.avatar} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#C2D1C2] border-2 border-white rounded-full"></div>
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-[#2D2D2D] truncate group-hover/whisper:text-[#C2D1C2] transition-colors">{whisper.name}</p>
                  <p className="text-[9px] text-[#7A7A7A] mt-0.5 italic truncate">"{whisper.lastMsg}"</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-10 text-center">
           <p className="text-[10px] text-[#AFAFAF] font-medium tracking-widest uppercase">Lumina Beta v1.0</p>
           <p className="text-[9px] text-[#AFAFAF]/60 mt-2 italic">A quiet space for honest souls.</p>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
