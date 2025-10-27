import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProfileCalendar from "./ProfileCalendar";

describe("ProfileCalendar", () => {
  it("should render the calendar", () => {
    render(<ProfileCalendar />);

    expect(screen.getByText("Today")).toBeInTheDocument();
  });
});
