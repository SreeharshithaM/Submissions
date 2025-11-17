import { render, screen } from "@testing-library/react";
import ApiButton from "../Components/ApiButton";

test("renders High when value is 15", () => {
  render(<ApiButton value={15} />);
  expect(screen.getByText("High")).toBeInTheDocument();
});
