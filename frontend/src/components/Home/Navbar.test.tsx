import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "../Auth/AuthContext";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { RootState } from "@/store/store";

// Mock hooks and actions
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../Auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockStore = configureStore([]);

describe("Navbar Component", () => {
  const mockPush = jest.fn();
  const mockCurrentUser = { uid: "testUserId" };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
      logout: () => {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const initialState: RootState = {
    userInfo: {
      userId: "testUserId",
      nickname: "TestUser",
      yearOfStudy: "2",
      faculty: "Science",
      major: "Computer Science",
      hobby: "Reading",
      cca: "Chess Club",
      birthday: null,
      todayXP: 10,
      totalXP: 100,
    },
    timer: {
      isFullscreen: false,
      isUserTime: false,
      pomodoroCycleLeft: 0,
      pomodoroCycleCompleted: 0,
      countdownSeconds: 0,
      backgroundSettings: {
        backgroundImage: "",
      },
      showAdditionalSetting: false,
      studyTime: 0,
    },
    todo: {
      todos: [],
      filter: {
        date: "mostRecent",
        priority: "all",
        status: "all",
      },
    },
  };

  const store = mockStore(initialState);

  test.skip("navigates to /todos when Todos link is clicked", () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );

    fireEvent.click(screen.getByText("Todos"));
    expect(mockPush).toHaveBeenCalledWith("/todos");
  });

  test.skip("navigates to /study when Study link is clicked", () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );

    fireEvent.click(screen.getByText("Study"));
    expect(mockPush).toHaveBeenCalledWith("/study");
  });

  test.skip("navigates to /chatrooms when Community link is clicked", () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );

    fireEvent.click(screen.getByText("Community"));
    expect(mockPush).toHaveBeenCalledWith("/community");
  });

  test.skip("logs out and navigates to / when Logout button is clicked", async () => {
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );

    fireEvent.click(screen.getByText("Logout"));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
