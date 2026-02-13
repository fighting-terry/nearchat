
import React, { useState, useEffect } from 'react';
import { UserProfile, MatchProfile, ChatConversation } from '../types';
import { MOCK_MATCHES, MOCK_CHATS } from '../constants';
import FeedCard from './FeedCard';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';

interface DiscoveryFeedProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ userProfile, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'chats' | 'chat-room'>('discover');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  // Initialize with empty array to ensure fresh start every session as requested
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  // Derived state for the currently active conversation
  const selectedChat = conversations.find(c => c.id === selectedChatId) || null;

  const openChat = (chat: ChatConversation) => {
    setSelectedChatId(chat.id);
    setActiveTab('chat-room');
  };

  const backToChats = () => {
    setActiveTab('chats');
    setSelectedChatId(null);
  };

  const handleExit = () => {
    onLogout();
  };

  return (
    <div className="w-full max-w-md bg-white min-h-screen md:h-[850px] md:my-5 md:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden">
      {/* Header */}
      {activeTab !== 'chat-room' && (
        <div className="p-4 flex items-center justify-between z-20 bg-white/95 backdrop-blur-md border-b border-gray-50 sticky top-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 font-serif italic">NearChat</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleExit}
              className="text-rose-500 hover:bg-rose-50 transition-all flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-100 shadow-sm active:scale-90 transform"
              title="Reset and Exit"
            >
              <span className="text-xs font-bold">Exit</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
        {activeTab === 'discover' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24 animate-in fade-in duration-500">
            {/* Stories Section */}
            <div className="bg-white border-b border-gray-100 p-4 mb-2">
               <div className="flex space-x-4 overflow-x-auto no-scrollbar">
                  <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden">
                      <img src={userProfile.photoUrl} className="w-full h-full rounded-full object-cover grayscale opacity-30" alt="My Profile" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">My Status</span>
                  </div>
                  {MOCK_MATCHES.map(match => (
                    <div key={match.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 to-pink-400">
                        <div className="w-full h-full rounded-full p-0.5 bg-white">
                          <img src={match.photoUrls[0]} alt={match.nickname} className="w-full h-full rounded-full object-cover" />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-700">{match.nickname}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Main Feed */}
            <div className="space-y-0 md:space-y-4">
              {MOCK_MATCHES.map(match => (
                <FeedCard 
                  key={match.id} 
                  match={match} 
                  onMessage={() => {
                    const existingChat = conversations.find(c => c.match.id === match.id);
                    if (existingChat) {
                        openChat(existingChat);
                    } else {
                        // Added missing createdAt property to satisfy ChatConversation interface
                        const newChat: ChatConversation = {
                            id: 'chat-' + match.id,
                            match,
                            lastMessage: 'Say hi!',
                            lastTimestamp: new Date(),
                            messages: [],
                            createdAt: new Date()
                        };
                        setConversations(prev => [newChat, ...prev]);
                        openChat(newChat);
                    }
                  }}
                />
              ))}
              <div className="py-20 text-center text-gray-400 text-sm font-medium px-10 leading-relaxed italic">
                That's all for now!<br/>Check back later for new connections 🌹
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="flex-1 overflow-hidden animate-in fade-in duration-300 bg-white">
            <ChatList conversations={conversations} onSelectChat={openChat} />
          </div>
        )}

        {activeTab === 'chat-room' && selectedChat && (
          <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300 bg-white">
            <ChatRoom 
              conversation={selectedChat} 
              onBack={backToChats} 
              userProfile={userProfile}
              onUpdateMessages={(newMessages) => {
                setConversations(prev => prev.map(c => 
                  c.id === selectedChat.id 
                  ? { 
                      ...c, 
                      messages: newMessages, 
                      lastMessage: newMessages[newMessages.length - 1]?.text || c.lastMessage,
                      lastTimestamp: new Date() // Store as Date object
                    } 
                  : c
                ));
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation Bottom Bar */}
      {activeTab !== 'chat-room' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-50 py-3 px-20 flex justify-between items-center z-50">
          <button 
            onClick={() => setActiveTab('discover')} 
            className={`flex flex-col items-center p-1 transform transition-all active:scale-90 ${activeTab === 'discover' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill={activeTab === 'discover' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-bold mt-0.5">Discover</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('chats')} 
            className={`flex flex-col items-center p-1 transform transition-all active:scale-90 ${activeTab === 'chats' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-400'}`}
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill={activeTab === 'chats' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {conversations.some(c => c.messages.length > 0) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">Chats</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoveryFeed;
