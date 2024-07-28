import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FullScreenTopBar } from "./FullScreenTopBar";
import { setIsFullscreen, setpomodoroCycleCompleted } from "@/store/timerSlice";
import { useAuth } from "../Auth/AuthContext";

// Mock hooks and actions
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@/store/timerSlice", () => ({
  setIsFullscreen: jest.fn(),
  setIsUserTime: jest.fn(),
  setStudyTime: jest.fn(),
  setpomodoroCycleCompleted: jest.fn(),
}));

jest.mock("../Auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/components/Study/StudyTimer/CustomTimer", () => {
  return ({
    initialTime,
    onTimeUp,
    onTotalSecondsUpdate,
  }: {
    initialTime: number;
    onTimeUp: () => void;
    onTotalSecondsUpdate: (totalSeconds: number) => void;
  }) => {
    // Mock CountdownTimer component
    setTimeout(() => {
      onTimeUp();
    }, initialTime * 1000); // Simulate timer reaching zero
    return <div>Mock CountdownTimer</div>;
  };
});

jest.mock("./StudyTimer/PomodoroPatternTimer", () => {
  return ({
    onTimeUp,
    isStudyCycle,
    setStudyCycle,
    onCycleComplete,
  }: {
    onTimeUp: () => void;
    isStudyCycle: boolean;
    setStudyCycle: () => void;
    onCycleComplete: () => void;
  }) => {
    setTimeout(() => {
      onCycleComplete();
    }, 1000);
    return <div>Mock PomodoroPatternTimer</div>;
  };
});

jest.mock("next/link", () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      onClick={() => {
        useRouter().push(href);
      }}
    >
      {children}
    </a>
  );
});

describe("FullScreenTopBar Component", () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: true,
          countdownSeconds: 10,
          isUserTime: false,
          pomodoroCycleLeft: 0,
          pomodoroCycleCompleted: 0,
        },
      })
    );

    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: "testUserId" },
    });

    global.document.exitFullscreen = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.skip("renders Pomodoro timer correctly", async () => {
    // Set up mock state to ensure Pomodoro timer should be visible
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: true,
          countdownSeconds: 0,
          isUserTime: false,
          pomodoroCycleLeft: 1,
          pomodoroCycleCompleted: 0,
        },
      })
    );

    render(<FullScreenTopBar />);
    // Expect the text indicating number of cycles left to be displayed
    expect(screen.getByText(/No\. of cycles left/i)).toBeInTheDocument();
  });

  test.skip("Pomodoro timer runs correctly", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: true,
          countdownSeconds: 0,
          isUserTime: false,
          pomodoroCycleLeft: 1,
          pomodoroCycleCompleted: 0,
        },
      })
    );

    render(<FullScreenTopBar />);
    // Simulate the Pomodoro timer completing its cycle
    await new Promise((r) => setTimeout(r, 1000)); // Wait for the setTimeout in the mocked PomodoroPatternTimer

    expect(mockDispatch).toHaveBeenCalledWith(setpomodoroCycleCompleted(1));
  });

  test.skip("Custom timer runs correctly", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: true,
          countdownSeconds: 20,
          isUserTime: false,
          pomodoroCycleLeft: 0,
          pomodoroCycleCompleted: 0,
        },
      })
    );

    render(<FullScreenTopBar />);
    expect(screen.queryByText("No. of cycles left")).not.toBeInTheDocument();
  });

  test.skip("handles None tab click correctly", () => {
    render(<FullScreenTopBar />);

    fireEvent.click(screen.getByText("None"));

    expect(mockPush).toHaveBeenCalledWith("/study/background");
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsFullscreen(false));
  });

  test.skip("handles Todo tab click correctly", () => {
    render(<FullScreenTopBar />);

    fireEvent.click(screen.getByText("Todo"));

    expect(mockPush).toHaveBeenCalledWith("/todos");
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsFullscreen(false));
  });

  test.skip("handles Community tab click correctly", () => {
    render(<FullScreenTopBar />);

    fireEvent.click(screen.getByText("Community"));

    expect(mockPush).toHaveBeenCalledWith("/chatrooms");
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsFullscreen(false));
  });
});
