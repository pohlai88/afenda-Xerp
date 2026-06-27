import type { PermissionKey } from "@afenda/database";
import { ok } from "@afenda/kernel";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import {
  API_TEST_COMPANY_B_ID,
  API_TEST_CORRELATION_ID,
  API_TEST_MEMBERSHIP_ID,
} from "@/lib/api/__tests__/api-id-test-fixtures";
import { TENANT_SLUG_HEADER } from "@/lib/context/context.constants";
import { createServerExecutionContext } from "@/lib/context/create-server-execution-context.server";
import type { ResolveOperatingContextInput } from "@/lib/context/resolve-operating-context.server";
import {
  createModuleRouteOperatingContext,
  createModuleRoutePermissionDataSource,
  MODULE_ROUTE_TEST_ACTOR_ID,
  MODULE_ROUTE_TEST_COMPANY_ID,
  MODULE_ROUTE_TEST_ROLE_ID,
  MODULE_ROUTE_TEST_TENANT_ID,
} from "@/lib/modules/__tests__/module-route-test-fixtures";

export const SYSTEM_ADMIN_API_COMPANY_B_ID = API_TEST_COMPANY_B_ID;
export const SYSTEM_ADMIN_API_CORRELATION_ID = API_TEST_CORRELATION_ID;
export const SYSTEM_ADMIN_API_MEMBERSHIP_B_ID = API_TEST_MEMBERSHIP_ID;

export function createSystemAdminApiOperatingContext() {
  return createModuleRouteOperatingContext({
    correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
  });
}

export function createSystemAdminApiExecutionContext() {
  return createServerExecutionContext({
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

export const SYSTEM_ADMIN_API_ACTOR_USER_ID = MODULE_ROUTE_TEST_ACTOR_ID;

export const SYSTEM_ADMIN_API_DEFAULT_ROLE_ID = MODULE_ROUTE_TEST_ROLE_ID;
