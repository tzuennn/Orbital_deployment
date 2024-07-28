import { collection, addDoc, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { Todo } from './types'; 

interface Notification {
  userId: string;
  message: string;
  read: boolean;
  timestamp: Timestamp;
}

export const checkDeadlinesAndNotify = async (todos: Todo[]) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
  const twoDaysLaterStart = tomorrowStart + 24 * 60 * 60 * 1000;

  for (const todo of todos) {
    const deadlineDate = new Date(todo.deadline).getTime();

    if (!todo.completed && !todo.notified) {
      let message = '';
      if (deadlineDate >= todayStart && deadlineDate < tomorrowStart) {
        message = `Reminder: Your task '${todo.taskName}' is due today.`;
      } else if (deadlineDate >= tomorrowStart && deadlineDate < twoDaysLaterStart) {
        message = `Reminder: Your task '${todo.taskName}' is due tomorrow.`;
      } else if (deadlineDate < todayStart) {
        message = `The task '${todo.taskName}' is overdue.`;
      }

      if (message) {
        const notification: Notification = {
          userId: todo.userId,
          message,
          read: false,
          timestamp: Timestamp.fromDate(new Date()),
        };
        await addDoc(collection(firestore, 'notifications'), notification);

        const todoRef = doc(firestore, 'todos', todo.id);
        await updateDoc(todoRef, { notified: true });
      }
    }
  }
};
