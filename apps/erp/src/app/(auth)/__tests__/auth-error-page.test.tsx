import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AuthErrorPage from "../error";

vi.mock("@/lib/observability/report-client-error.client", () => ({
  reportClientError: vi.fn(),
}));

vi.mock("@/app/(auth)/_components/auth-brand-context", () => ({
  useAuthBrand: () => null,
}));

describe("AuthErrorPage", () => {
  it("renders user-safe segment copy with retry and sign-in escape", () => {
    render(
      <AuthErrorPage
        error={new Error("segment failure")}
        reset={() => undefined}
      />
    );

    expect(
      screen.getByRole("alert", { name: /could not load sign-in/i })
    ).toBeTruthy();
    expect(
      screen.getByText(/sign-in surface failed before your session/i)
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /reload sign-in/i })
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /return to sign in/i })
        .getAttribute("href")
    ).toBe("/sign-in");
    expect(screen.queryByText(/segment failure/i)).toBeNull();
  });
});
