import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";

import ProfileCalendar from "./ProfileCalendar";

describe("ProfileCalendar", () => {
  it("should render the calendar", () => {
    render(
      <MockedProvider mocks={[]}>
        <ProfileCalendar />
      </MockedProvider>
    );

    expect(screen.getByText("Today")).toBeInTheDocument();
  });
});
