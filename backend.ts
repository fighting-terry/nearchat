
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  query, 
  onSnapshot, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { ChatConversation, ChatMessage, UserProfile } from './types';

/**
 * ⚠️ 출시 전 주의사항: 
 * Firebase 콘솔(https://console.firebase.google.com/)에서 프로젝트를 생성하고
 * 아래 config 객체에 실제 값을 넣어주세요.
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Firebase 초기화 (실제 키가 없을 경우 에러 방지를 위해 조건부 처리)
let db: any;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase config is missing. Using mock mode.");
}

export const BackendService = {
  // 유저 프로필 저장
  async saveUserProfile(profile: UserProfile): Promise<string> {
    if (!db) return "mock-uid";
    const userRef = doc(collection(db, "users"));
    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp()
    });
    return userRef.id;
  },

  // 메시지 전송 및 저장
  async sendMessage(chatId: string, message: ChatMessage): Promise<void> {
    if (!db) return;
    const msgRef = collection(db, "chats", chatId, "messages");
    await addDoc(msgRef, {
      ...message,
      timestamp: serverTimestamp()
    });
  },

  // 실시간 대화 리스너
  subscribeToMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
    if (!db) return () => {};
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp: data.timestamp?.toDate() || new Date()
        } as ChatMessage;
      });
      callback(messages);
    });
  },

  // 종료 시 로컬 데이터 삭제 (요청하신 기능)
  async clearSessionData() {
    // 실제 서비스에서는 로그아웃 처리 및 로컬 스토리지 삭제
    localStorage.clear();
    console.log("Session cleared.");
  }
};
