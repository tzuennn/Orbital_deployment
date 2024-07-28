import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo, Filter } from "@/components/Todo/types"; 

export interface TodoState {
  todos: Todo[];
  filter: Filter;
}

const initialTodoState: TodoState = {
  todos: [],
  filter: {
    date: "mostRecent",
    priority: "all",
    status: "all",
  },
};

const toISOStringIfValid = (date: any) => {
  if (!date) return null;
  try {
    if (typeof date.toDate === "function") {
      return date.toDate().toISOString();
    } else if (typeof date === "string" || date instanceof Date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    }
  } catch (e) {
    console.error("Invalid date value", e);
  }
  return null;
};

export const todoSlice = createSlice({
  name: "todo",
  initialState: initialTodoState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload.map(todo => ({
        ...todo,
        completedAt: toISOStringIfValid(todo.completedAt),
      }));
    },
    setFilter(state, action: PayloadAction<Partial<Filter>>) {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },
    setCompleted(
      state,
      action: PayloadAction<{ id: string; completed: boolean }>
    ) {
      const { id, completed } = action.payload;
      const index = state.todos.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.todos[index].completed = completed;
        state.todos[index].completedAt = completed ? new Date().toISOString() : null; // Set completedAt as ISO string
      }
    },
    setStatus(state, action: PayloadAction<{ id: string; status: string }>) {
      const { id, status } = action.payload;
      const index = state.todos.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.todos[index].status = status;
      }
    },
    updateTodo(
      state,
      action: PayloadAction<{ id: string; data: Partial<Todo> }>
    ) {
      const { id, data } = action.payload;
      const index = state.todos.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...data };
        if (data.completedAt) {
          state.todos[index].completedAt = toISOStringIfValid(data.completedAt);
        }
      }
    },
    removeTodo(
      state,
      action: PayloadAction<string>
    ) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { setTodos, setFilter, setCompleted, setStatus, updateTodo, removeTodo } =
  todoSlice.actions;

export default todoSlice.reducer;
