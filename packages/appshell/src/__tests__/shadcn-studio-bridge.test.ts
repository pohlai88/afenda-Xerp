import { describe, expect, it } from "vitest";

import {
  AppShellPresentationHeroSection01,
  AppShellPresentationLoginPage04,
  AppShellPresentationStatisticsCard01,
  computeStudioBlockParitySummary,
} from "../shadcn-studio-bridge/index.js";

describe("@afenda/appshell shadcn-studio bridge (B42d)", () => {
  it("re-exports live MCP presentation blocks from @afenda/shadcn-studio", () => {
    expect(typeof AppShellPresentationHeroSection01).toBe("function");
    expect(typeof AppShellPresentationLoginPage04).toBe("function");
    expect(typeof AppShellPresentationStatisticsCard01).toBe("function");
  });

  it("reports delete-blocked parity until legacy inventory is fully seeded", () => {
    const summary = computeStudioBlockParitySummary();
    expect(summary.deleteBlocked).toBe(true);
    expect(summary.legacyProductionBlockCount).toBe(63);
  });
});
