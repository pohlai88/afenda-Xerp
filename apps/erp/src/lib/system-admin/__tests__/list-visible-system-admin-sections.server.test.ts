import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
} from "../../modules/__tests__/module-route-test-fixtures";
import { filterVisibleSystemAdminSections } from "../list-visible-system-admin-sections.server";
import { SYSTEM_ADMIN_SECTIONS } from "../system-admin-sections";

const CORRELATION_ID = "corr-system-admin-nav-filter";

describe("filterVisibleSystemAdminSections (TIP-013 nav filtering)", () => {
  it("returns only sections granted by the permission data source", async () => {
    const visible = await filterVisibleSystemAdminSections({
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.users.read,
        PERMISSION_REGISTRY.systemAdmin.roles.manage,
      ]),
    });

    expect(visible.map((section) => section.sectionId)).toEqual([
      "users",
      "memberships",
      "roles",
    ]);
  });

  it("returns an empty list when no system admin permissions are granted", async () => {
    const visible = await filterVisibleSystemAdminSections({
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      permissionDataSource: createModuleRoutePermissionDataSource([]),
    });

    expect(visible).toEqual([]);
  });

  it("includes permissions when permissions.manage is granted", async () => {
    const visible = await filterVisibleSystemAdminSections({
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.permissions.manage,
      ]),
    });

    expect(visible.map((section) => section.sectionId)).toEqual([
      "permissions",
    ]);
    expect(visible.length).toBeLessThan(SYSTEM_ADMIN_SECTIONS.length);
  });

  it("includes audit when audit.read is granted", async () => {
    const visible = await filterVisibleSystemAdminSections({
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.audit.read,
      ]),
    });

    expect(visible.map((section) => section.sectionId)).toEqual(["audit"]);
  });

  it("includes settings when modules.manage is granted", async () => {
    const visible = await filterVisibleSystemAdminSections({
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.modules.manage,
      ]),
    });

    expect(visible.map((section) => section.sectionId)).toEqual(["settings"]);
  });
});
