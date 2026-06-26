import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthShellStatusSurface } from "../auth-shell.js";

describe("AuthShellStatusSurface (v2)", () => {
  it.each([
    ["info", "info"],
    ["positive", "positive"],
    ["warning", "warning"],
    ["neutral", "neutral"],
  ] as const)("renders tone=%s via data-tone attribute", (tone, dataTone) => {
    const { container } = render(
      <AuthShellStatusSurface
        description="Status body copy."
        title={`Status ${tone}`}
        tone={tone}
      />
    );

    const surface = container.querySelector("[data-auth-slot='status']");
    expect(surface?.getAttribute("data-tone")).toBe(dataTone);
    expect(
      screen.getByRole("heading", { level: 2, name: `Status ${tone}` })
    ).toBeTruthy();
    expect(screen.getByText("Status body copy.")).toBeTruthy();
  });
});
