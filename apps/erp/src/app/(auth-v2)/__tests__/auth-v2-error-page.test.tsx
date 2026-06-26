import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AuthV2ErrorPage from "../error";

vi.mock("@/lib/observability/report-client-error.client", () => ({
  reportClientError: vi.fn(),
}));

vi.mock("@/app/(auth-v2)/_components/auth-v2-brand-context", () => ({
  useAuthV2Brand: () => null,
}));

describe("AuthV2ErrorPage", () => {
  it("renders user-safe segment copy with retry and sign-in escape", () => {
    render(
      <AuthV2ErrorPage
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
    ).toBe("/v2/sign-in");
    expect(screen.queryByText(/segment failure/i)).toBeNull();
  });
});
