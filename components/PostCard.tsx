
import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Bookmark, Share2, Quote, Send, X, Users, MessageSquare } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onAuthorClick?: (authorId: string) => void;
  onQuickWhisper?: (authorId: string) => void;
  onClick?: () => void;
}

interface LocalComment {
  id: string;
  authorName: string;
  content: string;
  timestamp: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, onAuthorClick, onQuickWhisper, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<LocalComment[]>([
    { id: 'c1', authorName: 'Sarah Chen', content: 'This is so inspiring ✨', timestamp: Date.now() - 1800000 },
    { id: 'c2', authorName: 'Maya Blue', content: 'The lighting is perfect.', timestamp: Date.now() - 900000 }
  ]);

  const isAuthorInteractive = onAuthorClick && !post.isAnonymous && post.authorId !== 'anon' && !post.authorId.startsWith('external');

  const handleAuthorAction = (e: React.MouseEvent) => {
    if (isAuthorInteractive) {
      e.stopPropagation();
      onAuthorClick?.(post.authorId);
    }
  };

  const handleQuickWhisper = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthorInteractive && onQuickWhisper) {
      onQuickWhisper(post.authorId);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment: LocalComment = {
      id: Math.random().toString(36).substr(2, 9),
      authorName: 'You',
      content: commentText,
      timestamp: Date.now()
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
  };

  const textPostStyles = [
    'bg-gradient-to-br from-[#E6D5C5]/10 to-[#FAF9F6]',
    'bg-gradient-to-br from-[#C2D1C2]/10 to-[#FAF9F6]',
    'bg-gradient-to-br from-[#E5B7B7]/10 to-[#FAF9F6]',
  ];
  const bgStyle = textPostStyles[post.id.charCodeAt(post.id.length - 1) % textPostStyles.length];

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_20px_-8px_rgba(230,213,197,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(200,180,160,0.4)] transition-all duration-700 flex flex-col hover:-translate-y-2 border border-white/50 w-full min-w-0 cursor-zoom-in"
    >
      
      {/* Share Overlay */}
      {showShare && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md animate-in fade-in duration-300 p-5 sm:p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-5 sm:mb-6 flex-shrink-0">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2D2D2D] truncate">Share Muse</h4>
            <button onClick={() => setShowShare(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar flex-1">
            <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E6D5C5]/20">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#AFAFAF] mb-3 block">Whisper to a Soul</span>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {['Sarah', 'Maya', 'Elena', 'Chloe'].map((name, i) => (
                  <button key={i} className="flex flex-col items-center gap-2 flex-shrink-0 group/soul">
                    <img src={`https://picsum.photos/id/${60+i}/80/80`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-sm group-hover/soul:ring-2 ring-[#C2D1C2] transition-all object-cover" alt="" />
                    <span className="text-[9px] font-bold text-[#2D2D2D] truncate max-w-[50px]">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E6D5C5]/20">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#AFAFAF] mb-3 block">Cast to a Circle</span>
              <div className="flex flex-col gap-2">
                {['Quiet Readers', 'Artists Collective', 'Morning Muses'].map((circle, i) => (
                  <button key={i} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-[#E6D5C5]/20 w-full text-left">
                    <div className="w-8 h-8 rounded-lg bg-[#C2D1C2]/20 flex items-center justify-center text-[#C2D1C2] flex-shrink-0">
                      <Users size={16} />
                    </div>
                    <span className="text-[11px] font-bold text-[#2D2D2D] truncate">{circle}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button className="mt-4 py-3 bg-[#2D2D2D] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex-shrink-0">
            Share Externally
          </button>
        </div>
      )}

      {/* Media Section */}
      {post.type === 'image' && post.mediaUrl && (
        <div 
          className="relative overflow-hidden bg-gray-50 w-full"
          style={{ 
            aspectRatio: `${post.aspectRatio}`,
            maxHeight: 'min(600px, 70svh)'
          }}
        >
          <img 
            src={post.mediaUrl} 
            alt={post.content} 
            className="w-full h-full object-cover transition-transform duration-[2s] cubic-bezier(0.1, 0, 0, 1) group-hover:scale-110" 
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          {/* Floating Actions for Images */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75 z-10">
             <button 
              onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
              className={`p-2 sm:p-2.5 rounded-full backdrop-blur-md border border-white/30 transition-all shadow-lg ${isSaved ? 'bg-[#C2D1C2] text-white' : 'bg-white/80 text-[#2D2D2D] hover:bg-white'}`}
             >
                <Bookmark size={14} className="sm:w-[16px] sm:h-[16px]" fill={isSaved ? 'currentColor' : 'none'} />
             </button>
             <button 
              onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
              className="p-2 sm:p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/30 text-[#2D2D2D] hover:bg-white transition-all shadow-lg"
             >
                <Share2 size={14} className="sm:w-[16px] sm:h-[16px]" />
             </button>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className={`p-4 sm:p-6 flex flex-col gap-3 flex-1 min-w-0 ${post.type === 'text' ? bgStyle : ''}`}>
        {post.type === 'text' && (
          <div className="relative py-2 sm:py-4">
            <Quote className="absolute -top-1 -left-1 text-[#E6D5C5]/30 hidden xs:block" size={32} />
            <p className="font-serif text-lg sm:text-2xl leading-[1.4] text-[#2D2D2D] italic relative z-10 tracking-tight break-words">
              {post.content}
            </p>
          </div>
        )}
        
        {post.type === 'image' && post.content && (
          <p className="text-[12px] sm:text-[13px] text-[#5A5A5A] line-clamp-2 leading-relaxed font-normal break-words">
            {post.content}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-1">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[7px] sm:text-[8px] text-[#AFAFAF] font-black uppercase tracking-[0.2em] px-2 py-0.5 sm:py-1 rounded-md bg-white/50 border border-transparent group-hover:border-[#E6D5C5]/20 transition-all truncate max-w-[80px]">
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && <span className="text-[7px] sm:text-[8px] text-gray-300 font-bold uppercase tracking-widest pt-1">...</span>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E6D5C5]/10 gap-2">
          <div 
            className={`flex items-center gap-2 group/author min-w-0 ${isAuthorInteractive ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={handleAuthorAction}
          >
            <div className="relative flex-shrink-0">
              <img 
                src={post.authorAvatar} 
                alt={post.authorName} 
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-[#E6D5C5]/20 transition-all ${isAuthorInteractive ? 'group-hover/author:ring-[#C2D1C2]/60' : ''}`} 
              />
              {!post.isAnonymous && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#C2D1C2] border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-[10px] sm:text-[11px] font-bold truncate tracking-tight ${post.isAnonymous ? 'italic text-[#AFAFAF]' : 'text-[#2D2D2D]'} ${isAuthorInteractive ? 'group-hover/author:text-[#C2D1C2]' : ''}`}>
                {post.authorName}
              </span>
              <span className="text-[7px] sm:text-[8px] text-gray-300 font-bold uppercase tracking-widest leading-none">Muse</span>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
             <button 
                onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl transition-all duration-300 ${
                  isLiked ? 'bg-[#E5B7B7]/10 text-[#E5B7B7]' : 'text-[#AFAFAF] hover:text-[#2D2D2D] hover:bg-gray-50'
                }`}
             >
                <Heart 
                  size={14} 
                  className={`sm:w-[16px] sm:h-[16px] transition-all duration-500 ${isLiked ? 'scale-110' : 'group-hover:scale-110'}`} 
                  fill={isLiked ? 'currentColor' : 'none'} 
                />
                <span className="text-[9px] sm:text-[10px] font-black">{post.likes + (isLiked ? 1 : 0)}</span>
             </button>

             <button 
                onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
                className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl transition-all ${showComments ? 'bg-[#E6D5C5]/20 text-[#2D2D2D]' : 'text-[#AFAFAF] hover:text-[#2D2D2D] hover:bg-gray-50'}`}
             >
                <MessageCircle size={14} className="sm:w-[16px] sm:h-[16px]" />
                <span className="text-[9px] sm:text-[10px] font-black">{comments.length}</span>
             </button>

             {post.type === 'text' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
                  className="p-1.5 sm:p-2 text-[#AFAFAF] hover:text-[#2D2D2D] transition-colors"
                >
                  <Share2 size={14} className="sm:w-[16px] sm:h-[16px]" />
                </button>
             )}
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-[#E6D5C5]/10 animate-in slide-in-from-top-2 duration-300 flex-shrink-0"
          >
            <div className="max-h-32 sm:max-h-40 overflow-y-auto no-scrollbar space-y-3 sm:space-y-4 mb-3 sm:mb-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#2D2D2D] truncate">{comment.authorName}</span>
                    <span className="text-[7px] sm:text-[8px] text-[#AFAFAF] uppercase tracking-widest flex-shrink-0">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-[12px] text-[#5A5A5A] leading-relaxed italic break-words">"{comment.content}"</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Whisper back..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-[#FAF9F6] py-2.5 sm:py-3 pl-3 sm:pl-4 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl text-[11px] sm:text-[12px] focus:outline-none focus:ring-1 ring-[#E6D5C5]/30 shadow-inner"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 sm:right-2 p-1.5 sm:p-2 text-[#C2D1C2] hover:text-[#2D2D2D] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Send size={14} className="sm:w-[16px] sm:h-[16px]" />
              </button>
            </form>
          </div>
        )}
      </div>
      
      {/* Visual Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E6D5C5]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 flex-shrink-0" />
    </div>
  );
};

export default PostCard;
