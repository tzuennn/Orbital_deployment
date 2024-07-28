"use client";
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '../../components/Auth/AuthContext';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: any;
}

const AllNotifications: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;

  useEffect(() => {
    if (!currentUser) return;

    const notificationsCollection = collection(firestore, 'notifications');
    const q = query(
      notificationsCollection,
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Notification));

      // sort by timestamp in descending order
      const sortedNotifications = fetchedNotifications.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());

      setNotifications(sortedNotifications);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (id: string) => {
    const notificationRef = doc(firestore, 'notifications', id);
    await updateDoc(notificationRef, { read: true });
  };

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  const currentNotifications = notifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-lg font-bold mb-4">All Notifications</h2>
      {notifications.length > 0 ? (
        <>
          <ul className="space-y-2">
            {currentNotifications.map((notification) => (
              <li key={notification.id} className={`p-2 rounded flex items-center ${notification.read ? 'bg-gray-100' : 'bg-green-300'}`}>
                <button
                  className={`mr-2 ${notification.read ? 'text-gray-400' : 'text-green-600'}`}
                  onClick={() => markAsRead(notification.id)}
                  title={notification.read ? "Marked as read" : "Mark as read"}
                >
                  {notification.read ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
                </button>
                {notification.message}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center items-center space-x-2">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-300 rounded-lg"
              >
                Previous
              </button>
            )}
            <span>
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-300 rounded-lg"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No notifications.</p>
      )}
    </div>
  );
};

export default AllNotifications;
