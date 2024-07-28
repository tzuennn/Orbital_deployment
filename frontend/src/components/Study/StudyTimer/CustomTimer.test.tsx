import { render, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CountdownTimer from "./CustomTimer";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTimer } from "react-timer-hook";
import { setStudyTime } from "@/store/timerSlice";
import { useAuth } from "../../Auth/AuthContext";

// Mock hooks and actions
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("react-timer-hook", () => ({
  useTimer: jest.fn(),
}));

jest.mock("@/store/timerSlice", () => ({
  setStudyTime: jest.fn(),
}));

jest.mock("../../Auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("CountdownTimer Component", () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();
  const mockCurrentUser = { uid: "testUserId" };
  const mockOnTimeUp = jest.fn();
  const mockOnTotalSecondsUpdate = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useAuth as jest.Mock).mockReturnValue({ currentUser: mockCurrentUser });

    // Mock the useTimer hook to provide a method to simulate expiry
    (useTimer as jest.Mock).mockImplementation(({ onExpire }) => ({
      seconds: 0,
      minutes: 0,
      pause: jest.fn(),
      resume: jest.fn(),
      restart: jest.fn(),
      totalSeconds: 0,
      onExpire: onExpire,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.skip("navigates to summary page when the timer runs out", async () => {
    render(
      <CountdownTimer
        initialTime={1} // 1 second for testing
        onTimeUp={mockOnTimeUp}
        onTotalSecondsUpdate={mockOnTotalSecondsUpdate}
      />
    );

    // Simulate the timer running out by invoking onExpire directly
    await act(async () => {
      (useTimer as jest.Mock).mock.results[0].value.onExpire();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/study/summary");
      expect(mockDispatch).toHaveBeenCalledWith(setStudyTime(1));
      expect(mockOnTimeUp).toHaveBeenCalled();
    });
  });
});
