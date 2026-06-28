import { describe, expect, it } from "vitest";

import {
  AppShellPresentationAccountSettings01,
  AppShellPresentationActivityDialog,
  AppShellPresentationAuthErrorPage02,
  AppShellPresentationHeroSection01,
  AppShellPresentationLoginPage04,
  AppShellPresentationMenuTrigger,
  AppShellPresentationSearchDialog,
  AppShellPresentationSidebarUserDropdown,
  AppShellPresentationStatisticsCard01,
  AppShellPresentationStatisticsTrendCard,
  computeStudioBlockParitySummary,
} from "../shadcn-studio-bridge/index.js";

describe("@afenda/appshell shadcn-studio bridge (B42d + B42f + B42g)", () => {
  it("re-exports live MCP presentation blocks from @afenda/shadcn-studio", () => {
    expect(typeof AppShellPresentationHeroSection01).toBe("function");
    expect(typeof AppShellPresentationLoginPage04).toBe("function");
    expect(typeof AppShellPresentationStatisticsCard01).toBe("function");
    expect(typeof AppShellPresentationAccountSettings01).toBe("function");
    expect(typeof AppShellPresentationStatisticsTrendCard).toBe("function");
    expect(typeof AppShellPresentationAuthErrorPage02).toBe("function");
    expect(typeof AppShellPresentationMenuTrigger).toBe("function");
    expect(typeof AppShellPresentationSidebarUserDropdown).toBe("function");
    expect(typeof AppShellPresentationSearchDialog).toBe("function");
    expect(typeof AppShellPresentationActivityDialog).toBe("function");
  });

  it("reports full parity and unblocks legacy delete gate", () => {
    const summary = computeStudioBlockParitySummary();
    expect(summary.deleteBlocked).toBe(false);
    expect(summary.legacyProductionBlockCount).toBe(63);
    expect(summary.parityPercent).toBeGreaterThanOrEqual(100);
  });
});
