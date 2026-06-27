import type { PermissionKey } from "@afenda/database";
import { createTestEnterpriseId, ok } from "@afenda/kernel";
import type {
  MembershipContract,
  PlatformUserContract,
  RoleContract,
  TenantContract,
} from "@afenda/permissions";
import { InMemoryPermissionDataSource } from "@afenda/permissions";
import { testLegalEntityCurrencyFields } from "@/lib/context/__tests__/legal-entity-test-fixtures";
import type { ResolveOperatingContextInput } from "@/lib/context/resolve-operating-context.server";

export const DASHBOARD_RBAC_ACTOR_ID = createTestEnterpriseId(
  "user",
  "01ARZ3NDEKTSV4RRFFQ69G5DAV"
);
export const DASHBOARD_RBAC_TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5TEN"
);
export const DASHBOARD_RBAC_COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5CMP"
);
export const DASHBOARD_RBAC_ROLE_ID = createTestEnterpriseId(
  "role",
  "01ARZ3NDEKTSV4RRFFQ69G5ROL"
);
export const DASHBOARD_RBAC_MEMBERSHIP_ID = createTestEnterpriseId(
  "membership",
  "01ARZ3NDEKTSV4RRFFQ69G5MEM"
);

export function createDashboardRbacOperatingContextFixture() {
  return {
    actor: { userId: DASHBOARD_RBAC_ACTOR_ID },
    consolidationScope: null,
    correlationId: createTestEnterpriseId("correlation"),
    entityGroup: null,
    legalEntity: {
      companyId: DASHBOARD_RBAC_COMPANY_ID,
      tenantId: DASHBOARD_RBAC_TENANT_ID,
      entityGroupId: null,
      slug: "dev-company",
      legalName: "Dev Company Pty Ltd",
      displayName: "Dev Company",
      registrationNumber: "DEV-001",
      taxRegistrationNumber: null,
      ...testLegalEntityCurrencyFields(),
      reportingCurrency: null,
      companyType: "standalone" as const,
      fiscalCalendarId: null,
      effectiveFrom: null,
      effectiveTo: null,
      status: "active" as const,
    },
    organizationUnit: null,
    ownershipInterests: [],
    permissionScope: {
      tenantId: DASHBOARD_RBAC_TENANT_ID,
      companyId: DASHBOARD_RBAC_COMPANY_ID,
      organizationId: null,
      entityGroupId: null,
      projectId: null,
      teamId: null,
      membershipId: DASHBOARD_RBAC_MEMBERSHIP_ID,
      roleId: DASHBOARD_RBAC_ROLE_ID,
      grantScopeType: "company" as const,
      elevations: {
        consolidationView: false,
        crossCompany: false,
        minorityInterestCompany: false,
        platformAdmin: false,
      },
    },
    project: null,
    surface: null,
    team: null,
    tenant: {
      tenantId: DASHBOARD_RBAC_TENANT_ID,
      slug: "dev-local",
      displayName: "Dev Local Workspace",
      status: "active" as const,
    },
    workflow: null,
    workspace: {
      tenantId: DASHBOARD_RBAC_TENANT_ID,
      companyId: DASHBOARD_RBAC_COMPANY_ID,
      organizationId: null,
      projectId: null,
    },
  };
}

export function seedDashboardRbacAuthorizationStore(
  permissions: readonly PermissionKey[]
): InMemoryPermissionDataSource {
  const dataSource = new InMemoryPermissionDataSource();

  const tenant: TenantContract = {
    id: DASHBOARD_RBAC_TENANT_ID,
    name: "Dev Local Workspace",
    slug: "dev-local",
    status: "active",
  };
  const platformUser: PlatformUserContract = {
    id: DASHBOARD_RBAC_ACTOR_ID,
    displayName: "Dev Workspace Admin",
    email: "dev-admin@localhost.afenda",
    status: "active",
  };
  const role: RoleContract = {
    id: DASHBOARD_RBAC_ROLE_ID,
    key: "tenant.admin",
    name: "Tenant Admin",
    description: null,
    scope: "tenant",
    status: "active",
    tenantId: DASHBOARD_RBAC_TENANT_ID,
  };
  const membership: MembershipContract = {
    id: DASHBOARD_RBAC_MEMBERSHIP_ID,
    userId: DASHBOARD_RBAC_ACTOR_ID,
    tenantId: DASHBOARD_RBAC_TENANT_ID,
    companyId: DASHBOARD_RBAC_COMPANY_ID,
    entityGroupId: null,
    organizationId: null,
    projectId: null,
    teamId: null,
    roleId: DASHBOARD_RBAC_ROLE_ID,
    scopeType: "company",
    status: "active",
  };

  dataSource
    .seedTenant(tenant)
    .seedPlatformUser(platformUser)
    .seedCompany(DASHBOARD_RBAC_TENANT_ID, DASHBOARD_RBAC_COMPANY_ID)
    .seedRole(role, permissions)
    .seedMembership(membership);

  return dataSource;
}

export function createDashboardRbacOperatingContextResolver() {
  return async (_input: ResolveOperatingContextInput) =>
    ok(createDashboardRbacOperatingContextFixture());
}
