import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import todoReducer, {
  setTodos,
  setFilter,
  setCompleted,
  setStatus,
  updateTodo,
  removeTodo,
  TodoState,
} from "@/store/todoSlice";

interface RootState {
  todo: TodoState;
}

describe("todoSlice", () => {
  let store: EnhancedStore<RootState>;

  // before each test, create a new store
  beforeEach(() => {
    store = configureStore({
      reducer: {
        todo: todoReducer,
      },
    });
  });

  test.skip("check initial state", () => {
    const initialState: TodoState = {
      todos: [],
      filter: {
        date: "mostRecent",
        priority: "all",
        status: "all",
      },
    };

    expect(store.getState().todo).toEqual(initialState);
  });

  test.skip("setTodos is able to correctly set todos", () => {
    const newTodos = [
      {
        id: "1",
        deadline: "2024-06-29",
        priority: "High",
        status: "Not Started",
        completed: false,
        taskName: "New Task",
        taskDescription: "Description",
        userId: "user123",
        notified: false,
      },
    ];

    store.dispatch(setTodos(newTodos));
    expect(store.getState().todo.todos).toEqual(newTodos);
  });

  test.skip("filter for priority", () => {
    const newFilter = { priority: "High" };
    store.dispatch(setFilter(newFilter));
    expect(store.getState().todo.filter.priority).toEqual("High");
  });

  test.skip("filter for status", () => {
    const newFilter = { status: "completed" };
    store.dispatch(setFilter(newFilter));
    expect(store.getState().todo.filter.status).toEqual("completed");
  });

  test.skip("filter for order of dates", () => {
    const newFilter = { date: "oldest" };
    store.dispatch(setFilter(newFilter));
    expect(store.getState().todo.filter.date).toEqual("oldest");
  });

  test.skip("update of completion status", () => {
    const todo = {
      id: "1",
      deadline: "2024-06-29",
      priority: "High",
      status: "Not Started",
      completed: false,
      taskName: "New Task",
      taskDescription: "Description",
      userId: "user123", // Add userId here
      notified: false, // Add notified here
    };

    store.dispatch(setTodos([todo]));
    store.dispatch(setCompleted({ id: "1", completed: true }));
    expect(store.getState().todo.todos[0].completed).toBe(true);
  });

  test.skip("should handle setStatus", () => {
    const todo = {
      id: "1",
      deadline: "2024-06-29",
      priority: "High",
      status: "Not Started",
      completed: false,
      taskName: "New Task",
      taskDescription: "Description",
      userId: "user123",
      notified: false,
    };

    store.dispatch(setTodos([todo]));
    store.dispatch(setStatus({ id: "1", status: "Completed" }));
    expect(store.getState().todo.todos[0].status).toEqual("Completed");
  });

  test.skip("should handle updateTodo", () => {
    const todo = {
      id: "1",
      deadline: "2024-06-29",
      priority: "High",
      status: "Not Started",
      completed: false,
      taskName: "New Task",
      taskDescription: "Description",
      userId: "user123",
      notified: false,
    };

    const updatedData = {
      taskName: "Updated Task",
      taskDescription: "Updated Description",
      deadline: "2024-08-08",
      priority: "Low",
      status: "In Progress",
    };

    store.dispatch(setTodos([todo]));
    store.dispatch(updateTodo({ id: "1", data: updatedData }));

    const updatedTodo = store.getState().todo.todos[0];
    expect(updatedTodo.taskName).toEqual("Updated Task");
    expect(updatedTodo.taskDescription).toEqual("Updated Description");
    expect(updatedTodo.deadline).toEqual("2024-08-08");
    expect(updatedTodo.priority).toEqual("Low");
    expect(updatedTodo.status).toEqual("In Progress");
  });

  test.skip("should handle removeTodo", () => {
    const todo = {
      id: "1",
      deadline: "2024-06-29",
      priority: "High",
      status: "Not Started",
      completed: false,
      taskName: "New Task",
      taskDescription: "Description",
      userId: "user123",
      notified: false,
    };

    store.dispatch(setTodos([todo]));
    store.dispatch(removeTodo("1"));
    expect(store.getState().todo.todos).toEqual([]);
  });
});
