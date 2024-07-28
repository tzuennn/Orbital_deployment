"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  doc,
  onSnapshot,
  collection,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import { useAuth } from "@/components/Auth/AuthContext";
import ChatMessages from "@/components/Chatroom/ChatMessages";
import MessageInput from "@/components/Chatroom/MessageInput";
import ChatroomHeader from "@/components/Chatroom/ChatroomHeader";
import Modal from "@/components/Chatroom/Modal";
import ChatroomMembers from "@/components/Chatroom/ChatroomMembers";
import { Box } from "@chakra-ui/react";
import TabsNavigation from "@/components/Chatroom/TabsNavigation";
import ChatroomActions from "@/components/Chatroom/ChatroomActions";
import {
  handleDeleteRoom,
  handleLeaveRoom,
} from "@/components/Chatroom/chatroomUtils";

interface Message {
  id: string;
  type: "message";
  text: string;
  imageUrl?: string;
  userId: string;
  createdAt: any;
  displayName: string;
}

interface Question {
  id: string;
  type: "question";
  question: string;
  topic: string;
  userId: string;
  createdAt: any;
}

const ChatroomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const chatroomId = params.chatroomId as string;
  const { currentUser } = useAuth() || {};
  const [items, setItems] = useState<(Message | Question)[]>([]);
  const [chatroom, setChatroom] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      return;
    }

    if (!chatroomId) {
      console.warn("Chatroom ID is not available");
      return;
    }

    const chatroomRef = doc(firestore, "chatrooms", chatroomId);

    const unsubscribeChatroom = onSnapshot(chatroomRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatroomData = docSnapshot.data();
        setChatroom(chatroomData);

        if (!chatroomData.members.includes(currentUser.uid)) {
          router.push("/chatrooms");
        }
      } else {
        router.push("/chatrooms");
      }
    });

    const messagesRef = collection(firestore, `chatrooms/${chatroomId}/messages`);
    const questionsRef = collection(firestore, "quests");

    const qMessages = query(messagesRef, orderBy("createdAt"));
    const qQuestions = query(questionsRef, where("chatroomId", "==", chatroomId), orderBy("createdAt"));

    const unsubscribeMessages = onSnapshot(
      qMessages,
      (snapshot) => {
        const msgs: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: "message",
            text: data.text,
            imageUrl: data.imageUrl,
            userId: data.userId,
            createdAt: data.createdAt,
            displayName: data.displayName,
          };
        });
        setItems((prevItems) => {
          const newItems = [...prevItems.filter(item => item.type !== "message"), ...msgs];
          return newItems.sort((a, b) => a.createdAt - b.createdAt);
        });
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );

    const unsubscribeQuestions = onSnapshot(
      qQuestions,
      (snapshot) => {
        const qsts: Question[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: "question",
            question: data.question,
            topic: data.topic,
            userId: data.userId,
            createdAt: data.createdAt,
          };
        });
        setItems((prevItems) => {
          const newItems = [...prevItems.filter(item => item.type !== "question"), ...qsts];
          return newItems.sort((a, b) => a.createdAt - b.createdAt);
        });
      },
      (error) => {
        console.error("Error fetching questions:", error);
      }
    );

    return () => {
      unsubscribeChatroom();
      unsubscribeMessages();
      unsubscribeQuestions();
    };
  }, [chatroomId, currentUser, router]);

  const handleSendMessage = async (message: string, imageUrl?: string) => {
    if (currentUser) {
      await addDoc(collection(firestore, `chatrooms/${chatroomId}/messages`), {
        text: message,
        imageUrl: imageUrl || '',
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handlePostQuestion = async (question: string, topic: string) => {
    if (currentUser) {
      await addDoc(collection(firestore, `quests`), {
        question,
        topic,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        chatroomId,
      });
    }
  };

  const handlePostAnswer = async (answer: string, questionId: string) => {
    if (currentUser) {
      const answersRef = collection(firestore, "quests", questionId, "answers");
      await addDoc(answersRef, {
        answer,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        upvotes: 0,
      });
    }
  };

  if (!chatroom) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <ChatroomHeader chatroom={chatroom} chatroomId={chatroomId} />
      <Box width="100%" display="flex" justifyContent="center" mt={4}>
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </Box>
      <div className="mt-4">
        {activeTab === 0 ? (
          <>
            <ChatMessages items={items} currentUser={currentUser} onAnswerSubmit={handlePostAnswer} />
            <MessageInput onSendMessage={handleSendMessage} onPostQuestion={handlePostQuestion} />
          </>
        ) : (
          <ChatroomMembers chatroomId={chatroomId} />
        )}
      </div>
      <ChatroomActions
        chatroom={chatroom}
        currentUser={currentUser}
        handleDeleteRoom={() => setShowDeleteModal(true)}
        handleLeaveRoom={() => setShowLeaveModal(true)}
      />
      <Modal
        isOpen={showDeleteModal}
        title="Delete Chatroom"
        message="Are you sure you want to delete this chatroom? This action cannot be undone."
        onConfirm={() => handleDeleteRoom(chatroomId, currentUser, chatroom, router)}
        onCancel={() => setShowDeleteModal(false)}
      />
      <Modal
        isOpen={showLeaveModal}
        title="Leave Chatroom"
        message="Are you sure you want to leave this chatroom?"
        onConfirm={() => handleLeaveRoom(chatroomId, currentUser, router)}
        onCancel={() => setShowLeaveModal(false)}
      />
    </div>
  );
};

export default ChatroomPage;
