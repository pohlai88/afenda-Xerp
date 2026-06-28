import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { PRESENTATION_MCP_WRAPPER_REGISTRY } from "../presentation/wrappers/presentation-mcp-wrapper.registry";

const REPO_ROOT = join(import.meta.dirname, "../../../..");

const B42M_WRAPPER_PATHS = [
  "packages/appshell/src/presentation/wrappers/marketing/hero-section-01.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/auth/login-page-04.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/auth/error-page-02.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/dashboard/chart-earning-report.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/statistics/orders-progress-card.wrapper.tsx",
  "packages/appshell/src/presentation/wrappers/statistics/sales-overview-card.wrapper.tsx",
] as const;

describe("presentation MCP wrapper registry (B42m)", () => {
  it("maps B42m entries to on-disk wrapper files (not bridge index placeholders)", () => {
    for (const relativePath of B42M_WRAPPER_PATHS) {
      expect(existsSync(join(REPO_ROOT, relativePath))).toBe(true);
    }

    for (const entry of PRESENTATION_MCP_WRAPPER_REGISTRY) {
      expect(entry.wrapperPath).not.toContain("shadcn-studio-bridge/index.ts");
    }
  });

  it("tracks B42m strangler status for marketing, chart, and statistics bridge twins", () => {
    const hero = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
      (entry) => entry.publicExportName === "AppShellPresentationHeroSection01"
    );
    const chart = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
      (entry) =>
        entry.publicExportName === "AppShellPresentationChartEarningReport"
    );
    const orders = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
      (entry) =>
        entry.publicExportName ===
        "AppShellPresentationStatisticsOrdersProgressCard"
    );
    const sales = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
      (entry) =>
        entry.publicExportName ===
        "AppShellPresentationStatisticsSalesOverviewCard"
    );
    const login = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
      (entry) => entry.publicExportName === "AppShellAuthLoginPage04"
    );
    const error = PRESENTATION_MCP_WRAPPER_REGISTRY.find(
      (entry) => entry.publicExportName === "AppShellAuthErrorPage02"
    );

    expect(hero?.status).toBe("delegating");
    expect(chart?.status).toBe("delegating");
    expect(orders?.status).toBe("delegating");
    expect(sales?.status).toBe("delegating");
    expect(login?.status).toBe("afenda-only");
    expect(error?.status).toBe("afenda-only");
  });
});
