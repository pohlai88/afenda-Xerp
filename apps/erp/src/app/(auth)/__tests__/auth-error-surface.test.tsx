import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AuthErrorSignInEscape,
  AuthErrorSurface,
} from "@/app/(auth)/_components/auth-error-surface.client";

describe("AuthErrorSurface", () => {
  it("renders industrial-trust copy, retry, and composed sign-in escape hatch", () => {
    render(
      <AuthErrorSurface
        description="The authentication surface failed before your session could start."
        eyebrow="Sign-in interrupted"
        onRetry={() => undefined}
        retryLabel="Reload sign-in"
        title="Could not load sign-in"
      >
        <AuthErrorSignInEscape />
      </AuthErrorSurface>
    );

    expect(screen.getByRole("alert")).toHaveAttribute(
      "aria-labelledby",
      "auth-shell-error-title"
    );
    expect(
      screen.getByRole("heading", { name: "Could not load sign-in" })
    ).toBeInTheDocument();
    expect(screen.getByText(/sign-in interrupted/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reload sign-in" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Return to sign in" })
    ).toHaveAttribute("href", "/sign-in");
  });
});
