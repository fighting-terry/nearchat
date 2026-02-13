
import React from 'react';
import { ChatConversation } from '../types';

interface ChatListProps {
  conversations: ChatConversation[];
  onSelectChat: (chat: ChatConversation) => void;
}

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const ChatList: React.FC<ChatListProps> = ({ conversations, onSelectChat }) => {
  return (
    <div className="h-full flex flex-col p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">Messages</h1>
      
      {/* Matches Horizontal Scroll */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">New Matches</h3>
        <div className="flex space-x-4 overflow-x-auto no-scrollbar px-2 pb-2">
          {conversations.map(conv => (
            <div key={conv.id + '-story'} className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer" onClick={() => onSelectChat(conv)}>
              <div className="w-16 h-16 rounded-full p-0.5 border-2 border-rose-500">
                <img src={conv.match.photoUrl} alt={conv.match.nickname} className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="text-xs font-medium text-gray-600">{conv.match.nickname}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Active Chats</h3>
        {conversations.length > 0 ? (
          conversations.sort((a, b) => b.lastTimestamp.getTime() - a.lastTimestamp.getTime()).map(conv => (
            <button
              key={conv.id}
              onClick={() => onSelectChat(conv)}
              className="w-full flex items-center p-3 rounded-2xl hover:bg-rose-50/50 transition-colors text-left"
            >
              <img 
                src={conv.match.photoUrl} 
                alt={conv.match.nickname} 
                className="w-14 h-14 rounded-2xl object-cover shadow-sm mr-4" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-gray-800 truncate">{conv.match.nickname}</h4>
                  <span className="text-[10px] font-medium text-gray-400">{formatTimeAgo(conv.lastTimestamp)}</span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
              </div>
              <div className="w-2 h-2 bg-rose-500 rounded-full ml-2"></div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 italic">
            <p>No messages yet. Start chatting!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
