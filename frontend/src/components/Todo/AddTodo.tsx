import React, { useRef, useState, FormEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useAuth } from "../Auth/AuthContext";

const AddTodo: React.FC = () => {
  const taskNameRef = useRef<HTMLInputElement>(null);
  const taskDescriptionRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth() || {};
  const [status, setStatus] = useState<string>("Not Started");
  const [priority, setPriority] = useState<string>("Low");

  const handleDateChange = () => {
    if (deadlineRef.current) {
      const deadlineDate = new Date(deadlineRef.current.value);
      const currentDate = new Date();

      // set time components to zero for accurate date comparison
      deadlineDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (deadlineDate <= currentDate) {
        setStatus("Overdue");
      } else {
        setStatus("Not Started");
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      taskNameRef.current &&
      taskDescriptionRef.current &&
      deadlineRef.current
    ) {
      await addDoc(collection(firestore, "todos"), {
        userId: currentUser?.uid,
        taskName: taskNameRef.current.value,
        taskDescription: taskDescriptionRef.current.value,
        deadline: deadlineRef.current.value,
        status: status,
        priority: priority,
        completed: status === "Completed" ? true : false,
        completedAt: status === "Completed" ? new Date() : null, // Set completedAt if the status is completed
        notified: false,
      });

      taskNameRef.current.value = "";
      taskDescriptionRef.current.value = "";
      deadlineRef.current.value = "";
      setStatus("Not Started");
      setPriority("Low");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="taskName"
            className="block text-sm font-medium text-gray-700"
          >
            Task Name
          </label>
          <input
            type="text"
            id="taskName"
            name="taskName"
            ref={taskNameRef}
            placeholder="Task Name"
            autoComplete="off"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label
            htmlFor="taskDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Task Description
          </label>
          <input
            type="text"
            id="taskDescription"
            name="taskDescription"
            ref={taskDescriptionRef}
            placeholder="Task Description"
            autoComplete="off"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700"
          >
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            ref={deadlineRef}
            autoComplete="off"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleDateChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Overdue</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-600"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTodo;
