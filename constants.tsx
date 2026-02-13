
import { MatchProfile, ChatConversation } from './types';

export const INTEREST_OPTIONS = [
  'Travel', 'Coffee', 'Music', 'Gaming', 'Cooking', 
  'Fitness', 'Art', 'Movies', 'Reading', 'Photography', 
  'Hiking', 'Wine', 'Tech', 'Yoga', 'Pets'
];

export const LANGUAGES = ['Korean', 'English', 'Japanese', 'Spanish', 'French', 'Chinese'];

export const RANDOM_NICKNAMES = ['Summer', 'Luna', 'Ocean', 'Leo', 'Sky', 'Haru', 'Sora', 'Oliver', 'Mochi', 'Star'];

export const MOCK_MATCHES: MatchProfile[] = [
  {
    id: '1',
    nickname: 'Ji-won',
    photoUrl: 'https://picsum.photos/seed/p1/600/800',
    photoUrls: [
      'https://picsum.photos/seed/p1a/600/800',
      'https://picsum.photos/seed/p1b/600/800',
      'https://picsum.photos/seed/p1c/600/800'
    ],
    gender: 'Female',
    age: '20s',
    language: 'Korean',
    interests: ['Coffee', 'Travel', 'Art'],
    bio: 'Looking for someone to explore hidden cafes with!',
    distance: '2km away',
    activeChatCount: 3
  },
  {
    id: '2',
    nickname: 'Min-ho',
    photoUrl: 'https://picsum.photos/seed/p2/600/800',
    photoUrls: [
      'https://picsum.photos/seed/p2a/600/800',
      'https://picsum.photos/seed/p2b/600/800'
    ],
    gender: 'Male',
    age: '20s',
    language: 'Korean',
    interests: ['Fitness', 'Cooking', 'Tech'],
    bio: 'Passionate about fitness and coding. Let’s grab a healthy dinner?',
    distance: '5km away',
    activeChatCount: 12
  },
  {
    id: '3',
    nickname: 'Yuna',
    photoUrl: 'https://picsum.photos/seed/p3/600/800',
    photoUrls: [
      'https://picsum.photos/seed/p3a/600/800',
      'https://picsum.photos/seed/p3b/600/800',
      'https://picsum.photos/seed/p3c/600/800'
    ],
    gender: 'Female',
    age: '20s',
    language: 'Korean',
    interests: ['Gaming', 'Anime', 'Photography'],
    bio: 'Casual gamer looking for a Player 2. ✨',
    distance: '1.2km away',
    activeChatCount: 45
  },
  {
    id: '4',
    nickname: 'Daniel',
    photoUrl: 'https://picsum.photos/seed/p4/600/800',
    photoUrls: [
      'https://picsum.photos/seed/p4a/600/800',
      'https://picsum.photos/seed/p4b/600/800'
    ],
    gender: 'Male',
    age: '20s',
    language: 'English',
    interests: ['Music', 'Hiking', 'Wine'],
    bio: 'Let’s go on a hike and watch the sunset.',
    distance: '8km away',
    activeChatCount: 7
  }
];

export const MOCK_CHATS: ChatConversation[] = [
  {
    id: 'chat-1',
    match: MOCK_MATCHES[0],
    lastMessage: 'I really liked that cafe you mentioned!',
    lastTimestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    // Added createdAt property to satisfy ChatConversation interface
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    messages: [
      { id: 'm1', senderId: '1', text: 'Hey there! Nice to meet you.', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
      { id: 'm2', senderId: 'user', text: 'Hi Ji-won! I saw you like cafes.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { id: 'm3', senderId: '1', text: 'I really liked that cafe you mentioned!', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    ]
  }
];
