import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import { guardModuleRoute } from "../guard-module-route.server";
import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
} from "./module-route-test-fixtures";

const CORRELATION_ID = "corr-module-guard";

describe("guardModuleRoute", () => {
  it("allows HRM when RBAC permission is granted", async () => {
    const result = await guardModuleRoute({
      moduleId: "hrm",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([
        PERMISSION_REGISTRY.hr.employee.read,
      ]),
    });

    expect(result.kind).toBe("allowed");
    if (result.kind === "allowed") {
      expect(result.route.moduleId).toBe("hrm");
      expect(result.route.path).toBe("/modules/hrm");
    }
  });

  it("returns forbidden when RBAC permission is missing", async () => {
    const result = await guardModuleRoute({
      moduleId: "hrm",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([]),
    });

    expect(result).toEqual({
      kind: "forbidden",
      moduleId: "hrm",
      permissionKey: "hr.employee_read",
    });
  });

  it("returns not_found for unknown module ids", async () => {
    const result = await guardModuleRoute({
      moduleId: "unknown-module",
      operatingContext: createModuleRouteOperatingContext({
        correlationId: CORRELATION_ID,
      }),
      correlationId: CORRELATION_ID,
      permissionDataSource: createModuleRoutePermissionDataSource([]),
    });

    expect(result).toEqual({
      kind: "not_found",
      moduleId: "unknown-module",
    });
  });
});
