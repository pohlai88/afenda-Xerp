import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthPageFooter } from "@/app/(auth)/_components/auth-page-footer";

describe("AuthPageFooter", () => {
  it("renders legal links on every auth page", () => {
    render(<AuthPageFooter route="signIn" />);

    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "/legal/privacy");
    expect(
      screen.getByRole("link", { name: "Terms of Service" })
    ).toHaveAttribute("href", "/legal/terms");
  });

  it("renders route links when enabled", () => {
    render(<AuthPageFooter route="forgotPassword" showRouteLinks />);

    expect(
      screen.getByRole("link", { name: "Back to sign in" })
    ).toHaveAttribute("href", "/sign-in");
  });
});
