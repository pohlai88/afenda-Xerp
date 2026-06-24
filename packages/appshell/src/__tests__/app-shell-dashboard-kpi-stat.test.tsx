import { render, screen } from "@testing-library/react";
import { BriefcaseIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import {
  AppShellDashboardKpiStat,
  formatChangePercentage,
} from "../shadcn-studio/blocks/app-shell-dashboard-kpi-stat";
import { asAppShellDashboardRowId } from "../shadcn-studio/data/app-shell.dashboard.types";

describe("AppShellDashboardKpiStat", () => {
  it("formats positive, zero, and negative change percentages", () => {
    expect(formatChangePercentage(12.4)).toBe("+12.4%");
    expect(formatChangePercentage(0)).toBe("0%");
    expect(formatChangePercentage(-4.5)).toBe("-4.5%");
  });

  it("links metric value to footnote via aria-describedby", () => {
    render(
      <AppShellDashboardKpiStat
        badge="This week"
        changePercentage={-4.5}
        comparisonLabel="vs last week"
        Icon={BriefcaseIcon}
        id={asAppShellDashboardRowId("kpi-open-tasks")}
        title="Open tasks"
        value="38"
      />
    );

    const metric = screen.getByText("38").closest("p");
    const footnote = screen.getByText("-4.5%").closest("p");

    expect(metric).toHaveAttribute("aria-describedby");
    expect(footnote?.id).toBe(metric?.getAttribute("aria-describedby"));
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });

  it("applies primary emphasis data attribute", () => {
    const { container } = render(
      <AppShellDashboardKpiStat
        badge="Q2 FY2026"
        changePercentage={12.4}
        comparisonLabel="vs last quarter"
        emphasis="primary"
        Icon={BriefcaseIcon}
        id={asAppShellDashboardRowId("kpi-net-income")}
        title="Net income"
        value="$159,380"
      />
    );

    expect(
      container.querySelector(
        '.app-shell-studio-metric-card[data-emphasis="primary"]'
      )
    ).not.toBeNull();
  });
});
