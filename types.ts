
export type Gender = 'Male' | 'Female' | 'Non-binary';

export interface UserProfile {
  uid?: string; // Firebase Auth UID
  nickname: string;
  photoUrl: string;
  gender: Gender;
  age: string | number;
  language: string;
  interests: string[];
}

export interface MatchProfile extends UserProfile {
  id: string;
  bio: string;
  distance: string;
  photoUrls: string[];
  activeChatCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  match: MatchProfile;
  lastMessage: string;
  lastTimestamp: Date;
  messages: ChatMessage[];
  createdAt: Date; // 방 생성 시간
}
