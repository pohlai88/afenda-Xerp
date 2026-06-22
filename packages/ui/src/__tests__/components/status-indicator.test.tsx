import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusIndicator } from "../../index";

describe("StatusIndicator governance", () => {
  it("renders root with governed data-slot and tone", () => {
    render(
      <StatusIndicator data-testid="status-root" tone="success">
        Active
      </StatusIndicator>
    );

    const indicator = screen.getByTestId("status-root");

    expect(indicator).toHaveAttribute("data-slot", "status-indicator");
    expect(indicator).toHaveAttribute("data-component", "StatusIndicator");
    expect(indicator).toHaveAttribute("data-recipe", "status");
    expect(indicator).toHaveAttribute("data-tone", "success");
  });

  it("renders dot and label slots with ERP dot-plus-text pattern", () => {
    render(
      <StatusIndicator data-testid="status-root" tone="warning">
        Pending review
      </StatusIndicator>
    );

    const indicator = screen.getByTestId("status-root");
    const dot = indicator?.querySelector('[data-slot="status-indicator-dot"]');
    const label = indicator?.querySelector(
      '[data-slot="status-indicator-label"]'
    );

    expect(indicator).toBeTruthy();
    expect(dot).toBeTruthy();
    expect(dot).toHaveAttribute("aria-hidden", "true");
    expect(dot?.className).toContain("bg-warning");
    expect(label).toHaveTextContent("Pending review");
    expect(label?.className).toContain("tabular-nums");
    expect(indicator?.className).toContain("text-muted-foreground");
  });

  it("keeps governed data attributes authoritative on root", () => {
    render(
      <StatusIndicator
        data-component="Override"
        data-slot="override"
        data-testid="status-root"
        data-tone="danger"
        tone="success"
      >
        Synced
      </StatusIndicator>
    );

    const indicator = screen.getByTestId("status-root");

    expect(indicator).toHaveAttribute("data-slot", "status-indicator");
    expect(indicator).toHaveAttribute("data-component", "StatusIndicator");
    expect(indicator).toHaveAttribute("data-tone", "success");
  });

  it("maps every status tone to a governed dot slot key", () => {
    const tones = [
      "neutral",
      "info",
      "success",
      "warning",
      "danger",
      "critical",
      "pending",
      "forbidden",
      "invalid",
    ] as const;

    for (const tone of tones) {
      const { unmount } = render(
        <StatusIndicator data-testid={`status-${tone}`} tone={tone}>
          {tone}
        </StatusIndicator>
      );

      const indicator = screen.getByTestId(`status-${tone}`);
      const dot = indicator?.querySelector('[data-slot="status-indicator-dot"]');

      expect(dot).toBeTruthy();
      unmount();
    }
  });

  it("supports role=status when consumers need a live region", () => {
    render(
      <StatusIndicator aria-live="polite" role="status" tone="info">
        Syncing
      </StatusIndicator>
    );

    expect(screen.getByRole("status")).toHaveTextContent("Syncing");
  });
});
