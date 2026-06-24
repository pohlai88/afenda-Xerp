import type { PermissionKey } from "@afenda/database";
import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import { InMemoryPermissionDataSource } from "@afenda/permissions";

export const MODULE_ROUTE_TEST_TENANT_ID = "tenant-001";
export const MODULE_ROUTE_TEST_COMPANY_ID = "company-a";
export const MODULE_ROUTE_TEST_ACTOR_ID = "user-001";
export const MODULE_ROUTE_TEST_ROLE_ID = "role-admin";
export const MODULE_ROUTE_TEST_MEMBERSHIP_ID = "membership-001";

export function createModuleRouteOperatingContext(input?: {
  readonly correlationId?: string;
}): OperatingContext {
  return {
    actor: { userId: MODULE_ROUTE_TEST_ACTOR_ID },
    correlationId: input?.correlationId ?? "corr-module-route-test",
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
      countryCode: "AU",
      baseCurrency: "AUD",
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
      organizationId: null,
      userId: MODULE_ROUTE_TEST_ACTOR_ID,
      roleId: MODULE_ROUTE_TEST_ROLE_ID,
      scopeType: "company",
      status: "active",
    });
}
