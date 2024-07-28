import React from "react";

interface ChatroomActionsProps {
  chatroom: any;
  currentUser: any;
  handleDeleteRoom: () => void;
  handleLeaveRoom: () => void;
}

const ChatroomActions: React.FC<ChatroomActionsProps> = ({
  chatroom,
  currentUser,
  handleDeleteRoom,
  handleLeaveRoom,
}) => {
  return (
    <div>
      {chatroom.createdBy === currentUser?.uid ? (
        <>
          <button onClick={handleDeleteRoom} className="mt-4 p-2 bg-red-500 text-white rounded-md">
            Delete Chatroom
          </button>
        </>
      ) : (
        <>
          <button onClick={handleLeaveRoom} className="mt-4 p-2 bg-red-500 text-white rounded-md">
            Leave Chatroom
          </button>
        </>
      )}
    </div>
  );
};

export default ChatroomActions;
