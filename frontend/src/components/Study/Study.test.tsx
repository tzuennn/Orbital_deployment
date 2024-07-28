import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Study from "@/components/Study/Study";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsUserTime,
  setIsFullscreen,
  setCountdownSeconds,
  setpomodoroCycleLeft,
} from "@/store/timerSlice";
import { useAuth } from "@/components/Auth/AuthContext";

// Mock hooks and actions
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@/store/timerSlice", () => ({
  setIsUserTime: jest.fn(),
  setIsFullscreen: jest.fn(),
  setCountdownSeconds: jest.fn(),
  setpomodoroCycleLeft: jest.fn(),
}));

jest.mock("@/components/Auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Study Component", () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();
  const mockUseAuth = {
    currentUser: { uid: "123" },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: false,
          isUserTime: false,
          countdownSeconds: 0,
          pomodoroCycleLeft: 0,
          pomodoroCycleCompleted: 0,
        },
      })
    );
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);

    // Mock requestFullscreen
    global.Element.prototype.requestFullscreen = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();

    if ("requestFullscreen" in global.Element.prototype) {
      delete (global.Element.prototype as any).requestFullscreen;
    }
  });

  test.skip("renders Study page and handles Start to Study button click", () => {
    render(<Study />);

    const startButton = screen.getByText("Start to Study");
    expect(startButton).toBeInTheDocument();

    fireEvent.click(startButton);

    expect(mockDispatch).toHaveBeenCalledWith(setIsUserTime(true));
  });

  test.skip("shows alert when both minutes and seconds are zero", async () => {
    render(<Study />);

    fireEvent.click(screen.getByText("Start to Study"));

    // Mock useSelector to return updated state with isUserTime = true
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: false,
          isUserTime: true,
          countdownSeconds: 0,
          pomodoroCycleLeft: 0,
          pomodoroCycleCompleted: 0,
        },
      })
    );

    // Re-render the component to reflect the updated state
    render(<Study />);

    // Simulate selecting the "Custom" option
    fireEvent.change(screen.getByLabelText("Study pattern"), {
      target: { value: "custom" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    fireEvent.change(screen.getByPlaceholderText("0 minutes"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByPlaceholderText("0 seconds"), {
      target: { value: "0" },
    });
    fireEvent.submit(screen.getByText("Submit"));

    await waitFor(() => {
      expect(
        screen.getByText("Time can't be set as 0. Please enter a valid time.")
      ).toBeInTheDocument();
    });
  });

  test.skip("handles form submission and enters fullscreen mode", async () => {
    render(<Study />);

    fireEvent.click(screen.getByText("Start to Study"));

    // Mock useSelector to return updated state with isUserTime = true
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: false,
          isUserTime: true,
          countdownSeconds: 0,
          pomodoroCycleLeft: 0,
          pomodoroCycleCompleted: 0,
        },
      })
    );

    // Re-render the component to reflect the updated state
    render(<Study />);
    fireEvent.change(screen.getByLabelText("Study pattern"), {
      target: { value: "custom" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    fireEvent.change(screen.getByPlaceholderText("0 minutes"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText("0 seconds"), {
      target: { value: "30" },
    });
    fireEvent.submit(screen.getByText("Submit"));

    // Find the closest element to the Confirm button and ensure it has requestFullscreen
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setCountdownSeconds(90));
      expect(mockDispatch).toHaveBeenCalledWith(setIsFullscreen(true));
      expect(global.Element.prototype.requestFullscreen).toHaveBeenCalled();
    });
  });

  // test for Go back button
  test.skip("handles going back to the home page", async () => {
    render(<Study />);
    fireEvent.click(screen.getByText("Go back"));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });

  test.skip("renders Pomodoro model", async () => {
    render(<Study />);

    fireEvent.click(screen.getByText("Start to Study"));

    // Mock useSelector to return updated state with isUserTime = true
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: false,
          isUserTime: true,
          countdownSeconds: 0,
          pomodoroCycleLeft: 0,
          pomodoroCycleCompleted: 0,
        },
      })
    );

    // Re-render the component to reflect the updated state
    render(<Study />);

    // Simulate selecting the "Custom" option
    fireEvent.change(screen.getByLabelText("Study pattern"), {
      target: { value: "pomodoro" },
    });
    fireEvent.click(screen.getByText("Confirm"));
    // Check if the PomodoroModal is rendered
    await waitFor(() => {
      expect(
        screen.getByText(
          "The Pomodoro Technique is a time management method that involves breaking work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a Pomodoro."
        )
      ).toBeInTheDocument();
    });
  });
  test.skip("Pomodoro model renders fullscreen correctly", async () => {
    render(<Study />);

    fireEvent.click(screen.getByText("Start to Study"));

    // Mock useSelector to return updated state with isUserTime = true
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: false,
          isUserTime: true,
          countdownSeconds: 0,
          pomodoroCycleLeft: 0,
          pomodoroCycleCompleted: 0,
        },
      })
    );

    // Re-render the component to reflect the updated state
    render(<Study />);

    // Simulate selecting the "Custom" option
    fireEvent.change(screen.getByLabelText("Study pattern"), {
      target: { value: "Pomodoro" },
    });
    fireEvent.click(screen.getByText("Confirm"));
    fireEvent.change(screen.getByLabelText("Number of Pomodoro cycles:"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByText("Let's Go"));
    await waitFor(() => {
      expect(global.Element.prototype.requestFullscreen).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setpomodoroCycleLeft(1));
    });
  });
});
