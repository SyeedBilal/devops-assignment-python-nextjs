import { render, screen, waitFor } from "@testing-library/react";
import Home from "../pages/index";
import axios from "axios";

jest.mock("axios");

test("shows error when backend is down", async () => {
  // Fake backend failure
  axios.get.mockRejectedValueOnce(new Error("Backend down"));

  render(<Home />);

  await waitFor(() =>
    expect(screen.getByText("Backend connection failed")).toBeInTheDocument()
  );

  expect(
    screen.getByText("Failed to connect to the backend")
  ).toBeInTheDocument();
});
