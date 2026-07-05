import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LabRouteLoadingState } from "../_components/lab-route-loading-state";

describe("LabRouteLoadingState", () => {
  it("exposes a labeled busy status for route loading", () => {
    const { container } = render(
      <LabRouteLoadingState
        description="Preparing promotion-ready route composition."
        eyebrow="Loading route"
        title="Sales dashboard is loading"
        titleId="sales-loading-title"
      >
        <div>Loading panels</div>
      </LabRouteLoadingState>
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-busy", "true");
    expect(section).toHaveAttribute("aria-live", "polite");
    expect(section).toHaveAttribute("aria-labelledby", "sales-loading-title");
    expect(screen.getByRole("status")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Sales dashboard is loading",
      })
    ).toBeVisible();
    expect(
      screen.getByText(
        "Route composition is loading without ERP runtime authority."
      )
    ).toHaveClass("sr-only");
  });
});
