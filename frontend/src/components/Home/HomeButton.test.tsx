import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomeButton from "./HomeButton";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("HomeButton Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to /stats when the button is clicked", () => {
    render(<HomeButton web="/todos" buttonText="Proceed to check" />);

    fireEvent.click(screen.getByText("Proceed to check"));
    expect(mockPush).toHaveBeenCalledWith("/todos");
  });
});
