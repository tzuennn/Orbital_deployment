import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState } from 'react';
import { FaPaperPlane, FaPlus } from 'react-icons/fa';
import { storage } from '../../../firebase/firebase';

interface MessageInputProps {
  onSendMessage: (message: string, imageUrl?: string) => void;
  onPostQuestion: (question: string, topic: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onPostQuestion }) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageRef.current && messageRef.current.value.trim()) {
      onSendMessage(messageRef.current.value);
      messageRef.current.value = '';
    }
  };

  const handlePostQuestion = async () => {
    if (question.trim() && topic.trim()) {
      onPostQuestion(question, topic);
      setQuestion('');
      setTopic('');
      setModalOpen(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFile = e.target.files[0];
      setUploading(true);
      try {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        onSendMessage('', imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setUploading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSendMessage} className="flex mb-4">
        <input
          type="text"
          ref={messageRef}
          placeholder="Type a message"
          className="message-input flex-grow p-2 border rounded-md"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="fileInput" />
        <label htmlFor="fileInput" className="ml-2 p-2 bg-gray-200 text-black rounded-md cursor-pointer">Attach Image</label>
        <button type="submit" className="send-button ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Send'}
        </button>
        <button type="button" onClick={() => setModalOpen(true)} className="post-button ml-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-700">
          <FaPlus /> Post
        </button>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Post a Question</h2>
            <input
              type="text"
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="modal-input w-full mb-4 p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Topic/Module"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="modal-input w-full mb-4 p-2 border rounded-md"
            />
            <div className="flex justify-end">
              <button onClick={handlePostQuestion} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-700 mr-2">
                Post
              </button>
              <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageInput;
