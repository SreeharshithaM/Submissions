// src/ApiButton2.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import ApiButton2 from "../Components/ApiButton2";


beforeEach(() => {
  jest.clearAllMocks();
});

test("fetches and displays API result for ApiButton2", async () => {
  const mockData = { id: 1, name: "Test User" };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockData),
    })
  );

  render(<ApiButton2 />);

  fireEvent.click(screen.getByTestId("btn2"));

  const result = await screen.findByTestId("result2");

  expect(result).toHaveTextContent("Test User");
  expect(fetch).toHaveBeenCalledTimes(1);
});
