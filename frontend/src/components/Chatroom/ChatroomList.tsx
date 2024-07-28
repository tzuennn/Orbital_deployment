"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useAuth } from "@/components/Auth/AuthContext";
import { handleDeleteRoom } from "@/components/Chatroom/chatroomUtils";
import { useRouter } from "next/navigation";
import { useChatroom } from "@/components/Chatroom/ChatroomContext";
import CreateChatroom from "./CreateChatroom";
import JoinChatroom from "./JoinChatroom";
import LoadingState from "../General/LoadingState";
import HomeButton from "../Home/HomeButton";

interface Chatroom {
  id: string;
  name: string;
  members: string[];
  createdBy: string;
}

interface ChatroomListProps {
  isHome: boolean;
}

const ChatroomList: React.FC<ChatroomListProps> = ({ isHome }) => {
  const { currentUser } = useAuth() || {};
  const { isLimitReached, updateChatroomCount } = useChatroom();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchChatrooms = async () => {
    if (currentUser) {
      const q = query(
        collection(firestore, "chatrooms"),
        where("members", "array-contains", currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const rooms: Chatroom[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Chatroom, "id">;
          return {
            id: doc.id,
            ...data,
          };
        });

        const creatorIds = rooms.map((room) => room.createdBy);
        const uniqueCreatorIds = Array.from(new Set(creatorIds));

        const userPromises = uniqueCreatorIds.map(async (uid) => {
          const userDoc = await getDoc(doc(firestore, "profiles", uid));
          const userData = userDoc.data();
          return { uid, nickname: userData?.nickname || "Unknown" };
        });

        const users = await Promise.all(userPromises);
        const usernamesMap: { [key: string]: string } = {};
        users.forEach((user) => {
          usernamesMap[user.uid] = user.nickname;
        });

        setUsernames(usernamesMap);
        setChatrooms(rooms);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  };

  useEffect(() => {
    fetchChatrooms();
  }, [currentUser]);

  const handleDelete = async (roomId: string, room: Chatroom) => {
    await handleDeleteRoom(roomId, currentUser, room, router);
    await fetchChatrooms();
    await updateChatroomCount();
  };

  return (
    <div>
      {!isHome ? (
        <>
          {loading ? (
            <div className="flex justify-center items-center h-[500px]">
              <LoadingState />
            </div>
          ) : (
            <>
              <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Chatrooms</h1>
                <div className="mb-4">
                  {isLimitReached && (
                    <p className="text-red-500">
                      You have reached the maximum number of chatrooms.
                    </p>
                  )}
                  <CreateChatroom />
                </div>
                <div className="mb-4">
                  <JoinChatroom />
                </div>

                <h2 className="text-xl font-bold mb-4">Your Chatrooms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chatrooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                    >
                      <Link href={`/chatrooms/${room.id}`}>
                        <h3 className="text-lg font-bold">{room.name}</h3>
                        <p className="text-sm text-gray-600">
                          Created by:{" "}
                          {usernames[room.createdBy] || "Loading..."}
                        </p>
                        <p className="text-sm text-gray-600">
                          Members: {room.members.length}
                        </p>
                      </Link>
                      {room.createdBy === currentUser?.uid && (
                        <button
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md"
                          onClick={async (e) => {
                            e.preventDefault();
                            await handleDelete(room.id, room);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xs font-bold mb-2">Active Chatrooms</h2>
          <ul className="flex flex-row">
            {chatrooms.map((room) => (
              <li key={room.id} className="mb-2 mr-6">
                <Link href={`/chatrooms/${room.id}`} className="text-blue-500">
                  {room.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-2 right-4">
            <HomeButton web={"/chatrooms"} buttonText={"Find out More"} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatroomList;
