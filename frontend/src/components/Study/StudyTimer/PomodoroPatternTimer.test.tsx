import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import PomodoroPatternTimer from "./PomodoroPatternTimer";
import { useAuth } from "../../Auth/AuthContext";
import { useTimer } from "react-timer-hook";

// Mock hooks and actions
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@/store/timerSlice", () => ({
  setpomodoroCycleLeft: jest.fn(),
}));

jest.mock("react-timer-hook", () => ({
  useTimer: jest.fn(),
}));

jest.mock("../../Auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("PomodoroPatternTimer Component", () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();
  const mockCurrentUser = { uid: "testUserId" };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          pomodoroCycleLeft: 1,
        },
      })
    );
    (useAuth as jest.Mock).mockReturnValue({ currentUser: mockCurrentUser });

    // Mock the useTimer hook
    (useTimer as jest.Mock).mockImplementation(({ onExpire }) => ({
      seconds: 0,
      minutes: 0,
      pause: jest.fn(),
      resume: jest.fn(),
      restart: jest.fn(),
      onExpire: () => onExpire(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.skip("navigates to the summary page when the Pomodoro timer runs out", () => {
    render(
      <PomodoroPatternTimer
        onTimeUp={() => {}}
        isStudyCycle={false} // Set to false to simulate break time
        setStudyCycle={() => {}}
        onCycleComplete={() => {}}
      />
    );

    // Simulate timer expiration
    act(() => {
      (useTimer as jest.Mock).mock.results[0].value.onExpire();
    });

    expect(mockPush).toHaveBeenCalledWith("/study/summary");
  });
});
