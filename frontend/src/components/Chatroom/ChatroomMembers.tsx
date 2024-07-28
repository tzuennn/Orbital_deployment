import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayRemove, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '../../components/Auth/AuthContext';
import { Box, List, ListItem, Text, Button } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';

interface Member {
  id: string;
  nickname: string;
}

interface ChatroomMembersProps {
  chatroomId: string;
}

const ChatroomMembers: React.FC<ChatroomMembersProps> = ({ chatroomId }) => {
  const { currentUser } = useAuth() || {};
  const [members, setMembers] = useState<Member[]>([]);
  const [chatroom, setChatroom] = useState<any>(null);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
      return;
    }

    const fetchCurrentUserNickname = async () => {
      const userProfileRef = doc(firestore, 'profiles', currentUser.uid);
      const userProfileSnap = await getDoc(userProfileRef);
      if (userProfileSnap.exists()) {
        setCurrentUserNickname(userProfileSnap.data().nickname);
      }
    };

    fetchCurrentUserNickname();

    const chatroomRef = doc(firestore, 'chatrooms', chatroomId);
    
    // Listen for real-time updates to the chatroom
    const unsubscribeChatroom = onSnapshot(chatroomRef, async (docSnapshot) => {
      const chatroomData = docSnapshot.data();
      setChatroom(chatroomData);

      if (chatroomData) {
        // If the current user is no longer a member, redirect to chatrooms page
        if (!chatroomData.members.includes(currentUser.uid)) {
          router.push('/chatrooms');
        }

        const membersPromises = chatroomData.members.map(async (memberId: string) => {
          const userRef = doc(firestore, 'profiles', memberId);
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data() as { nickname?: string };
          return { id: memberId, nickname: userData?.nickname || 'Unknown' };
        });

        const membersData = await Promise.all(membersPromises);
        setMembers(membersData);
      }
    });

    return () => unsubscribeChatroom();
  }, [chatroomId, currentUser, router]);

  const handleRemoveMember = async (memberId: string) => {
    try {
      const chatroomRef = doc(firestore, 'chatrooms', chatroomId);
      await updateDoc(chatroomRef, {
        members: arrayRemove(memberId)
      });

      const userRef = doc(firestore, 'usersChatrooms', memberId);
      await updateDoc(userRef, {
        chatrooms: arrayRemove(chatroomId)
      });

    } catch (error) {
      console.error("Error removing member:", error);
      alert("Error removing member. Please try again.");
    }
  };

  return (
    <Box textAlign="center" p={4}>
      <Text fontSize="2xl" mb={4}>Members</Text>
      <List spacing={3}>
        {members.map((member) => (
          <ListItem 
            key={member.id} 
            bg={member.id === currentUser?.uid ? "blue.100" : "gray.100"}
            p={3}
            borderRadius="md"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text>{member.id === currentUser?.uid ? currentUserNickname : member.nickname}</Text>
            {chatroom?.createdBy === currentUser?.uid && member.id !== currentUser?.uid && (
              <Button colorScheme="red" size="sm" onClick={() => handleRemoveMember(member.id)}>
                Remove
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatroomMembers;
