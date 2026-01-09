import { render, screen, waitFor } from "@testing-library/react";
import Home from "../pages/index";
import axios from "axios";

jest.mock("axios");

test("shows backend message when backend is healthy", async () => {
  // Step 1: Fake backend responses
  axios.get
    .mockResolvedValueOnce({
      data: { status: "healthy" },
    })
    .mockResolvedValueOnce({
      data: { message: "You've successfully integrated the backend!" },
    });

  // Step 2: Render the page
  render(<Home />);

  // Step 3: Wait for UI update
  await waitFor(() =>
    expect(screen.getByText("Backend is connected!")).toBeInTheDocument()
  );

  // Step 4: Check backend message
  expect(
    screen.getByText("You've successfully integrated the backend!")
  ).toBeInTheDocument();
});
