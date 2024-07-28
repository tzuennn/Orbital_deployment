"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import { useAuth } from "../../Auth/AuthContext";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import HomeButton from "@/components/Home/HomeButton";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: any;
}

const Notifications: React.FC<{ style: string }> = ({
  style,
}: {
  style: string;
}) => {
  const { currentUser } = useAuth() || {};
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const notificationsCollection = collection(firestore, "notifications");
    const q = query(
      notificationsCollection,
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Notification)
      );

      // sort by timestamp in descending order
      const sortedNotifications = fetchedNotifications.sort(
        (a, b) => b.timestamp.toDate() - a.timestamp.toDate()
      );

      setNotifications(sortedNotifications);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (id: string) => {
    const notificationRef = doc(firestore, "notifications", id);
    await updateDoc(notificationRef, { read: true });
  };

  return (
    <div className={`bg-lightGreen p-4 rounded-xl ${style}`}>
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      {notifications.length > 0 ? (
        <>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {notifications.slice(0, 5).map((notification) => (
              <li
                key={notification.id}
                className={`p-2 rounded flex items-center ${
                  notification.read ? "bg-gray-100" : "bg-green-300"
                }`}
              >
                <button
                  className={`mr-2 ${
                    notification.read ? "text-gray-400" : "text-green-600"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                  title={notification.read ? "Marked as read" : "Mark as read"}
                >
                  {notification.read ? (
                    <FaCheckCircle size={20} />
                  ) : (
                    <FaRegCircle size={20} />
                  )}
                </button>
                {notification.message}
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-2">
            <HomeButton web={"/notifications"} buttonText={"View all"} />
          </div>
        </>
      ) : (
        <p className="text-gray-500">No notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
