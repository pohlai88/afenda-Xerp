import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RouteSegmentError } from "../components/route-segment-error";

vi.mock("@/lib/observability/report-client-error.client", () => ({
  reportClientError: vi.fn(),
}));

const defaultProps = {
  description: "The workspace surface failed to render. Please try again.",
  error: Object.assign(new Error("render failure"), { digest: "test-digest" }),
  reset: vi.fn(),
  segment: "protected",
  title: "Workspace unavailable",
} as const;

describe("RouteSegmentError", () => {
  it("renders accessible error panel with retry action", () => {
    render(<RouteSegmentError {...defaultProps} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Workspace unavailable" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The workspace surface failed to render. Please try again."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });

  it("does not leak error message or stack into the DOM", () => {
    const error = new Error("secret sql failure");
    error.stack = "Error: secret sql failure\n    at sensitive.ts:42";

    const { container } = render(
      <RouteSegmentError {...defaultProps} error={error} />
    );

    expect(container.textContent).not.toContain("secret sql failure");
    expect(container.textContent).not.toContain("sensitive.ts");
  });

  it("wraps page variant in an assertive live region", () => {
    const { container } = render(
      <RouteSegmentError {...defaultProps} variant="page" />
    );

    const liveRegion = container.querySelector('[aria-live="assertive"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toContainElement(screen.getByRole("alert"));
  });
});
