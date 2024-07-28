import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useRouter } from "next/navigation";
import Profile from "./Profile"; // Adjust the import path as needed
import { RootState } from "@/store/store";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the useAuth hook
jest.mock("@/components/Auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Create a mock store with initial state
const mockStore = configureStore([]);
const initialState: Partial<RootState> = {
  userInfo: {
    userId: "1",
    nickname: "TestNick",
    yearOfStudy: "2",
    faculty: "Engineering",
    major: "Computer Science",
    hobby: "Gaming",
    cca: "Robotics",
    birthday: null,
    todayXP: 20,
    totalXP: 100,
  },
};

describe("Profile Component", () => {
  const mockPush = jest.fn();
  const mockUseAuth = jest.requireMock("@/components/Auth/AuthContext").useAuth;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    mockUseAuth.mockReturnValue({
      profile: { displayName: "Test User" },
      profileData: {
        nickname: "TestNick",
        yearOfStudy: "2",
        faculty: "Engineering",
        major: "Computer Science",
        hobby: "Gaming",
        cca: "Robotics",
        birthday: "2000-01-01",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to /profile/particulars when the edit icon is clicked", () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    // Simulate a click event on the FaEdit icon
    fireEvent.click(screen.getByTestId("edit-profile-icon"));

    expect(mockPush).toHaveBeenCalledWith("/profile/particulars");
  });
});
