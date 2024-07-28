import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VirtualSpaceSection from "./VirtualSpaceSection";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("VirtualSpaceSection Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to /stats when the button is clicked", () => {
    render(<VirtualSpaceSection />);

    fireEvent.click(screen.getByText("Get My Stats"));
    expect(mockPush).toHaveBeenCalledWith("/stats");
  });
});
