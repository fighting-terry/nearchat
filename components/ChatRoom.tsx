
import React, { useState, useRef, useEffect } from 'react';
import { ChatConversation, ChatMessage, UserProfile } from '../types';
import { GoogleGenAI } from "@google/genai";
import { BackendService } from '../backend';

interface ChatRoomProps {
  conversation: ChatConversation;
  onBack: () => void;
  userProfile: UserProfile;
  onUpdateMessages: (messages: ChatMessage[]) => void;
}

const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatFullDate = (date: Date) => {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
};

const ChatRoom: React.FC<ChatRoomProps> = ({ conversation, onBack, userProfile, onUpdateMessages }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 실시간 백엔드 메시지 구독
  useEffect(() => {
    const unsubscribe = BackendService.subscribeToMessages(conversation.id, (msgs) => {
      onUpdateMessages(msgs);
    });
    return () => unsubscribe();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      text: userMsgText,
      timestamp: new Date(),
    };

    // DB에 저장 (이제 실시간 리스너가 감지하여 UI를 업데이트함)
    await BackendService.sendMessage(conversation.id, userMessage);
    
    setInputText('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const historyStr = conversation.messages
        .slice(-10)
        .map(m => `${m.senderId === 'user' ? 'User' : conversation.match.nickname}: ${m.text}`)
        .join('\n');

      const systemInstruction = `
        You are ${conversation.match.nickname}, a ${conversation.match.age} ${conversation.match.gender}.
        Character: Heart-fluttering, flirty, charming. Brief responses in ${userProfile.language}.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ text: `History:\n${historyStr}\n\nResponse:` }] },
        config: { systemInstruction }
      });

      const replyText = response.text || "😊";
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        senderId: conversation.match.id,
        text: replyText.trim(),
        timestamp: new Date(),
      };

      await BackendService.sendMessage(conversation.id, aiMessage);
      setIsTyping(false);

    } catch (err) {
      console.error("AI Error:", err);
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 mr-2 text-gray-400 hover:text-rose-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center flex-1">
          <div className="relative">
            <img src={conversation.match.photoUrl} alt={conversation.match.nickname} className="w-10 h-10 rounded-full object-cover mr-3 shadow-sm" />
            <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 leading-none">{conversation.match.nickname}</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/20">
        {conversation.messages.map((msg, idx) => {
          const isUser = msg.senderId === 'user';
          const msgDate = new Date(msg.timestamp);
          const showDate = idx === 0 || 
            msgDate.toDateString() !== new Date(conversation.messages[idx-1].timestamp).toDateString();
          
          return (
            <React.Fragment key={msg.id || idx}>
              {showDate && (
                <div className="flex justify-center my-6">
                  <span className="text-[11px] font-bold text-gray-400 bg-white border border-gray-100 px-4 py-1 rounded-full shadow-sm">
                    {formatFullDate(msgDate)}
                  </span>
                </div>
              )}
              <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end space-x-1 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {!isUser && (
                  <img src={conversation.match.photoUrl} className="w-8 h-8 rounded-full object-cover mr-1 mb-1" alt="" />
                )}
                
                {isUser && (
                  <span className="text-[10px] text-gray-400 mb-1 mr-1">{formatMessageTime(msgDate)}</span>
                )}
                
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  isUser 
                    ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>

                {!isUser && (
                  <span className="text-[10px] text-gray-400 mb-1 ml-1">{formatMessageTime(msgDate)}</span>
                )}
              </div>
            </React.Fragment>
          );
        })}
        {isTyping && (
          <div className="flex justify-start items-end space-x-2">
             <img src={conversation.match.photoUrl} className="w-8 h-8 rounded-full object-cover self-end mb-1 opacity-50" alt="" />
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none flex space-x-1 shadow-sm">
              <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 pb-safe">
        <form onSubmit={handleSend} className="flex items-center bg-gray-100 rounded-full px-4 py-1.5">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-2 text-[14px] text-gray-700 placeholder-gray-400 outline-none"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isTyping}
            className={`p-2 rounded-full transition-all ${
              inputText.trim() && !isTyping ? 'text-rose-500' : 'text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
