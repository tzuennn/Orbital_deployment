"use client";
import React from "react";
import ChatroomList from "@/components/Chatroom/ChatroomList";
import { useAuth } from "@/components/Auth/AuthContext";
import { useRouter } from "next/navigation";
import { ChatroomProvider } from "@/components/Chatroom/ChatroomContext";

const ChatroomPage: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const router = useRouter();

  // redirect to home if not logged in
  if (!currentUser) {
    router.replace("/");
    return null;
  }

  return (
    <ChatroomProvider>
      <ChatroomList isHome={false} />
    </ChatroomProvider>
  );
};

export default ChatroomPage;
