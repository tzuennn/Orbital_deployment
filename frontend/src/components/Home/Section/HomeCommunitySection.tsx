import ChatroomList from "@/components/Chatroom/ChatroomList";
import { ChatroomProvider } from "@/components/Chatroom/ChatroomContext";

export default function HomeCommunitySection({ style }: { style: string }) {
  return (
    <div className={`relative ${style}`}>
      <div className="mb-3 ml-2 font-bold text-xl border-b-2 border-white pb-1">
        Community
      </div>
      <ChatroomProvider>
        <ChatroomList isHome={true} />
      </ChatroomProvider>
    </div>
  );
}
