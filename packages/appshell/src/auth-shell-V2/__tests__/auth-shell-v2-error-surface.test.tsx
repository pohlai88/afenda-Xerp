import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthShellErrorSurface } from "../auth-shell-v2-error-surface.client.js";

describe("AuthShellErrorSurface (v2)", () => {
  it("renders user-safe copy without raw technical error by default", () => {
    render(
      <AuthShellErrorSurface
        description="The sign-in surface failed to load."
        title="Something went wrong"
      />
    );

    expect(
      screen.getByRole("alert", { name: /something went wrong/i })
    ).toBeTruthy();
    expect(screen.getByText(/sign-in surface failed to load/i)).toBeTruthy();
    expect(screen.queryByText(/stack trace/i)).toBeNull();
  });

  it("renders diagnostic reason only when explicitly supplied", () => {
    render(
      <AuthShellErrorSurface
        description="Try again shortly."
        reason="ERR_AUTH_SURFACE_503"
        title="Service unavailable"
      />
    );

    expect(screen.getByText(/ERR_AUTH_SURFACE_503/)).toBeTruthy();
  });

  it("renders embedded alert without full-viewport error root", () => {
    const { container } = render(
      <AuthShellErrorSurface
        description="Try again shortly."
        embedded
        title="Embedded error"
      />
    );

    expect(container.querySelector(".af-auth-shell__error")).toBeNull();
    expect(screen.getByRole("alert", { name: /embedded error/i })).toBeTruthy();
  });

  it.each([
    ["neutral", "neutral"],
    ["warning", "warning"],
    ["critical", "critical"],
    ["expired", "expired"],
    ["forbidden", "forbidden"],
  ] as const)("renders tone=%s via data-tone attribute", (tone, dataTone) => {
    const { container } = render(
      <AuthShellErrorSurface
        description="Surface copy."
        title={`Error ${tone}`}
        tone={tone}
      />
    );

    const alert = container.querySelector(".af-auth-shell__error-alert");
    expect(alert?.getAttribute("data-tone")).toBe(dataTone);
  });
});
