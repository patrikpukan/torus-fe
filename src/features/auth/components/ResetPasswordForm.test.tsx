import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import ResetPasswordForm from "./ResetPasswordForm";

describe("ResetPasswordForm", () => {
  it("should render the reset password form", () => {
    render(
      <MemoryRouter>
        <ResetPasswordForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send reset password email" })
    ).toBeInTheDocument();
  });
});
