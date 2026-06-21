import { describe, expect, it } from "vitest";

import {
  buildRankedRegionalSalesRows,
  buildRegionalSalesSummary,
  computeRegionalShare,
  computeWeightedRegionalTrend,
} from "../shadcn-studio/blocks/app-shell-dashboard-regional-sales";
import type { AppShellDashboardRegionalSalesRow } from "../shadcn-studio/data/app-shell.dashboard.types";
import { asAppShellDashboardRowId } from "../shadcn-studio/data/app-shell.dashboard.types";

const sampleRows = [
  {
    id: asAppShellDashboardRowId("region-a"),
    region: "North America",
    amount: "$100,000",
    changeLabel: "+10%",
    trend: "up",
    flagSrc: "https://example.com/a.jpg",
    flagAlt: "North America",
  },
  {
    id: asAppShellDashboardRowId("region-b"),
    region: "EMEA",
    amount: "$50,000",
    changeLabel: "-2%",
    trend: "down",
    flagSrc: "https://example.com/b.jpg",
    flagAlt: "EMEA",
  },
  {
    id: asAppShellDashboardRowId("region-c"),
    region: "APAC",
    amount: "$25,000",
    changeLabel: "+4%",
    trend: "up",
    flagSrc: "https://example.com/c.jpg",
    flagAlt: "APAC",
  },
] as const satisfies readonly AppShellDashboardRegionalSalesRow[];

describe("regional sales view model", () => {
  it("computes revenue share percentages", () => {
    expect(computeRegionalShare("$100,000", 200_000)).toBe(50);
    expect(computeRegionalShare("$100,000", 0)).toBe(0);
  });

  it("ranks regions by revenue descending", () => {
    expect(buildRankedRegionalSalesRows(sampleRows).map((entry) => entry.row.region)).toEqual([
      "North America",
      "EMEA",
      "APAC",
    ]);
  });

  it("builds a weighted aggregate trend", () => {
    expect(computeWeightedRegionalTrend(sampleRows).trend).toBe("up");
  });

  it("summarizes top region and trend counts", () => {
    expect(buildRegionalSalesSummary(sampleRows)).toMatchObject({
      totalSales: 175_000,
      topRegion: { name: "North America", share: 57 },
      growingCount: 2,
      decliningCount: 1,
    });
  });
});
