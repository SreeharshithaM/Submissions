import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders welcome text", () => {
  render(<App />);
  expect(screen.getByText(/welcome to first-app/i)).toBeInTheDocument();
});

test("increments count when button clicked", () => {
  render(<App />);
  const btn = screen.getByTestId("increase-btn");
  fireEvent.click(btn);
  fireEvent.click(btn);
  expect(screen.getByTestId("count-value")).toHaveTextContent("Count: 2");
});

test("doubles count when double button clicked", () => {
  render(<App />);
  const inc = screen.getByTestId("increase-btn");
  const double = screen.getByTestId("double-btn");

  fireEvent.click(inc);   // count = 1
  fireEvent.click(double); // count = 2

  expect(screen.getByTestId("count-value")).toHaveTextContent("Count: 2");
});
