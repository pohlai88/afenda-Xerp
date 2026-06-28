import { createTestEnterpriseId } from "@afenda/kernel";
import type { MembershipContract } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";
import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";

const TENANT_PK = "tenant-001";
const TENANT_ENTERPRISE_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const COMPANY_PK = "660e8400-e29b-41d4-a716-446655440001";
const COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ORG_PK = "770e8400-e29b-41d4-a716-446655440002";
const ORG_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ENTITY_GROUP_PK = "880e8400-e29b-41d4-a716-446655440003";
const ACTOR_ID = "user-001";
const MEMBERSHIP_ID = createTestEnterpriseId(
  "membership",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ROLE_ID = createTestEnterpriseId("role", "01ARZ3NDEKTSV4RRFFQ69G5FAV");

const tenantRow = {
  id: TENANT_PK,
  enterpriseId: TENANT_ENTERPRISE_ID,
  slug: "dev-local",
  name: "Dev Local Workspace",
  status: "active" as const,
};

const companyRow = {
  id: COMPANY_PK,
  enterpriseId: COMPANY_ID,
  tenantId: TENANT_PK,
  entityGroupId: null,
  slug: "dev-company",
  legalName: "Dev Company Pty Ltd",
  displayName: "Dev Company",
  registrationNumber: "DEV-001",
  taxId: null,
  baseCurrency: "AUD",
  countryCode: "AU",
  companyType: "standalone" as const,
  fiscalCalendarId: null,
  effectiveFrom: null,
  effectiveTo: null,
  status: "active" as const,
};

const organizationRow = {
  id: ORG_PK,
  enterpriseId: ORG_ID,
  tenantId: TENANT_PK,
  companyId: COMPANY_PK,
  companyEnterpriseId: COMPANY_ID,
  slug: "dev-hq",
  name: "Dev HQ",
  type: "department",
  parentOrganizationId: null,
  status: "active" as const,
  effectiveFrom: null,
  effectiveTo: null,
};

const companyMembership: MembershipContract = {
  id: MEMBERSHIP_ID,
  tenantId: TENANT_ENTERPRISE_ID,
  companyId: COMPANY_PK,
  entityGroupId: null,
  organizationId: null,
  projectId: null,
  teamId: null,
  userId: ACTOR_ID,
  roleId: ROLE_ID,
  scopeType: "company",
  status: "active",
};

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    findTenantBySlug: vi.fn(),
    findCompanyByTenantAndSlug: vi.fn(),
    findCompanyById: vi.fn(),
    findEntityGroupById: vi.fn(),
    findOrganizationByCompanyAndSlug: vi.fn(),
    findOrganizationById: vi.fn(),
  };
});

vi.mock("@/lib/context/log-operating-context-resolution.server", () => ({
  logOperatingContextResolution: vi.fn(),
}));

vi.mock("@afenda/permissions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/permissions")>();
  return {
    ...actual,
    createProductionAuthorizationDataSources: vi.fn(() => ({
      permission: {
        getRole: vi.fn().mockResolvedValue({
          id: ROLE_ID,
          key: "organization.admin",
          name: "Organization Admin",
          description: null,
          scope: "organization",
          status: "active",
          tenantId: TENANT_ENTERPRISE_ID,
        }),
      },
      policy: {},
    })),
  };
});

import {
  findCompanyById,
  findCompanyByTenantAndSlug,
  findEntityGroupById,
  findOrganizationByCompanyAndSlug,
  findTenantBySlug,
} from "@afenda/database";
import { logOperatingContextResolution } from "@/lib/context/log-operating-context-resolution.server";

