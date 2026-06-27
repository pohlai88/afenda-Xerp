import type { PermissionKey } from "@afenda/database";
import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import { InMemoryPermissionDataSource } from "@afenda/permissions";
import {
  API_TEST_ACTOR_ID,
  API_TEST_COMPANY_ID,
  API_TEST_CORRELATION_ID,
  API_TEST_MEMBERSHIP_ID,
  API_TEST_ROLE_ID,
  API_TEST_TENANT_ID,
} from "@/lib/api/__tests__/api-id-test-fixtures";
import { testLegalEntityCurrencyFields } from "@/lib/context/__tests__/legal-entity-test-fixtures";

export const MODULE_ROUTE_TEST_TENANT_ID = API_TEST_TENANT_ID;
export const MODULE_ROUTE_TEST_COMPANY_ID = API_TEST_COMPANY_ID;
export const MODULE_ROUTE_TEST_ACTOR_ID = API_TEST_ACTOR_ID;
export const MODULE_ROUTE_TEST_ROLE_ID = API_TEST_ROLE_ID;
export const MODULE_ROUTE_TEST_MEMBERSHIP_ID = API_TEST_MEMBERSHIP_ID;

export function createModuleRouteOperatingContext(input?: {
  readonly correlationId?: string;
}): OperatingContext {
  return {
    actor: { userId: MODULE_ROUTE_TEST_ACTOR_ID },
    correlationId: input?.correlationId ?? API_TEST_CORRELATION_ID,
    tenant: {
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
      slug: "acme",
      displayName: "Acme",
      status: "active",
    },
    entityGroup: null,
    legalEntity: {
      companyId: MODULE_ROUTE_TEST_COMPANY_ID,
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
      entityGroupId: null,
      slug: "acme-co",
      legalName: "Acme Co",
      displayName: "Acme Co",
      registrationNumber: null,
      taxRegistrationNumber: null,
      ...testLegalEntityCurrencyFields(),
      reportingCurrency: null,
      companyType: "standalone",
      fiscalCalendarId: null,
      effectiveFrom: null,
      effectiveTo: null,
      status: "active",
    },
    ownershipInterests: [],
    organizationUnit: null,
    team: null,
    project: null,
    workspace: {
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
      companyId: MODULE_ROUTE_TEST_COMPANY_ID,
      organizationId: null,
      projectId: null,
    },
    permissionScope: {
      grantScopeType: "company",
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
      entityGroupId: null,
      companyId: MODULE_ROUTE_TEST_COMPANY_ID,
      organizationId: null,
      teamId: null,
      projectId: null,
      membershipId: MODULE_ROUTE_TEST_MEMBERSHIP_ID,
      roleId: MODULE_ROUTE_TEST_ROLE_ID,
      elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
    },
    consolidationScope: null,
    surface: null,
    workflow: null,
  };
}

export function createModuleRoutePermissionDataSource(
  permissionKeys: readonly PermissionKey[]
): InMemoryPermissionDataSource {
  return new InMemoryPermissionDataSource()
    .seedTenant({
      id: MODULE_ROUTE_TEST_TENANT_ID,
      slug: "acme",
      name: "Acme",
      status: "active",
    })
    .seedCompany(MODULE_ROUTE_TEST_TENANT_ID, MODULE_ROUTE_TEST_COMPANY_ID)
    .seedPlatformUser({
      id: MODULE_ROUTE_TEST_ACTOR_ID,
      email: "actor@example.com",
      displayName: "Actor",
      status: "active",
    })
    .seedRole(
      {
        id: MODULE_ROUTE_TEST_ROLE_ID,
        key: "company.admin",
        name: "Company Admin",
        description: null,
        scope: "company",
        status: "active",
        tenantId: MODULE_ROUTE_TEST_TENANT_ID,
      },
      permissionKeys
    )
    .seedMembership({
      id: MODULE_ROUTE_TEST_MEMBERSHIP_ID,
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
      companyId: MODULE_ROUTE_TEST_COMPANY_ID,
      entityGroupId: null,
      organizationId: null,
      projectId: null,
      teamId: null,
      userId: MODULE_ROUTE_TEST_ACTOR_ID,
      roleId: MODULE_ROUTE_TEST_ROLE_ID,
      scopeType: "company",
      status: "active",
    });
}
