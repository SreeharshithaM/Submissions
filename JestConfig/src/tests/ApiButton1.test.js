// src/ApiButton1.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import ApiButton1 from "../Components/ApiButton1";


beforeEach(() => {
  jest.clearAllMocks();
});

test("fetches and displays API result for ApiButton1", async () => {
  const mockData = { id: 1, title: "Test Post" };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockData),
    })
  );

  render(<ApiButton1 />);

  fireEvent.click(screen.getByTestId("btn1"));

  const result = await screen.findByTestId("result1");

  expect(result).toHaveTextContent("Test Post");
  expect(fetch).toHaveBeenCalledTimes(1);
});
