"use client";
import React, { useState } from "react";
import { collection, addDoc, setDoc, arrayUnion, doc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useAuth } from "@/components/Auth/AuthContext";
import { useChatroom } from "@/components/Chatroom/ChatroomContext";

const CreateChatroom: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const { isLimitReached, updateChatroomCount } = useChatroom();
  const [chatroomName, setChatroomName] = useState("");
  const [isMaxLengthReached, setIsMaxLengthReached] = useState(false);
  const maxChatroomNameLength = 15;

  const handleCreateChatroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatroomName && currentUser && !isLimitReached) {
      try {
        const chatroomDoc = await addDoc(collection(firestore, "chatrooms"), {
          name: chatroomName,
          createdAt: new Date(),
          members: [currentUser.uid],
          createdBy: currentUser.uid,
        });

        // Update user's chatroom list
        const userDocRef = doc(firestore, "usersChatrooms", currentUser.uid);
        await setDoc(
          userDocRef,
          {
            chatrooms: arrayUnion(chatroomDoc.id),
          },
          { merge: true }
        );

        setChatroomName("");
        setIsMaxLengthReached(false);
        updateChatroomCount();  // Update chatroom count
      } catch (error) {
        console.error("Error creating chatroom:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxChatroomNameLength) {
      setChatroomName(value);
      setIsMaxLengthReached(value.length === maxChatroomNameLength);
    }
  };

  return (
    <form onSubmit={handleCreateChatroom} className="mb-4">
      <input
        type="text"
        placeholder="Chatroom Name"
        value={chatroomName}
        onChange={handleInputChange}
        className="p-2 border rounded-md w-full"
        maxLength={maxChatroomNameLength}
        required
        disabled={isLimitReached}
      />
      {isMaxLengthReached && (
        <p className="text-red-500 text-sm mt-1">Character limit reached (15 characters).</p>
      )}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-600"
        disabled={isLimitReached}
      >
        Create Chatroom
      </button>
      {isLimitReached && (
        <p className="text-red-600 mt-2">Max limit of 5 chatrooms reached. You cannot create more.</p>
      )}
    </form>
  );
};

export default CreateChatroom;
