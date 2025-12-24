
import React, { useState } from 'react';
import { Post, User, PostType } from '../types';
import { X, Image as ImageIcon, Video, Type, Check } from 'lucide-react';

interface CreatePostProps {
  onPost: (post: Post) => void;
  user: User;
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPost, user, onClose }) => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postType, setPostType] = useState<PostType>('text');
  const [mediaUrl, setMediaUrl] = useState('');

  const handlePost = () => {
    if (!content.trim() && !mediaUrl) return;

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      type: mediaUrl ? 'image' : 'text',
      content,
      mediaUrl: mediaUrl || undefined,
      authorId: isAnonymous ? 'anon' : user.id,
      authorName: isAnonymous ? 'Anonymous' : user.name,
      authorAvatar: isAnonymous ? 'https://www.gravatar.com/avatar/0?d=mp&f=y' : user.avatar,
      timestamp: Date.now(),
      likes: 0,
      commentsCount: 0,
      isAnonymous,
      tags: [],
      aspectRatio: 1.0
    };

    onPost(newPost);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col h-full h-[100svh] md:max-w-xl md:mx-auto md:my-8 md:h-auto md:max-h-[85vh] md:rounded-3xl md:shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-500">
      <header className="px-4 py-3 sm:py-4 pt-[calc(0.75rem+env(safe-area-inset-top))] flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X size={24} /></button>
        <h2 className="font-serif text-xl italic">Create Post</h2>
        <button 
          onClick={handlePost} 
          disabled={!content.trim() && !mediaUrl}
          className="bg-[#2D2D2D] text-white px-6 py-2 rounded-full text-sm font-medium disabled:opacity-30 active:scale-95 transition-transform"
        >
          Post
        </button>
      </header>

      <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-6">
          <img src={isAnonymous ? 'https://www.gravatar.com/avatar/0?d=mp&f=y' : user.avatar} className="w-10 h-10 rounded-full border border-gray-100 object-cover" alt="" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{isAnonymous ? 'Posting Anonymously' : user.name}</span>
            <button 
              onClick={() => setIsAnonymous(!isAnonymous)}
              className="text-[10px] uppercase tracking-wider text-[#C2D1C2] font-bold text-left hover:text-[#2D2D2D] transition-colors"
            >
              Toggle {isAnonymous ? 'Public' : 'Anonymous'}
            </button>
          </div>
        </div>

        <textarea
          placeholder="What's on your mind? Share a thought, mood, or aesthetic..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] text-xl font-serif italic focus:outline-none resize-none placeholder:text-gray-300 leading-relaxed"
          autoFocus
        />

        {mediaUrl && (
          <div className="mt-4 relative rounded-2xl overflow-hidden shadow-md">
            <img src={mediaUrl} className="w-full h-auto max-h-[40vh] object-cover" alt="Upload preview" />
            <button onClick={() => setMediaUrl('')} className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white backdrop-blur-sm hover:bg-black/70 transition-colors"><X size={16}/></button>
          </div>
        )}
      </div>

      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6 border-t border-gray-100 flex items-center gap-8 flex-shrink-0">
        <button 
          onClick={() => setMediaUrl(`https://picsum.photos/seed/${Math.random()}/600/800`)}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#C2D1C2] transition-colors"
        >
          <ImageIcon size={26} />
          <span className="text-[10px] uppercase font-bold tracking-widest">Image</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 cursor-not-allowed opacity-40">
          <Video size={26} />
          <span className="text-[10px] uppercase font-bold tracking-widest">Video</span>
        </button>
        <div className="ml-auto flex items-center gap-2">
            <span className="text-[9px] text-gray-400 uppercase font-black tracking-[0.2em] hidden xs:block">Honest Content Only</span>
            <div className="w-2 h-2 rounded-full bg-[#C2D1C2] shadow-[0_0_8px_rgba(194,209,194,0.4)]"></div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;