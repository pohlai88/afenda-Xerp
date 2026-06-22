import { DEFAULT_DASHBOARD_LAYOUT } from "@afenda/appshell";
import { describe, expect, it } from "vitest";

import {
  clearWorkspaceDashboardLayoutStoreForTests,
  getWorkspaceDashboardLayout,
  resetWorkspaceDashboardLayout,
  saveWorkspaceDashboardLayout,
} from "@/server/workspace/dashboard-layout.service";

describe("workspace dashboard layout service", () => {
  it("returns default layout for unknown users", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const result = await getWorkspaceDashboardLayout("user-default");

    expect(result.source).toBe("default");
    expect(result.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);
    expect(result.updatedAt).toBeNull();
  });

  it("rejects layouts below widget minimum size", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    await expect(
      saveWorkspaceDashboardLayout("user-invalid", {
        ...DEFAULT_DASHBOARD_LAYOUT,
        items: [
          {
            i: "kpi-stats",
            x: 0,
            y: 0,
            w: 1,
            h: 1,
          },
        ],
      })
    ).rejects.toThrow("below minimum size");
  });

  it("persists and resets stored layouts per user", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const saved = await saveWorkspaceDashboardLayout(
      "user-a",
      DEFAULT_DASHBOARD_LAYOUT
    );

    expect(saved.source).toBe("stored");
    expect(saved.updatedAt).not.toBeNull();

    const loaded = await getWorkspaceDashboardLayout("user-a");
    expect(loaded.source).toBe("stored");

    await resetWorkspaceDashboardLayout("user-a");
    const reset = await getWorkspaceDashboardLayout("user-a");
    expect(reset.source).toBe("default");
  });
});
