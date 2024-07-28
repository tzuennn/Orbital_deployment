import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import ImageModal from './ImageModal';

interface MessageProps {
  message: {
    text: string;
    imageUrl?: string;
    userId: string;
    createdAt: any;
  };
  currentUser: string;
}

const Message: React.FC<MessageProps> = ({ message, currentUser }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [nickname, setNickname] = useState<string>('');
  const isCurrentUser = message.userId === currentUser;

  const handleImageClick = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchNickname = async () => {
      const userProfileRef = doc(firestore, "profiles", message.userId);
      const userProfileSnap = await getDoc(userProfileRef);
      if (userProfileSnap.exists()) {
        setNickname(userProfileSnap.data().nickname);
      }
    };
    fetchNickname();
  }, [message.userId]);

  return (
    <>
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`p-2 rounded-md shadow-md max-w-[75%] break-words ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <p className="text-xs font-semibold mb-1">{nickname}</p>
          {message.text && <p>{message.text}</p>}
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Sent Image"
              className="mt-2 rounded-md cursor-pointer"
              style={{ maxWidth: '600px', maxHeight: '600px', objectFit: 'contain' }}
              onClick={handleImageClick}
            />
          )}
        </div>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={message.imageUrl || ''}
      />
    </>
  );
};

export default Message;
