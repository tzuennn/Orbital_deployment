import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '@/components/Auth/AuthContext';

interface ChatroomContextProps {
  isLimitReached: boolean;
  updateChatroomCount: () => void;
}

const ChatroomContext = createContext<ChatroomContextProps | undefined>(undefined);

export const useChatroom = () => {
  const context = useContext(ChatroomContext);
  if (!context) {
    throw new Error('useChatroom must be used within a ChatroomProvider');
  }
  return context;
};

export const ChatroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth() || {};
  const [isLimitReached, setIsLimitReached] = useState(false);

  const updateChatroomCount = async () => {
    if (currentUser) {
      const userDocRef = doc(firestore, 'usersChatrooms', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userChatrooms = userDoc.data()?.chatrooms || [];
      setIsLimitReached(userChatrooms.length >= 5);
    }
  };

  useEffect(() => {
    if (currentUser) {
      updateChatroomCount();
    }
  }, [currentUser]);

  return (
    <ChatroomContext.Provider value={{ isLimitReached, updateChatroomCount }}>
      {children}
    </ChatroomContext.Provider>
  );
};
