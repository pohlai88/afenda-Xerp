import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import { resolveManifestNavigationFromOperatingContext } from "../resolve-manifest-navigation.server";
import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
} from "./module-route-test-fixtures";

describe("resolveManifestNavigationFromOperatingContext (Foundation phase 07 acceptance)", () => {
  it("includes HRM when RBAC grants module access", async () => {
    const navigation = await resolveManifestNavigationFromOperatingContext(
      createModuleRouteOperatingContext(),
      createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.hr.employee.read,
      ])
    );

    expect(navigation.some((item) => item.label === "HRM")).toBe(true);
  });

  it("hides HRM when RBAC permission is missing", async () => {
    const navigation = await resolveManifestNavigationFromOperatingContext(
      createModuleRouteOperatingContext(),
      createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.workspace.dashboard.read,
      ])
    );

    expect(navigation.some((item) => item.label === "HRM")).toBe(false);
  });

  it("marks HRM active when activeRoutePath matches the manifest module route", async () => {
    const navigation = await resolveManifestNavigationFromOperatingContext(
      createModuleRouteOperatingContext(),
      createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.hr.employee.read,
        PERMISSION_REGISTRY.workspace.dashboard.read,
      ]),
      "/modules/hrm"
    );

    const hrmItem = navigation.find((item) => item.label === "HRM");
    const workspaceItem = navigation.find((item) => item.label === "Workspace");

    expect(hrmItem).toMatchObject({ active: true, href: "/modules/hrm" });
    expect(workspaceItem).not.toMatchObject({ active: true });
  });
});
