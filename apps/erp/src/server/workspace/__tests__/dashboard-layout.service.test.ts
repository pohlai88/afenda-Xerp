import { describe, expect, it } from "vitest";

import { DASHBOARD_DEFAULT_LAYOUT_PRESET } from "@/lib/workspace/dashboard-default-layout.preset";

import {
  clearWorkspaceDashboardLayoutStoreForTests,
  getWorkspaceDashboardLayout,
  resetWorkspaceDashboardLayout,
  saveWorkspaceDashboardLayout,
} from "@/server/workspace/dashboard-layout.service";

const DEFAULT_LAYOUT = DASHBOARD_DEFAULT_LAYOUT_PRESET;

const TENANT_A = "tenant-a";
const TENANT_B = "tenant-b";

describe("workspace dashboard layout service", () => {
  it("returns default layout for unknown users", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const result = await getWorkspaceDashboardLayout(TENANT_A, "user-default");

    expect(result.source).toBe("default");
    expect(result.layout).toEqual(DEFAULT_LAYOUT);
    expect(result.updatedAt).toBeNull();
  });

  it("persists and reads stored layouts per tenant and user", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const layout = {
      ...DEFAULT_LAYOUT,
      items: [
        {
          i: "kpi-net-income" as const,
          x: 0,
          y: 0,
          w: 4,
          h: 2,
        },
      ],
    };

    await saveWorkspaceDashboardLayout(TENANT_A, "user-a", layout);
    const result = await getWorkspaceDashboardLayout(TENANT_A, "user-a");

    expect(result.source).toBe("stored");
    expect(result.layout).toEqual(layout);
    expect(result.updatedAt).not.toBeNull();
  });

  it("isolates layouts by tenant and user", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    await saveWorkspaceDashboardLayout(TENANT_A, "user-a", DEFAULT_LAYOUT);
    await saveWorkspaceDashboardLayout(TENANT_B, "user-b", {
      ...DEFAULT_LAYOUT,
      rowHeight: 96,
    });

    const tenantA = await getWorkspaceDashboardLayout(TENANT_A, "user-a");
    const tenantB = await getWorkspaceDashboardLayout(TENANT_B, "user-b");

    expect(tenantA.layout.rowHeight).toBe(80);
    expect(tenantB.layout.rowHeight).toBe(96);
  });

  it("resets stored layouts", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    await saveWorkspaceDashboardLayout(TENANT_A, "user-a", DEFAULT_LAYOUT);
    await resetWorkspaceDashboardLayout(TENANT_A, "user-a");

    const result = await getWorkspaceDashboardLayout(TENANT_A, "user-a");
    expect(result.source).toBe("default");
  });
});
