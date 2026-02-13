
import React, { useState, useRef } from 'react';
import { MatchProfile } from '../types';

interface FeedCardProps {
  match: MatchProfile;
  onMessage: () => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ match, onMessage }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setCurrentImgIndex(newIndex);
  };

  return (
    <div className="bg-white border-y md:border border-gray-100 md:rounded-xl overflow-hidden shadow-sm mb-4">
      {/* User Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-rose-400 to-pink-500">
            <div className="w-full h-full rounded-full p-0.5 bg-white">
              <img src={match.photoUrls[0]} alt={match.nickname} className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-sm text-gray-900">{match.nickname}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-500 font-medium">{match.distance} • Active now</span>
          </div>
        </div>
        
        {/* Chat Button & Status Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end">
             <div className="flex items-center space-x-1 bg-rose-50 px-2 py-1 rounded-md">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                  {match.activeChatCount} Active Chats
                </span>
             </div>
          </div>
          <button 
            onClick={onMessage} 
            className="flex items-center space-x-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-full transition-all active:scale-95 shadow-sm"
          >
            <span className="text-xs font-bold">Chat</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative aspect-square bg-gray-100">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full"
        >
          {match.photoUrls.map((url, idx) => (
            <div key={idx} className="flex-shrink-0 w-full h-full snap-start">
              <img 
                src={url} 
                alt={`${match.nickname} ${idx + 1}`} 
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        {match.photoUrls.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 pointer-events-none">
            {match.photoUrls.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentImgIndex === idx ? 'bg-white scale-125 shadow-sm' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption Section */}
      <div className="p-4 pt-4">
        <div className="space-y-2">
          {/* User Basic Info Line */}
          <div className="flex items-center flex-wrap gap-x-2">
            <span className="font-extrabold text-[15px] text-gray-900">{match.nickname}</span>
            <span className="text-[13px] text-gray-400 font-medium">
              {match.age} • {match.gender} • {match.language}
            </span>
          </div>

          {/* Interests Line */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            {match.interests.map(interest => (
              <span 
                key={interest} 
                className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded text-[11px] font-bold uppercase tracking-tight"
              >
                #{interest.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
