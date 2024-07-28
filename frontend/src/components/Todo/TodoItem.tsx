import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { firestore } from "../../../firebase/firebase";
import { removeTodo, updateTodo } from "../../store/todoSlice";
import { Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  isHome: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, isHome }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskName, setEditTaskName] = useState(todo.taskName);
  const [editTaskDescription, setEditTaskDescription] = useState(todo.taskDescription);
  const [editDeadline, setEditDeadline] = useState(todo.deadline);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editStatus, setEditStatus] = useState(todo.status);

  const handleDelete = async () => {
    try {
      const todoRef = doc(firestore, "todos", todo.id);
      await deleteDoc(todoRef);
      dispatch(removeTodo(todo.id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleStatusChange = async (newStatus: string | React.ChangeEvent<HTMLSelectElement>) => {
    const statusValue = typeof newStatus === 'string' ? newStatus : newStatus.target.value;
    const isCompleted = statusValue === "Completed";

    try {
      const todoRef = doc(firestore, "todos", todo.id);
      await updateDoc(todoRef, { status: statusValue, completed: isCompleted, completedAt: isCompleted ? new Date().toISOString() : null });
      dispatch(
        updateTodo({
          id: todo.id,
          data: { status: statusValue, completed: isCompleted, completedAt: isCompleted ? new Date().toISOString() : null },
        })
      );
      setEditStatus(statusValue);
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await handleStatusChange(editStatus);  // update the status first
      const todoRef = doc(firestore, "todos", todo.id);
      await updateDoc(todoRef, {
        taskName: editTaskName,
        taskDescription: editTaskDescription,
        deadline: editDeadline,
        priority: editPriority,
        status: editStatus,
      });
      dispatch(updateTodo({
        id: todo.id,
        data: {
          taskName: editTaskName,
          taskDescription: editTaskDescription,
          deadline: editDeadline,
          priority: editPriority,
          status: editStatus,
        },
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDeadline = e.target.value;
    setEditDeadline(newDeadline);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Reset hours, minutes, and seconds to compare only dates
    const selectedDate = new Date(newDeadline);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= currentDate) {
      setEditStatus("Overdue");
    }
  };

  const getBackgroundColor = () => {
    if (todo.completed) return "bg-gray-400";
    if (todo.priority === "High") return "bg-pink-200";
    if (todo.priority === "Medium") return "bg-yellow-200";
    return "bg-green-200";
  };

  return (
    <div
      className={`grid grid-cols-6 gap-4 items-center p-4 ${getBackgroundColor()} shadow-md rounded-lg mb-4`}
    >
      {isEditing ? (
        <>
          <div className="col-span-2">
            <input
              type="text"
              value={editTaskName}
              onChange={(e) => setEditTaskName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="text"
              value={editTaskDescription}
              onChange={(e) => setEditTaskDescription(e.target.value)}
              className="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              value={editDeadline}
              onChange={handleDeadlineChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="col-span-1">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="col-span-1">
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="col-span-1 flex justify-end">
            <button
              onClick={handleEdit}
              className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="col-span-2 overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{todo.taskName}</h3>
            <p className="text-sm text-gray-600 truncate">{todo.taskDescription}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-700">
              {new Date(todo.deadline).toLocaleDateString()}
            </p>
          </div>
          <div className="col-span-1">
            <p
              className={`text-sm ${
                todo.priority === "High"
                  ? "text-red-600"
                  : todo.priority === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {todo.priority}
            </p>
          </div>
          {!isHome ? (
            <>
              <div className="col-span-1">
                <select
                  value={todo.status}
                  onChange={handleStatusChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
                >
                  <img src='/icons/edit-246.svg' alt="Edit" className="w-6 h-6" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <img src='/icons/delete.svg' alt="Delete" className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="col-span-1">{todo.status}</div>
          )}
        </>
      )}
    </div>
  );
};

export default TodoItem;
