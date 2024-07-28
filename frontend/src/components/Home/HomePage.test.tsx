import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "@/components/Home/HomePage";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthContext";

// mock hooks to test sign-up form submission
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/Auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// group all test cases related to homepage component
describe("HomePage Component", () => {
  const mockPush = jest.fn();
  const mockSignup = jest.fn();
  const mockLoginWithGoogle = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      loginWithGoogle: mockLoginWithGoogle,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.skip("renders sign-up form", () => {
    render(<HomePage />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Profile Picture URL (optional)")
    ).toBeInTheDocument();
  });

  test.skip("handles sign-up submission successfully with url", async () => {
    // mockresolvedvalueonce speeifies the return value
    mockSignup.mockResolvedValueOnce(undefined);

    render(<HomePage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "username" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Profile Picture URL (optional)"),
        {
          target: { value: "http://example.com/profile.jpg" },
        }
      );
      fireEvent.click(screen.getByText("Sign up with email"));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "test@test.com",
        "password",
        "username",
        "http://example.com/profile.jpg"
      );
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });

  test.skip("handles sign-up submission successfully without url", async () => {
    // mockresolvedvalueonce speeifies the return value
    mockSignup.mockResolvedValueOnce(undefined);

    render(<HomePage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "username" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Profile Picture URL (optional)"),
        {
          target: { value: "" },
        }
      );
      fireEvent.click(screen.getByText("Sign up with email"));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "test@test.com",
        "password",
        "username",
        ""
      );
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });

  test.skip("handles sign-up submission failure due to invalid email", async () => {
    mockSignup.mockRejectedValueOnce({ code: "auth/invalid-email" });

    render(<HomePage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "1@1" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "username" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Profile Picture URL (optional)"),
        {
          target: { value: "" },
        }
      );
      fireEvent.click(screen.getByText("Sign up with email"));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "1@1",
        "password",
        "username",
        ""
      );
      expect(
        screen.getByText("The email address is not valid.")
      ).toBeInTheDocument();
    });
  });

  test.skip("handles sign-up submission with pw length < 6", async () => {
    mockSignup.mockRejectedValueOnce({ code: "auth/weak-password" });

    render(<HomePage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "123" },
      });
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "username" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Profile Picture URL (optional)"),
        {
          target: { value: "" },
        }
      );
      fireEvent.click(screen.getByText("Sign up with email"));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "test@test.com",
        "123",
        "username",
        ""
      );
      expect(
        screen.getByText(
          "The password is too weak. Length should be at least 6 characters."
        )
      ).toBeInTheDocument();
    });
  });

  test.skip("handles sign-up submission with account alr existing", async () => {
    mockSignup.mockRejectedValueOnce({ code: "auth/email-already-in-use" });

    render(<HomePage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "username" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("Profile Picture URL (optional)"),
        {
          target: { value: "" },
        }
      );
      fireEvent.click(screen.getByText("Sign up with email"));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "test@test.com",
        "password",
        "username",
        ""
      );
      expect(
        screen.getByText(
          "The email address is already in use by another account."
        )
      ).toBeInTheDocument();
    });
  });
});
