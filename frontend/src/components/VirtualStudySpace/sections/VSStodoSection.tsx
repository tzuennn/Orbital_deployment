import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TodoItem from "../../Todo/TodoItem";
import { firestore, auth } from "../../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function VSStodoSection() {
  const { todos } = useSelector((state: RootState) => state.todo);
  const [completedTodosCount, setCompletedTodosCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchCompletedTodos() {
      try {
        const todosRef = collection(firestore, "todos");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const q = query(
          todosRef,
          where("userId", "==", userId),
          where("completed", "==", true),
          where("completedAt", ">=", sevenDaysAgo.toISOString()) // Convert date to ISO string
        );

        const querySnapshot = await getDocs(q);
        setCompletedTodosCount(querySnapshot.docs.length);
      } catch (error) {
        console.error("Error fetching completed todos: ", error);
      }
    }

    fetchCompletedTodos();
  }, [userId]);

  return (
    <div className="w-full p-5 border-2 rounded-xl">
      <div className="flex justify-center text-xl mb-2 pb-2 border-b-2 border-teal-500">
        Weekly Todo-list Summary
      </div>
      <div className="flex justify-center mt-5 mb-4">
        You have completed {completedTodosCount} todo items this week
      </div>
      <div>Upcoming unfinished events</div>
      <div className="max-h-96 overflow-y-auto">
        {todos
          .filter((todo) => !todo.completed)
          .map((todo) => (
            <TodoItem key={todo.id} todo={todo} isHome={true} />
          ))}
      </div>
    </div>
  );
}
