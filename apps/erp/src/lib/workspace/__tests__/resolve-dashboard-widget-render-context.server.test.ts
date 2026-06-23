import {
  DEMO_DASHBOARD_WIDGET_CAPABILITIES,
  DEMO_DASHBOARD_WIDGET_PERMISSIONS,
} from "@afenda/appshell";
import { PERMISSION_REGISTRY, type PermissionKey } from "@afenda/permissions";
import { describe, expect, it } from "vitest";
import {
  resolveDashboardWidgetRenderContextFromOperatingContext,
  resolveWorkspaceDashboardCapabilitiesFromOperatingContext,
} from "../resolve-dashboard-widget-render-context.server";
import {
  createDashboardRbacOperatingContextFixture,
  seedDashboardRbacAuthorizationStore,
} from "./dashboard-rbac.fixture";

describe("resolveDashboardWidgetRenderContextFromOperatingContext", () => {
  it("grants finance permissions and dashboard capabilities from role grants", async () => {
    const dataSource = seedDashboardRbacAuthorizationStore([
      PERMISSION_REGISTRY.finance.invoices.read,
      PERMISSION_REGISTRY.finance.cards.read,
      PERMISSION_REGISTRY.finance.transactions.read,
      PERMISSION_REGISTRY.dashboard.moduleEarnings,
      PERMISSION_REGISTRY.dashboard.regionalSales,
    ] satisfies readonly PermissionKey[]);

    const context =
      await resolveDashboardWidgetRenderContextFromOperatingContext(
        createDashboardRbacOperatingContextFixture(),
        dataSource
      );

    expect(context.permissions).toEqual([...DEMO_DASHBOARD_WIDGET_PERMISSIONS]);
    expect(context.capabilities).toEqual([
      ...DEMO_DASHBOARD_WIDGET_CAPABILITIES,
    ]);
  });

  it("returns empty grants when role permissions are missing", async () => {
    const dataSource = seedDashboardRbacAuthorizationStore([]);

    const context =
      await resolveDashboardWidgetRenderContextFromOperatingContext(
        createDashboardRbacOperatingContextFixture(),
        dataSource
      );

    expect(context.permissions).toEqual([]);
    expect(context.capabilities).toEqual([]);
    expect(context.featureFlags).toEqual([]);
  });
});

describe("resolveWorkspaceDashboardCapabilitiesFromOperatingContext", () => {
  it("grants layout edit when workspace.dashboard_write is present", async () => {
    const dataSource = seedDashboardRbacAuthorizationStore([
      PERMISSION_REGISTRY.workspace.dashboard.write,
    ] satisfies readonly PermissionKey[]);

    const capabilities =
      await resolveWorkspaceDashboardCapabilitiesFromOperatingContext(
        createDashboardRbacOperatingContextFixture(),
        dataSource
      );

    expect(capabilities).toEqual({ canEditLayout: true });
  });

  it("denies layout edit when workspace.dashboard_write is missing", async () => {
    const dataSource = seedDashboardRbacAuthorizationStore([]);

    const capabilities =
      await resolveWorkspaceDashboardCapabilitiesFromOperatingContext(
        createDashboardRbacOperatingContextFixture(),
        dataSource
      );

    expect(capabilities).toEqual({ canEditLayout: false });
  });
});
