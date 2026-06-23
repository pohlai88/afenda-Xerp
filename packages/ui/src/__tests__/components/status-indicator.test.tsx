import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { StatusIndicator } from "../../components/status-indicator";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

describe("StatusIndicator governance", () => {
  it("exposes displayName on StatusIndicator", () => {
    expect(StatusIndicator.displayName).toBe("StatusIndicator");
  });

  it("renders root with governed data-slot and tone", () => {
    render(
      <StatusIndicator data-testid="status-root" tone="success">
        Active
      </StatusIndicator>
    );

    const indicator = screen.getByTestId("status-root");

    expectGovernedPrimitive(indicator, {
      component: "StatusIndicator",
      slot: "status-indicator",
      recipe: "status",
      state: "ready",
    });
    expect(indicator).toHaveAttribute("data-tone", "success");
  });

  it("renders dot and label slots with ERP dot-plus-text pattern", () => {
    render(
      <StatusIndicator data-testid="status-root" tone="warning">
        Pending review
      </StatusIndicator>
    );

    const indicator = screen.getByTestId("status-root");
    const dot = indicator.querySelector('[data-slot="status-indicator-dot"]');
    const label = indicator.querySelector(
      '[data-slot="status-indicator-label"]'
    );

    expect(dot).toBeTruthy();
    expect(dot).toHaveAttribute("aria-hidden", "true");
    expect(dot?.className).toContain("bg-warning");
    expect(label).toHaveTextContent("Pending review");
    expect(label?.className).toContain("tabular-nums");
    expect(indicator.className).toContain("text-muted-foreground");
  });

  it("does not allow consumer props to override governed data attributes", () => {
    render(
      <StatusIndicator
        data-component="Override"
        data-recipe="override"
        data-slot="override"
        data-state="fake"
        data-testid="status-root"
        data-tone="danger"
        state="ready"
        tone="success"
      >
        Synced
      </StatusIndicator>
    );

    expectGovernedDataAuthority(screen.getByTestId("status-root"), {
      "data-component": "StatusIndicator",
      "data-recipe": "status",
      "data-slot": "status-indicator",
      "data-state": "ready",
      "data-tone": "success",
    });
  });

  it("forwards ref to the status indicator root", () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <StatusIndicator ref={ref} tone="neutral">
        Draft
      </StatusIndicator>
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveAttribute("data-slot", "status-indicator");
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
      const dot = indicator.querySelector('[data-slot="status-indicator-dot"]');

      expect(dot).toBeTruthy();
      expectGovernedPrimitive(dot as HTMLElement, {
        component: "StatusIndicator",
        slot: "status-indicator-dot",
        recipe: "status",
      });
      unmount();
    }
  });

  it("keeps governed data attributes authoritative on label slot", () => {
    render(
      <StatusIndicator data-testid="status-root" tone="info">
        In progress
      </StatusIndicator>
    );

    const label = screen
      .getByTestId("status-root")
      .querySelector('[data-slot="status-indicator-label"]');

    expect(label).toBeTruthy();
    expectGovernedDataAuthority(label as HTMLElement, {
      "data-component": "StatusIndicator",
      "data-recipe": "status",
      "data-slot": "status-indicator-label",
    });
  });

  it("supports role=status when consumers need a live region", () => {
    render(
      <StatusIndicator aria-live="polite" role="status" tone="info">
        Syncing
      </StatusIndicator>
    );

    expect(screen.getByRole("status")).toHaveTextContent("Syncing");
  });

  it("reflects governed loading state on root", () => {
    render(
      <StatusIndicator data-testid="status-root" state="loading" tone="pending">
        Awaiting approval
      </StatusIndicator>
    );

    expect(screen.getByTestId("status-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });
});
