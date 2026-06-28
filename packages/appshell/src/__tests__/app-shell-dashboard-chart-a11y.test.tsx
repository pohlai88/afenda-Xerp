import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShellDashboardSparklineStat } from "../presentation/blocks/app-shell-dashboard-sparkline-stat";
import { defaultAppShellDashboardSparklineMetrics } from "../presentation/data/app-shell.dashboard.data";

describe("AppShellDashboardSparklineStat accessibility", () => {
  it("exposes the chart as a labelled image", () => {
    const [metric] = defaultAppShellDashboardSparklineMetrics;
    if (metric === undefined) {
      throw new Error("Expected sparkline fixture.");
    }

    render(
      <AppShellDashboardSparklineStat
        comparisonLabel="vs last month"
        {...metric}
      />
    );

    expect(
      screen.getByRole("img", {
        name: /Revenue this month sparkline from/i,
      })
    ).toBeInTheDocument();
  });
});

describe("AppShellDashboardRevenueChart accessibility", () => {
  it("labels the primary revenue variance chart as an image", async () => {
    const { AppShellDashboardRevenueChart } = await import(
      "../presentation/blocks/app-shell-dashboard-revenue-chart"
    );
    const { buildRevenueBarChartLabel } = await import(
      "../presentation/blocks/app-shell-dashboard-revenue-chart"
    );
    const { defaultAppShellDashboardRevenueBars } = await import(
      "../presentation/data/app-shell.dashboard.data"
    );

    render(<AppShellDashboardRevenueChart />);

    expect(
      screen.getByRole("img", {
        name: buildRevenueBarChartLabel(defaultAppShellDashboardRevenueBars),
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Portfolio revenue mix by period" })
    ).toBeInTheDocument();
  });
});
