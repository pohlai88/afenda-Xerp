import { DEFAULT_DASHBOARD_LAYOUT } from "@afenda/appshell";
import { describe, expect, it } from "vitest";

import {
  clearWorkspaceDashboardLayoutStoreForTests,
  getWorkspaceDashboardLayout,
  resetWorkspaceDashboardLayout,
  saveWorkspaceDashboardLayout,
} from "@/server/workspace/dashboard-layout.service";

const TENANT_A = "tenant-a";
const TENANT_B = "tenant-b";

describe("workspace dashboard layout service", () => {
  it("returns default layout for unknown users", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const result = await getWorkspaceDashboardLayout(TENANT_A, "user-default");

    expect(result.source).toBe("default");
    expect(result.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);
    expect(result.updatedAt).toBeNull();
  });

  it("rejects layouts below widget minimum size", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    await expect(
      saveWorkspaceDashboardLayout(TENANT_A, "user-invalid", {
        ...DEFAULT_DASHBOARD_LAYOUT,
        items: [
          {
            i: "kpi-net-income",
            x: 0,
            y: 0,
            w: 1,
            h: 1,
          },
        ],
      })
    ).rejects.toThrow("below minimum size");
  });

  it("persists and resets stored layouts per tenant and user", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const saved = await saveWorkspaceDashboardLayout(
      TENANT_A,
      "user-a",
      DEFAULT_DASHBOARD_LAYOUT
    );

    expect(saved.source).toBe("stored");
    expect(saved.updatedAt).not.toBeNull();

    const loaded = await getWorkspaceDashboardLayout(TENANT_A, "user-a");
    expect(loaded.source).toBe("stored");

    await resetWorkspaceDashboardLayout(TENANT_A, "user-a");
    const reset = await getWorkspaceDashboardLayout(TENANT_A, "user-a");
    expect(reset.source).toBe("default");
  });

  it("isolates layouts by tenant for the same user id", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const tenantItem = DEFAULT_DASHBOARD_LAYOUT.items[0];
    const otherTenantItem = DEFAULT_DASHBOARD_LAYOUT.items[1];

    if (tenantItem === undefined || otherTenantItem === undefined) {
      throw new Error("Expected default dashboard layout items.");
    }

    await saveWorkspaceDashboardLayout(TENANT_A, "user-shared", {
      ...DEFAULT_DASHBOARD_LAYOUT,
      items: [{ ...tenantItem, h: 2 }],
    });
    await saveWorkspaceDashboardLayout(TENANT_B, "user-shared", {
      ...DEFAULT_DASHBOARD_LAYOUT,
      items: [{ ...otherTenantItem, h: 4 }],
    });

    const tenantLayout = await getWorkspaceDashboardLayout(
      TENANT_A,
      "user-shared"
    );
    const otherTenantLayout = await getWorkspaceDashboardLayout(
      TENANT_B,
      "user-shared"
    );

    expect(tenantLayout.layout.items[0]?.h).toBe(2);
    expect(otherTenantLayout.layout.items[0]?.h).toBe(4);
  });
});
