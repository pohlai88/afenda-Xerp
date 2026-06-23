import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApplicationShellDashboardCanvas } from "../dashboard/app-shell-dashboard-canvas.client";
import { DEFAULT_DASHBOARD_LAYOUT } from "../dashboard/dashboard-layout.defaults";

describe("ApplicationShell dashboard canvas widget composition", () => {
  it("renders one grid cell per widget without nested metric row grids", () => {
    const { container } = render(<ApplicationShellDashboardCanvas editMode />);

    expect(
      container.querySelector(".app-shell-sparkline-grid")
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(".app-shell-kpi-grid")
    ).not.toBeInTheDocument();

    const widgetCells = container.querySelectorAll("[data-dashboard-widget]");
    expect(widgetCells.length).toBe(DEFAULT_DASHBOARD_LAYOUT.items.length);
  });

  it("exposes individual metric widget ids on grid cells", () => {
    const { container } = render(<ApplicationShellDashboardCanvas editMode />);

    expect(
      container.querySelector('[data-dashboard-widget="sparkline-revenue"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-dashboard-widget="kpi-net-income"]')
    ).toBeInTheDocument();
  });
});
