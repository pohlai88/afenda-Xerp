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

import { guardModuleRoute } from "../guard-module-route.server";
import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
  MODULE_ROUTE_TEST_ACTOR_ID,
} from "./module-route-test-fixtures";

const CORRELATION_ID = "corr-module-guard-audit";

describe("guardModuleRoute audit evidence (TIP-007A acceptance)", () => {
  beforeEach(() => {
    auditMocks.recordErpAuditEvent.mockClear();
    auditMocks.loggerWarn.mockClear();
  });

  it("records audit denial with actor and correlation ID when RBAC forbids HRM", async () => {
    const result = await guardModuleRoute({
      moduleId: "hrm",
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
        action: "module.route.access_denied",
        actorUserId: MODULE_ROUTE_TEST_ACTOR_ID,
        correlationId: CORRELATION_ID,
        result: "denied",
        targetId: "hrm",
        targetType: "erp_module_route",
        fallbackMetadata: {
          permissionKey: "hr.employee_read",
        },
      })
    );
    expect(auditMocks.loggerWarn).toHaveBeenCalledWith(
      "module.route.denied",
      expect.objectContaining({
        actorId: MODULE_ROUTE_TEST_ACTOR_ID,
        moduleId: "hrm",
        permissionKey: "hr.employee_read",
      })
    );
  });
});
