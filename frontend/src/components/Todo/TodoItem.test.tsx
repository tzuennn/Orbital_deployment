import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TodoItem from "@/components/Todo/TodoItem";
import { removeTodo, updateTodo } from "@/store/todoSlice";
import { deleteDoc, updateDoc } from "firebase/firestore";

// mock firestore functions
jest.mock("firebase/firestore", () => {
  const originalModule = jest.requireActual("firebase/firestore");
  return {
    ...originalModule,
    doc: jest.fn(() => ({ id: "mocked-doc-id" })),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
  };
});

const mockStore = configureStore([]);

describe("TodoItem", () => {
  // sample todo to be used for testing
  const todo = {
    id: "1",
    taskName: "Test Todo",
    taskDescription: "This is a test todo",
    deadline: "2024-06-29",
    status: "Not Started",
    priority: "Medium",
    completed: false,
  };

  // mock store with initial state + sample todo
  const store = mockStore({
    todo: {
      todos: [todo],
      filter: {
        date: "mostRecent",
        priority: "all",
        status: "all",
      },
    },
  });

  // helper function to render component with provider
  const renderWithProvider = (component: React.ReactElement) => {
    render(<Provider store={store}>{component}</Provider>);
  };

  test.skip("renders the todo item", () => {
    renderWithProvider(<TodoItem todo={todo} isHome={false} />);
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("This is a test todo")).toBeInTheDocument();
    // note the change in date format
    expect(screen.getByText("6/29/2024")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  test.skip("toggles the todo item's completion status", async () => {
    renderWithProvider(<TodoItem todo={todo} isHome={false} />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Completed" },
    });
    await waitFor(() => {
      // note updatedoc takes in 2 args - doc reference and data
      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(), // doc reference can be anything
        expect.objectContaining({
          // this is referring to the obj
          status: "Completed",
          completed: true,
        })
      );
    });
    expect(store.getActions()).toContainEqual(
      updateTodo({
        id: "1",
        data: {
          status: "Completed",
          completed: true,
        },
      })
    );
  });

  test.skip("deletes the todo item", async () => {
    renderWithProvider(<TodoItem todo={todo} isHome={false} />);
    fireEvent.click(screen.getByAltText("Delete"));
    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
    });
    expect(store.getActions()).toContainEqual(removeTodo("1"));
  });

  test.skip("edits the todo item", async () => {
    renderWithProvider(<TodoItem todo={todo} isHome={false} />);
    fireEvent.click(screen.getByAltText("Edit"));
    fireEvent.change(screen.getByDisplayValue("Test Todo"), {
      target: { value: "Updated Todo" },
    });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          taskName: "Updated Todo",
        })
      );
    });
    expect(store.getActions()).toContainEqual(
      updateTodo({
        id: "1",
        data: {
          taskName: "Updated Todo",
          taskDescription: "This is a test todo",
          deadline: "2024-06-29",
          priority: "Medium",
          status: "Not Started",
        },
      })
    );
  });

  test.skip("handles overdue deadline change", () => {
    renderWithProvider(<TodoItem todo={todo} isHome={false} />);
    fireEvent.click(screen.getByAltText("Edit"));
    fireEvent.change(screen.getByDisplayValue("2024-06-29"), {
      target: { value: "2023-06-29" },
    });
    expect(screen.getByDisplayValue("Overdue")).toBeInTheDocument();
  });
});
