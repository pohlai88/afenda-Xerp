import { describe, expect, it } from "vitest";

import {
  buildSparklineSeriesSummary,
  formatSparklineCurrency,
  formatSparklineDateLabel,
} from "../shadcn-studio/blocks/app-shell-dashboard-sparkline-stat";

describe("sparkline view model", () => {
  it("formats currency and dates for tooltips", () => {
    expect(formatSparklineCurrency(248_720)).toBe("$248,720");
    expect(formatSparklineDateLabel("2026-05-29")).toBe("May 29");
  });

  it("summarizes peak and latest points", () => {
    expect(
      buildSparklineSeriesSummary([
        { date: "2026-05-24", value: 190 },
        { date: "2026-05-29", value: 550 },
        { date: "2026-05-31", value: 300 },
      ])
    ).toMatchObject({
      pointCount: 3,
      peakValue: 550,
      peakDate: "2026-05-29",
      latestValue: 300,
      latestDate: "2026-05-31",
      windowDelta: 110,
    });
  });

  it("returns null for empty series", () => {
    expect(buildSparklineSeriesSummary([])).toBeNull();
  });
});
