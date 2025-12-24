
import React from 'react';
import { Tab } from '../types';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  unreadCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, unreadCount = 0 }) => {
  const tabs = [
    { id: Tab.FEED, icon: Home, label: 'Home' },
    { id: Tab.SEARCH, icon: Search, label: 'Discover' },
    { id: Tab.CREATE, icon: PlusCircle, label: 'Post' },
    { id: Tab.COMMUNITY, icon: MessageSquare, label: 'Community' },
    { id: Tab.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex justify-around items-center z-50 md:sticky md:top-0 md:h-screen md:w-28 md:flex-col md:bg-[#FAF9F6] md:border-t-0 md:border-r md:border-[#E6D5C5]/20 md:py-10 md:justify-start md:gap-6">
      {/* Desktop Branding Arena */}
      <div className="hidden md:flex flex-col items-center justify-center mb-12 group cursor-pointer flex-shrink-0" onClick={() => setActiveTab(Tab.FEED)}>
        <div className="w-16 h-16 bg-[#2D2D2D] rounded-[1.75rem] flex items-center justify-center text-white font-serif italic text-4xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.3)] transform group-hover:rotate-[12deg] group-hover:scale-110 transition-all duration-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
          L
        </div>
        <div className="mt-4 flex gap-1">
          <div className="h-1 w-1 bg-[#E6D5C5] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <div className="h-1 w-6 bg-[#E6D5C5] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
          <div className="h-1 w-1 bg-[#E6D5C5] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200"></div>
        </div>
      </div>

      <div className="flex md:flex-col w-full justify-around md:justify-start md:gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCommunity = tab.id === Tab.COMMUNITY;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-[1.5rem] transition-all duration-500 flex-1 md:flex-none ${
                isActive 
                  ? 'text-[#2D2D2D] bg-[#E6D5C5]/30 shadow-[0_10px_20px_-5px_rgba(230,213,197,0.4)] scale-105' 
                  : 'text-[#9A9A9A] hover:text-[#2D2D2D] hover:bg-[#E6D5C5]/15'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2 : 1.5} className="transition-transform duration-500 group-hover:scale-110 md:w-[26px] md:h-[26px]" />
              {isCommunity && unreadCount > 0 && (
                <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] items-center justify-center rounded-full bg-[#FF4D4D] text-[9px] sm:text-[10px] font-black text-white shadow-md ring-2 ring-white md:ring-[#FAF9F6] animate-pulse">
                  {unreadCount}
                </span>
              )}
              <span className="text-[8px] sm:text-[9px] mt-1 font-black uppercase tracking-[0.2em] md:hidden truncate max-w-[60px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;