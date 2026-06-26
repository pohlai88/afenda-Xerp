import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { VerifyEmailState } from "@/app/(auth)/_components/verify-email-state";

describe("VerifyEmailState", () => {
  it("renders verification guidance and sign-in return path", () => {
    render(
      <AuthEntryPage route="verifyEmail">
        <VerifyEmailState />
      </AuthEntryPage>
    );

    expect(
      screen.getByRole("heading", { name: "Verify your email" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/one more step before you can enter your workspace/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/check your inbox for the verification link/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to sign in" })
    ).toHaveAttribute("href", "/sign-in");
    expect(
      screen.getAllByRole("link", { name: "Return to sign in" })[0]
    ).toHaveAttribute("href", "/sign-in?notice=verify-email");
  });
});
