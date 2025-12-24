
import React, { useState } from 'react';
import { getInspiration, SearchResult } from '../services/gemini';
import { Search as SearchIcon, ExternalLink, Sparkles, User as UserIcon, Globe, Map } from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface SearchProps {
  onAuthorClick?: (authorId: string) => void;
}

const Search: React.FC<SearchProps> = ({ onAuthorClick }) => {
  const [activeMode, setActiveMode] = useState<'souls' | 'inspiration'>('souls');
  const [query, setQuery] = useState('');
  const [webResults, setWebResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const internalResults = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase()) || 
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (activeMode === 'inspiration') {
      setIsLoading(true);
      const result = await getInspiration(query);
      setWebResults(result);
      setIsLoading(false);
    }
  };

  const openExternal = (platform: 'google' | 'pinterest' | 'youtube') => {
    if (!query.trim()) return;
    const q = encodeURIComponent(query);
    let url = '';
    if (platform === 'google') url = `https://www.google.com/search?q=${q}+aesthetic`;
    if (platform === 'pinterest') url = `https://www.pinterest.com/search/pins/?q=${q}`;
    if (platform === 'youtube') url = `https://www.youtube.com/results?search_query=${q}+mood`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_-10px_rgba(230,213,197,0.3)] p-6 sm:p-8 mb-8 border border-[#E6D5C5]/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-3xl sm:text-4xl italic tracking-tight">Search</h2>
          <div className="flex bg-[#F2F1ED] p-1 rounded-2xl">
            <button 
              onClick={() => setActiveMode('souls')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'souls' ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#AFAFAF]'}`}
            >
              Souls
            </button>
            <button 
              onClick={() => setActiveMode('inspiration')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'inspiration' ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#AFAFAF]'}`}
            >
              Web
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="relative mb-8">
          <input
            type="text"
            placeholder={activeMode === 'souls' ? "Find a specific soul..." : "Find real aesthetic inspiration..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (activeMode === 'souls') setWebResults(null);
            }}
            className="w-full bg-[#FAF9F6] border border-transparent rounded-[1.5rem] py-4 sm:py-5 pl-12 sm:pl-14 pr-24 sm:pr-32 focus:outline-none focus:ring-2 focus:ring-[#E6D5C5]/50 transition-all text-base shadow-inner"
          />
          <SearchIcon className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          {activeMode === 'inspiration' && (
            <button 
              type="submit" 
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-[#2D2D2D] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-transform"
            >
              {isLoading ? 'Seeking...' : 'Seek'}
            </button>
          )}
        </form>

        <div className="flex flex-col sm:flex-row gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#AFAFAF] self-center">External deep dive:</span>
          <div className="flex gap-2 flex-1">
            <button onClick={() => openExternal('pinterest')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-100 hover:bg-[#E6D5C5]/10 transition-all group">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#7A7A7A] group-hover:text-[#2D2D2D]">Pinterest</span>
              <ExternalLink size={12} className="text-gray-300" />
            </button>
            <button onClick={() => openExternal('youtube')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-100 hover:bg-[#E6D5C5]/10 transition-all group">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#7A7A7A] group-hover:text-[#2D2D2D]">YouTube</span>
              <ExternalLink size={12} className="text-gray-300" />
            </button>
            <button onClick={() => openExternal('google')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-100 hover:bg-[#E6D5C5]/10 transition-all group">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#7A7A7A] group-hover:text-[#2D2D2D]">Google</span>
              <ExternalLink size={12} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {activeMode === 'inspiration' && webResults && (
        <div className="bg-white border border-[#E6D5C5]/40 rounded-[3rem] p-8 sm:p-10 animate-in zoom-in-95 duration-700 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6 text-[#C2D1C2]">
            <Sparkles size={20} />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Web Analysis</span>
          </div>
          <p className="text-lg italic font-light text-[#2D2D2D] leading-relaxed mb-10 pl-6 border-l-2 border-[#E6D5C5]/30">
            {webResults.text}
          </p>
          
          {webResults.sources.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-[#AFAFAF] mb-4">Honest Sources</h4>
              <div className="flex flex-col gap-3">
                {webResults.sources.map((source, idx) => (
                  source.web && (
                    <a 
                      key={idx} 
                      href={source.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-2xl border border-transparent hover:border-[#E6D5C5]/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Globe size={16} className="text-[#C2D1C2] flex-shrink-0" />
                        <span className="text-[11px] font-bold text-[#2D2D2D] truncate">{source.web.title}</span>
                      </div>
                      <ExternalLink size={14} className="text-gray-300 group-hover:text-[#2D2D2D] transition-colors" />
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeMode === 'souls' && (
        <div className="px-1">
          <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#AFAFAF] mb-6 border-b border-[#E6D5C5]/20 pb-2">Soul Search Results</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {query.trim() === '' ? (
              <div className="col-span-full py-12 text-center text-[#AFAFAF] italic font-light">
                Enter a name to find a soul in the Lumina community.
              </div>
            ) : internalResults.length > 0 ? (
              internalResults.map(user => (
                <div 
                  key={user.id} 
                  className="bg-white p-5 rounded-[2rem] flex items-center gap-5 border border-[#E6D5C5]/10 shadow-sm hover:shadow-md transition-all cursor-pointer group/card"
                  onClick={() => onAuthorClick?.(user.id)}
                >
                  <img src={user.avatar} className="w-12 h-12 rounded-full shadow-inner border border-[#E6D5C5]/10 object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-[#2D2D2D] block truncate group-hover/card:text-[#C2D1C2]">{user.name}</span>
                    <span className="text-[10px] text-[#AFAFAF] font-medium tracking-wide">@{user.username}</span>
                  </div>
                  <UserIcon size={16} className="text-[#E6D5C5] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-[2rem] border border-[#E6D5C5]/10 border-dashed">
                <p className="text-[#AFAFAF] font-serif italic text-lg">No internal souls found matching "{query}"</p>
                <button 
                  onClick={() => setActiveMode('inspiration')}
                  className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#C2D1C2] hover:text-[#2D2D2D] transition-colors"
                >
                  Try searching the web instead?
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
