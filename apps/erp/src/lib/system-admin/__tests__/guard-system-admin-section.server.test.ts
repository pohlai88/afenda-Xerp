import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auditMocks = vi.hoisted(() => ({
  recordErpAuditEvent: vi
    .fn<() => Promise<void>>()
    .mockResolvedValue(undefined),
  loggerWarn: vi.fn(),
}));

vi.mock("@/lib/observability/record-erp-audit-event", () => ({
  recordErpAuditEvent: auditMocks.recordErpAuditEvent,
}));

vi.mock("@/lib/observability/create-erp-logger", () => ({
  createErpLogger: () => ({
    warn: auditMocks.loggerWarn,
  }),
}));

import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
  MODULE_ROUTE_TEST_ACTOR_ID,
} from "../../modules/__tests__/module-route-test-fixtures";
import { guardSystemAdminSection } from "../guard-system-admin-section.server";

const CORRELATION_ID = "corr-system-admin-guard-audit";

describe("guardSystemAdminSection audit evidence (Foundation phase 13 Slice 1)", () => {
  beforeEach(() => {
    auditMocks.recordErpAuditEvent.mockClear();
    auditMocks.loggerWarn.mockClear();
  });

  it("allows access when users.read permission is granted", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "users",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.users.read,
      ]),
    });

    expect(result.kind).toBe("allowed");
    if (result.kind === "allowed") {
      expect(result.section.sectionId).toBe("users");
    }
    expect(auditMocks.recordErpAuditEvent).not.toHaveBeenCalled();
  });

  it("allows audit when audit.read permission is granted (Slice 3 gate)", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "audit",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.audit.read,
      ]),
    });

    expect(result.kind).toBe("allowed");
    if (result.kind === "allowed") {
      expect(result.section.sectionId).toBe("audit");
      expect(result.section.readPermissionKey).toBe(
        PERMISSION_REGISTRY.systemAdmin.audit.read
      );
    }
  });

  it("forbids audit when audit.read permission is missing", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "audit",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.users.read,
      ]),
    });

    expect(result.kind).toBe("forbidden");
    if (result.kind === "forbidden") {
      expect(result.permissionKey).toBe(
        PERMISSION_REGISTRY.systemAdmin.audit.read
      );
    }
  });

  it("allows settings when modules.manage permission is granted", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "settings",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.modules.manage,
      ]),
    });

    expect(result.kind).toBe("allowed");
    if (result.kind === "allowed") {
      expect(result.section.sectionId).toBe("settings");
      expect(result.section.readPermissionKey).toBe(
        PERMISSION_REGISTRY.systemAdmin.modules.manage
      );
    }
  });

  it("forbids settings when modules.manage permission is missing", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "settings",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.users.read,
      ]),
    });

    expect(result.kind).toBe("forbidden");
    if (result.kind === "forbidden") {
      expect(result.permissionKey).toBe(
        PERMISSION_REGISTRY.systemAdmin.modules.manage
      );
    }
  });

  it("returns not_found for unknown sections", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "unknown-section" as "users",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.users.read,
      ]),
    });

    expect(result).toEqual({
      kind: "not_found",
      sectionId: "unknown-section",
    });
  });

  it("records audit denial with actor and correlation ID when RBAC forbids users", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "users",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([]),
    });

    expect(result.kind).toBe("forbidden");
    expect(auditMocks.recordErpAuditEvent).toHaveBeenCalledTimes(1);
    expect(auditMocks.recordErpAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "system_admin.section.access_denied",
        actorUserId: MODULE_ROUTE_TEST_ACTOR_ID,
        correlationId: CORRELATION_ID,
        result: "denied",
        targetId: "users",
        targetType: "system_admin_section",
        fallbackMetadata: {
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.read,
        },
      })
    );
    expect(auditMocks.loggerWarn).toHaveBeenCalledWith(
      "system_admin.section.denied",
      expect.objectContaining({
        actorId: MODULE_ROUTE_TEST_ACTOR_ID,
        permissionKey: PERMISSION_REGISTRY.systemAdmin.users.read,
        sectionId: "users",
      })
    );
  });

  it("allows memberships when users.read permission is granted", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "memberships",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.users.read,
      ]),
    });

    expect(result.kind).toBe("allowed");
    if (result.kind === "allowed") {
      expect(result.section.sectionId).toBe("memberships");
      expect(result.section.readPermissionKey).toBe(
        PERMISSION_REGISTRY.systemAdmin.users.read
      );
    }
  });

  it("allows roles when roles.manage permission is granted", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "roles",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.roles.manage,
      ]),
    });

    expect(result.kind).toBe("allowed");
    if (result.kind === "allowed") {
      expect(result.section.sectionId).toBe("roles");
      expect(result.section.readPermissionKey).toBe(
        PERMISSION_REGISTRY.systemAdmin.roles.manage
      );
    }
  });

  it("allows permissions when permissions.manage permission is granted", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "permissions",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.permissions.manage,
      ]),
    });

    expect(result.kind).toBe("allowed");
    if (result.kind === "allowed") {
      expect(result.section.sectionId).toBe("permissions");
      expect(result.section.readPermissionKey).toBe(
        PERMISSION_REGISTRY.systemAdmin.permissions.manage
      );
    }
  });

  it("forbids roles when roles.manage permission is missing", async () => {
    const result = await guardSystemAdminSection({
      sectionId: "roles",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.systemAdmin.users.read,
      ]),
    });

    expect(result.kind).toBe("forbidden");
    if (result.kind === "forbidden") {
      expect(result.permissionKey).toBe(
        PERMISSION_REGISTRY.systemAdmin.roles.manage
      );
    }
  });
});