describe("resolveOperatingContext", () => {
  it("rejects unknown tenant slugs", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(null);

    const result = await resolveOperatingContext({
      actorUserId: ACTOR_ID,
      correlationId: "corr-001",
      memberships: [companyMembership],
      selection: { tenantSlug: "missing-tenant" },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TENANT_NOT_FOUND");
    }
  });

  it("rejects client company slug outside tenant boundary", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(tenantRow);
    vi.mocked(findCompanyByTenantAndSlug).mockResolvedValueOnce({
      ...companyRow,
      tenantId: "other-tenant",
    });

    const result = await resolveOperatingContext({
      actorUserId: ACTOR_ID,
      correlationId: "corr-002",
      memberships: [companyMembership],
      selection: {
        tenantSlug: "dev-local",
        companySlug: "dev-company",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("COMPANY_SCOPE_MISMATCH");
    }
  });

  it("rejects organization unit outside selected legal entity", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(tenantRow);
    vi.mocked(findCompanyByTenantAndSlug).mockResolvedValueOnce(companyRow);
    vi.mocked(findOrganizationByCompanyAndSlug).mockResolvedValueOnce({
      ...organizationRow,
      companyId: "other-company-pk",
    });

    const result = await resolveOperatingContext({
      actorUserId: ACTOR_ID,
      correlationId: "corr-003",
      memberships: [companyMembership],
      selection: {
        tenantSlug: "dev-local",
        companySlug: "dev-company",
        organizationSlug: "dev-hq",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("ORGANIZATION_SCOPE_MISMATCH");
    }
  });

  it("resolves allowed tenant, company, and organization scope", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(tenantRow);
    vi.mocked(findCompanyByTenantAndSlug).mockResolvedValueOnce(companyRow);
    vi.mocked(findOrganizationByCompanyAndSlug).mockResolvedValueOnce(
      organizationRow
    );
    vi.mocked(findCompanyById).mockResolvedValue(companyRow);

    const orgMembership: MembershipContract = {
      ...companyMembership,
      scopeType: "organization",
      organizationId: ORG_ID,
    };

    const result = await resolveOperatingContext({
      actorUserId: ACTOR_ID,
      correlationId: "corr-004",
      memberships: [orgMembership],
      selection: {
        tenantSlug: "dev-local",
        companySlug: "dev-company",
        organizationSlug: "dev-hq",
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(`${result.value.tenant.tenantId}`).toBe(TENANT_ENTERPRISE_ID);
      expect(result.value.legalEntity.companyId).toBe(COMPANY_ID);
      expect(result.value.organizationUnit?.organizationUnitId).toBe(ORG_ID);
      expect(result.value.permissionScope.grantScopeType).toBe("organization");
      expect(logOperatingContextResolution).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "resolved",
          tenantSlug: "dev-local",
        })
      );
    }
  });

  it("rejects suspended tenants", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce({
      ...tenantRow,
      status: "suspended",
    });

    const result = await resolveOperatingContext({
      actorUserId: ACTOR_ID,
      correlationId: "corr-005",
      memberships: [companyMembership],
      selection: { tenantSlug: "dev-local" },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TENANT_NOT_OPERATIONAL");
    }
  });

  it("rejects membership when actor lacks company scope", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(tenantRow);
    vi.mocked(findCompanyByTenantAndSlug).mockResolvedValueOnce(companyRow);

    const result = await resolveOperatingContext({
      actorUserId: ACTOR_ID,
      correlationId: "corr-006",
      memberships: [],
      selection: {
        tenantSlug: "dev-local",
        companySlug: "dev-company",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MEMBERSHIP_DENIED");
    }
  });

  it("rejects missing entity group for grouped legal entities", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(tenantRow);
    vi.mocked(findCompanyByTenantAndSlug).mockResolvedValueOnce({
      ...companyRow,
      entityGroupId: ENTITY_GROUP_PK,
    });
    vi.mocked(findEntityGroupById).mockResolvedValueOnce(null);

    const result = await resolveOperatingContext({
      actorUserId: ACTOR_ID,
      correlationId: "corr-007",
      memberships: [companyMembership],
      selection: {
        tenantSlug: "dev-local",
        companySlug: "dev-company",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("ENTITY_GROUP_NOT_FOUND");
    }
  });

  it("rejects project selection hints until TIP-030", async () => {
    vi.mocked(findTenantBySlug).mockResolvedValueOnce(tenantRow);

    const result = await resolveOperatingContext({
      actorUserId: ACTOR_ID,
      correlationId: "corr-008",
      memberships: [companyMembership],
      selection: {
        tenantSlug: "dev-local",
        projectId: "project-001",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PROJECT_SCOPE_MISMATCH");
    }
  });
});
