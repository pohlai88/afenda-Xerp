import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AppShellDashboardModuleEarnings,
  buildModuleEarningsSummary,
  buildRankedModuleEarningRows,
  computeTotalModuleEarnings,
} from "../shadcn-studio/blocks/app-shell-dashboard-module-earnings";
import { defaultAppShellDashboardModuleEarnings } from "../shadcn-studio/data/app-shell.dashboard.data";

describe("AppShellDashboardModuleEarnings", () => {
  it("ranks modules by revenue amount descending", () => {
    const rankedRows = buildRankedModuleEarningRows(defaultAppShellDashboardModuleEarnings);

    expect(rankedRows[0]?.row.module).toBe("Finance");
    expect(rankedRows[0]?.rank).toBe(1);
    expect(rankedRows.at(-1)?.row.module).toBe("Inventory");
  });

  it("builds summary with total override and mix insights", () => {
    const summary = buildModuleEarningsSummary(defaultAppShellDashboardModuleEarnings, 200_000);

    expect(summary.totalRevenue).toBe(200_000);
    expect(summary.topModule).toEqual({ name: "Finance", share: expect.any(Number) });
    expect(summary.decliningCount).toBe(1);
    expect(summary.growingCount).toBe(2);
  });

  it("computes total module earnings from formatted amounts", () => {
    expect(computeTotalModuleEarnings(defaultAppShellDashboardModuleEarnings)).toBe(188_640);
  });

  it("renders article landmark, ranked list, and leading row accent", () => {
    const { container } = render(<AppShellDashboardModuleEarnings />);

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("Module revenue")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(
      container.querySelector(".app-shell-dashboard-breakdown-row-leading")
    ).not.toBeNull();
    expect(
      screen.getByText("Module revenue breakdown ranked by amount", { selector: ".sr-only" })
    ).toBeInTheDocument();
  });

  it("renders governed empty status copy", () => {
    render(<AppShellDashboardModuleEarnings rows={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent(/No module revenue yet/i);
  });
});
