import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthShellErrorSurface } from "../auth-shell-error-surface.client.js";

describe("AuthShellErrorSurface", () => {
  it("disables retry while recovery is in progress", () => {
    render(
      <AuthShellErrorSurface
        description="Authentication is temporarily unavailable."
        isRetrying
        onRetry={() => undefined}
        title="Service unavailable"
      />
    );

    const retryButton = screen.getByRole("button", { name: "Retrying…" });
    expect(retryButton).toBeDisabled();
    expect(retryButton).toHaveAttribute("aria-busy", "true");
  });

  it("does not render retry actions when onRetry is omitted", () => {
    render(
      <AuthShellErrorSurface
        description="Authentication is temporarily unavailable."
        title="Service unavailable"
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("invokes onRetry when the governed button is clicked", async () => {
    const onRetry = vi.fn();

    render(
      <AuthShellErrorSurface
        description="The sign-in surface failed to load."
        onRetry={onRetry}
        retryLabel="Try again"
        title="Something went wrong"
      />
    );

    screen.getByRole("button", { name: "Try again" }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
