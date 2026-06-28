import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  computeStudioBlockParitySummary,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
} from "../registry/studio-block-parity.registry.js";

const REPO_ROOT = join(import.meta.dirname, "../../../..");

describe("studio block parity wrapper coverage (B42o)", () => {
  it("has zero parity rows missing wrapperPath", () => {
    const missing = SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.filter(
      (entry) => entry.wrapperPath === undefined
    );

    expect(missing).toEqual([]);
    expect(missing.length).toBe(0);
  });

  it("maps every wrapperPath to an on-disk file under the repo root", () => {
    for (const entry of SHADCN_STUDIO_BLOCK_PARITY_REGISTRY) {
      expect(entry.wrapperPath, entry.legacyPath).toBeDefined();
      expect(existsSync(join(REPO_ROOT, entry.wrapperPath as string))).toBe(
        true
      );
    }
  });

  it("promotes dashboard bridge-backed rows to bridge-exported with wrappers", () => {
    const dashboardBridgeExports = [
      "AppShellDashboardRevenueChart",
      "AppShellDashboardStatisticsExpenseCard",
      "AppShellDashboardInvoiceTable",
      "AppShellDashboardModuleEarnings",
      "AppShellDashboardRecentTransactions",
      "AppShellDashboardPaymentHistory",
      "AppShellDashboardStatisticsMetrics",
      "AppShellDashboardStatisticsIncomeCard",
      "AppShellDashboardStatisticsLineTrends",
      "AppShellDashboardRegionalSales",
    ] as const;

    for (const exportName of dashboardBridgeExports) {
      const entry = SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.find(
        (row) => row.legacyAppshellExport === exportName
      );
      expect(entry?.status).toBe("bridge-exported");
      expect(entry?.wrapperPath).toContain(
        "packages/appshell/src/presentation/wrappers/dashboard/"
      );
    }
  });

  it("exposes serializable parity summary after B42o closure", () => {
    const summary = computeStudioBlockParitySummary();
    expect(summary.deleteBlocked).toBe(false);
    expect(() => JSON.stringify(summary)).not.toThrow();
  });
});
