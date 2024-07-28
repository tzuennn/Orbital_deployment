"use client";
import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useAuth } from "../Auth/AuthContext";
import { useChatroom } from "@/components/Chatroom/ChatroomContext";

const JoinChatroom: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const { isLimitReached, updateChatroomCount } = useChatroom();
  const [chatroomId, setChatroomId] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser && chatroomId && !isLimitReached) {
      try {
        const chatroomRef = doc(firestore, "chatrooms", chatroomId);
        await updateDoc(chatroomRef, {
          members: arrayUnion(currentUser.uid),
        });

        const userDocRef = doc(firestore, "usersChatrooms", currentUser.uid);
        await setDoc(
          userDocRef,
          {
            chatrooms: arrayUnion(chatroomId),
          },
          { merge: true }
        );

        setChatroomId("");
        updateChatroomCount();  // Update chatroom count
      } catch (error) {
        console.error("Error joining chatroom:", error);
      }
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleJoin} className="mb-4">
        <input
          type="text"
          placeholder="Chatroom ID"
          value={chatroomId}
          onChange={(e) => setChatroomId(e.target.value)}
          className="p-2 border rounded-md w-full"
          required
          disabled={isLimitReached}
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-600"
          disabled={isLimitReached}
        >
          Join Chatroom
        </button>
      </form>
      {isLimitReached && (
        <p className="text-red-600">Max limit of 5 chatrooms reached. You cannot join more.</p>
      )}
    </div>
  );
};

export default JoinChatroom;
