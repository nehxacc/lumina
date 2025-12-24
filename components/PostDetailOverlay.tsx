
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { X, Heart, MessageCircle, Bookmark, Share2, Quote, Send, ArrowLeft, MoreVertical } from 'lucide-react';

interface PostDetailOverlayProps {
  post: Post;
  onClose: () => void;
  onAuthorClick?: (authorId: string) => void;
}

const PostDetailOverlay: React.FC<PostDetailOverlayProps> = ({ post, onClose, onAuthorClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 'c1', authorName: 'Sarah Chen', content: 'There\'s something about this light that feels so nostalgic.', timestamp: Date.now() - 3600000 },
    { id: 'c2', authorName: 'Maya Blue', content: 'Saved this for my moodboard! ✨', timestamp: Date.now() - 1800000 },
    { id: 'c3', authorName: 'Elena Vance', content: 'The composition here is breathtaking.', timestamp: Date.now() - 900000 }
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([{ id: Date.now().toString(), authorName: 'You', content: commentText, timestamp: Date.now() }, ...comments]);
    setCommentText('');
  };

  const textPostStyles = [
    'bg-gradient-to-br from-[#E6D5C5]/20 to-white',
    'bg-gradient-to-br from-[#C2D1C2]/20 to-white',
    'bg-gradient-to-br from-[#E5B7B7]/20 to-white',
  ];
  const bgStyle = textPostStyles[post.id.charCodeAt(post.id.length - 1) % textPostStyles.length];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col md:items-center md:justify-center animate-in fade-in duration-300 px-0 md:px-6">
      <div 
        className="absolute inset-0 cursor-zoom-out" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#FAF9F6] w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-12 duration-700">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 pt-[calc(1rem+env(safe-area-inset-top))] bg-white/80 backdrop-blur-md border-b border-[#E6D5C5]/20 flex-shrink-0 z-10">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-[#E6D5C5]/20 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#AFAFAF]">Post by</span>
             <span className="text-sm font-serif italic font-bold">{post.authorName}</span>
          </div>
          <button className="p-2 -mr-2 text-gray-300"><MoreVertical size={20} /></button>
        </div>

        {/* Media / Main Content Panel */}
        <div className={`flex-[1.2] flex flex-col items-center justify-center overflow-hidden min-h-[35vh] md:min-h-0 ${post.type === 'text' ? bgStyle : 'bg-black/5'}`}>
          {post.type === 'image' && post.mediaUrl ? (
            <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
              <img 
                src={post.mediaUrl} 
                className="max-w-full max-h-full object-contain rounded-2xl sm:rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-1000"
                alt={post.content}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center px-10 text-center relative p-12">
              <Quote size={60} className="text-[#E6D5C5]/20 absolute top-12 left-12" />
              <p className="font-serif text-3xl sm:text-5xl leading-tight italic text-[#2D2D2D] max-w-2xl relative z-10 animate-in slide-in-from-bottom-4">
                {post.content}
              </p>
              <Quote size={60} className="text-[#E6D5C5]/20 absolute bottom-12 right-12 rotate-180" />
            </div>
          )}
        </div>

        {/* Interaction / Details Panel */}
        <div className="w-full md:w-[420px] flex flex-col bg-white border-l border-[#E6D5C5]/20 flex-1 md:flex-none">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-[#E6D5C5]/10">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => onAuthorClick?.(post.authorId)}>
              <img src={post.authorAvatar} className="w-12 h-12 rounded-full border border-[#E6D5C5]/20 object-cover shadow-sm" alt={post.authorName} />
              <div>
                <h3 className="text-lg font-serif italic leading-none">{post.authorName}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#AFAFAF] mt-1.5">Shared a muse</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-[#2D2D2D]">
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 flex flex-col scroll-smooth">
            {post.type === 'image' && post.content && (
              <div className="mb-8">
                <span className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-[0.3em] block mb-3">The Narrative</span>
                <p className="text-[15px] text-[#5A5A5A] leading-relaxed italic font-light pl-4 border-l-2 border-[#E6D5C5]/20">
                  "{post.content}"
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#E6D5C5]/10 text-[#AFAFAF] hover:text-[#2D2D2D] transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Interaction Stats */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#E6D5C5]/10 px-2">
               <div className="flex items-center gap-8">
                 <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex flex-col items-center gap-1.5 transition-all ${isLiked ? 'text-[#E5B7B7]' : 'text-[#AFAFAF] hover:text-[#2D2D2D]'}`}
                 >
                   <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'scale-110' : 'hover:scale-110 transition-transform'} />
                   <span className="text-[10px] font-black">{post.likes + (isLiked ? 1 : 0)}</span>
                 </button>
                 <button className="flex flex-col items-center gap-1.5 text-[#2D2D2D]">
                   <MessageCircle size={24} className="text-[#C2D1C2]" />
                   <span className="text-[10px] font-black">{comments.length}</span>
                 </button>
                 <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex flex-col items-center gap-1.5 transition-all ${isSaved ? 'text-[#C2D1C2]' : 'text-[#AFAFAF] hover:text-[#2D2D2D]'}`}
                 >
                   <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} className="hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-tighter">Save</span>
                 </button>
               </div>
               <button className="p-3 bg-[#FAF9F6] rounded-2xl text-[#7A7A7A] hover:text-[#2D2D2D] transition-all border border-transparent hover:border-[#E6D5C5]/20">
                 <Share2 size={20} />
               </button>
            </div>

            {/* Comments Section */}
            <div className="flex-1 space-y-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-[0.3em] block">Whispers</span>
                <span className="text-[10px] font-bold text-[#AFAFAF]">{comments.length} thoughts</span>
              </div>
              
              {comments.length > 0 ? (
                <div className="space-y-8">
                  {comments.map((comment) => (
                    <div key={comment.id} className="animate-in fade-in slide-in-from-left-2 duration-500 group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[#2D2D2D] group-hover:text-[#C2D1C2] transition-colors">{comment.authorName}</span>
                        <span className="text-[8px] uppercase font-bold text-[#AFAFAF] tracking-widest">{new Date(comment.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[14px] text-[#5A5A5A] leading-relaxed font-light italic">
                        "{comment.content}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="font-serif italic text-gray-300 text-lg">No whispers yet. Be the first?</p>
                </div>
              )}
            </div>
          </div>

          {/* Comment Input */}
          <div className="p-6 sm:p-8 bg-gray-50/80 border-t border-[#E6D5C5]/10 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-8 flex-shrink-0">
            <form onSubmit={handleAddComment} className="relative group">
              <input 
                type="text" 
                placeholder="Whisper back..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-white border-2 border-transparent focus:border-[#E6D5C5]/30 rounded-[1.5rem] py-4 pl-6 pr-14 text-sm focus:outline-none transition-all shadow-md placeholder:text-gray-300"
              />
              <button 
                type="submit" 
                disabled={!commentText.trim()}
                className={`absolute right-2 top-2 p-2.5 rounded-2xl transition-all ${commentText.trim() ? 'bg-[#2D2D2D] text-white shadow-md active:scale-95 hover:bg-black' : 'text-gray-200 pointer-events-none'}`}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailOverlay;
