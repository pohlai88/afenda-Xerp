import type { PermissionKey } from "@afenda/database";
import { brandUserId, createExecutionContext, ok } from "@afenda/kernel";
import { PERMISSION_REGISTRY } from "@afenda/permissions";

import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import type { ResolveOperatingContextInput } from "@/lib/context/resolve-operating-context.server";
import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
  MODULE_ROUTE_TEST_ACTOR_ID,
  MODULE_ROUTE_TEST_COMPANY_ID,
  MODULE_ROUTE_TEST_ROLE_ID,
  MODULE_ROUTE_TEST_TENANT_ID,
} from "@/lib/modules/__tests__/module-route-test-fixtures";

export const SYSTEM_ADMIN_API_COMPANY_B_ID = "company-b";
export const SYSTEM_ADMIN_API_CORRELATION_ID = "corr-system-admin-api";
export const SYSTEM_ADMIN_API_MEMBERSHIP_B_ID = "membership-company-b";

export function createSystemAdminApiOperatingContext() {
  return createModuleRouteOperatingContext({
    correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
  });
}

export function createSystemAdminApiExecutionContext() {
  return createExecutionContext({
    actorId: MODULE_ROUTE_TEST_ACTOR_ID,
    companyId: MODULE_ROUTE_TEST_COMPANY_ID,
    correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
    source: "api",
    tenantId: MODULE_ROUTE_TEST_TENANT_ID,
  });
}

export function createSystemAdminApiPermissionDataSource(
  permissions: readonly PermissionKey[]
) {
  return createModuleRoutePermissionDataSource(permissions);
}

export function createSystemAdminApiRequest(
  path: string,
  method: "GET" | "POST"
): Request {
  return new Request(`http://localhost${path}`, {
    headers: {
      [TENANT_SLUG_HEADER]: "acme",
    },
    method,
  });
}

export function createSystemAdminApiOperatingContextResolver() {
  return async (_input: ResolveOperatingContextInput) =>
    ok(createSystemAdminApiOperatingContext());
}

export const SYSTEM_ADMIN_INVITE_PERMISSIONS = [
  PERMISSION_REGISTRY.systemAdmin.users.manage,
] as const satisfies readonly PermissionKey[];

export const SYSTEM_ADMIN_ROLE_PERMISSIONS = [
  PERMISSION_REGISTRY.systemAdmin.roles.manage,
] as const satisfies readonly PermissionKey[];

export const SYSTEM_ADMIN_AUDIT_PERMISSIONS = [
  PERMISSION_REGISTRY.systemAdmin.audit.read,
] as const satisfies readonly PermissionKey[];

export const SYSTEM_ADMIN_API_ACTOR_USER_ID = brandUserId(
  MODULE_ROUTE_TEST_ACTOR_ID
);

export const SYSTEM_ADMIN_API_DEFAULT_ROLE_ID = MODULE_ROUTE_TEST_ROLE_ID;
