import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  TrendIndicator,
  computeDashboardShare,
  computeWeightedDashboardTrend,
  formatDashboardCurrency,
  parseDashboardAmount,
} from "../shadcn-studio/blocks/app-shell-dashboard-breakdown.utils";

describe("app-shell-dashboard-breakdown.utils", () => {
  it("parses formatted dashboard currency amounts", () => {
    expect(parseDashboardAmount("$100,000")).toBe(100_000);
    expect(parseDashboardAmount("invalid")).toBe(0);
  });

  it("formats dashboard currency with whole-dollar USD semantics", () => {
    expect(formatDashboardCurrency(175_000)).toBe("$175,000");
  });

  it("computes revenue share percentages with zero-safe totals", () => {
    expect(computeDashboardShare("$100,000", 200_000)).toBe(50);
    expect(computeDashboardShare("$100,000", 0)).toBe(0);
  });

  it("computes a weighted aggregate trend label and direction", () => {
    expect(
      computeWeightedDashboardTrend([
        { amount: "$100,000", changeLabel: "+10%" },
        { amount: "$50,000", changeLabel: "-2%" },
      ])
    ).toMatchObject({
      trend: "up",
    });

    expect(
      computeWeightedDashboardTrend([{ amount: "$0", changeLabel: "+4%" }]).label
    ).toBe("0.0%");
  });

  it("renders an accessible trend indicator with semantic icon classes", () => {
    const { rerender } = render(<TrendIndicator trend="up" />);

    expect(document.querySelector(".app-shell-dashboard-trend-indicator")).not.toBeNull();
    expect(document.querySelector(".app-shell-dashboard-trend-icon-up")).not.toBeNull();
    expect(screen.getByText("Trending up", { selector: ".sr-only" })).toBeInTheDocument();

    rerender(<TrendIndicator trend="down" />);

    expect(document.querySelector(".app-shell-dashboard-trend-icon-down")).not.toBeNull();
    expect(screen.getByText("Trending down", { selector: ".sr-only" })).toBeInTheDocument();
  });
});
