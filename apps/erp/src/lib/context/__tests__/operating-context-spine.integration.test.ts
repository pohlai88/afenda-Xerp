import { normalizeAfendaAuthSession } from "@afenda/auth";
import { createTestEnterpriseId } from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  findActiveCompanyMembershipForUserMock,
  findCompanyByIdMock,
  findEntityGroupByIdMock,
  findOwnershipInterestsByEntityGroupMock,
  findTenantByIdMock,
  getAfendaAuthSessionMock,
} = vi.hoisted(() => ({
  getAfendaAuthSessionMock: vi.fn(),
  findTenantByIdMock: vi.fn(),
  findCompanyByIdMock: vi.fn(),
  findEntityGroupByIdMock: vi.fn(),
  findOwnershipInterestsByEntityGroupMock: vi.fn(),
  findActiveCompanyMembershipForUserMock: vi.fn(),
}));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...actual,
    getAfendaAuthSession: getAfendaAuthSessionMock,
  };
});

vi.mock("@afenda/database", () => ({
  findTenantById: findTenantByIdMock,
  findCompanyById: findCompanyByIdMock,
  findEntityGroupById: findEntityGroupByIdMock,
  findOwnershipInterestsByEntityGroup: findOwnershipInterestsByEntityGroupMock,
  findActiveCompanyMembershipForUser: findActiveCompanyMembershipForUserMock,
}));

import { resolveOperatingContext } from "../resolve-operating-context.server";
import { resolveOperatingContextFromHeaders } from "../resolve-operating-context-from-headers.server";

const TENANT_PK = "550e8400-e29b-41d4-a716-446655440000";
const COMPANY_PK = "660e8400-e29b-41d4-a716-446655440001";
const TENANT_ENTERPRISE_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const COMPANY_ENTERPRISE_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FAW"
);
const USER_ENTERPRISE_ID = createTestEnterpriseId(
  "user",
  "01ARZ3NDEKTSV4RRFFQ69G5FAX"
);
const PLATFORM_USER_ID = "usr_platform_001";
const ACTIVE_WORKSPACE_ID = `${TENANT_PK}:${COMPANY_PK}:root`;
const ENTITY_GROUP_PK = "770e8400-e29b-41d4-a716-446655440002";
const ENTITY_GROUP_ENTERPRISE_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FBW"
);
const CHILD_COMPANY_ENTERPRISE_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FCV"
);

function createLinkedSession() {
  return normalizeAfendaAuthSession(
    {
      session: {
        id: "sess_001",
        expiresAt: new Date("2027-01-01T00:00:00.000Z"),
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        activeWorkspaceId: ACTIVE_WORKSPACE_ID,
      },
      user: {
        id: "auth_user_001",
        email: "operator@example.com",
        name: "Operator",
        emailVerified: true,
      },
    },
    PLATFORM_USER_ID,
    USER_ENTERPRISE_ID
  );
}

describe("operating-context spine integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolveOperatingContextFromHeaders fails closed when session is missing", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce(null);

    const result = await resolveOperatingContextFromHeaders({
      requestHeaders: new Headers(),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MEMBERSHIP_DENIED");
    }
  });

  it("resolveOperatingContextFromHeaders assembles context from database session", async () => {
    const session = createLinkedSession();
    getAfendaAuthSessionMock.mockResolvedValueOnce(session);

    findTenantByIdMock.mockResolvedValueOnce({
      id: TENANT_PK,
      enterpriseId: TENANT_ENTERPRISE_ID,
      slug: "dev-local",
      name: "Dev Local",
      status: "active",
    });
    findCompanyByIdMock.mockResolvedValueOnce({
      id: COMPANY_PK,
      enterpriseId: COMPANY_ENTERPRISE_ID,
      tenantId: TENANT_PK,
      entityGroupEnterpriseId: null,
      legalName: "Dev Local Co",
      displayName: "Dev Local Co",
      slug: "dev-local-co",
      companyType: "standalone",
      countryCode: "US",
      baseCurrency: "USD",
      fiscalCalendarId: null,
      registrationNumber: null,
      taxId: null,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      status: "active",
    });
    findActiveCompanyMembershipForUserMock.mockResolvedValueOnce({
      scopeType: "company",
      membershipEnterpriseId: createTestEnterpriseId(
        "membership",
        "01ARZ3NDEKTSV4RRFFQ69G5FAY"
      ),
      roleEnterpriseId: createTestEnterpriseId(
        "role",
        "01ARZ3NDEKTSV4RRFFQ69G5FAZ"
      ),
    });

    const result = await resolveOperatingContextFromHeaders({
      requestHeaders: new Headers(),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(`${result.value.tenant.tenantId}`).toBe(TENANT_ENTERPRISE_ID);
      expect(result.value.actor.userId).toBe(USER_ENTERPRISE_ID);
    }
  });

  it("resolveOperatingContext denies membership when workspace selection is missing", async () => {
    const session = normalizeAfendaAuthSession(
      {
        session: {
          id: "sess_002",
          expiresAt: new Date("2027-01-01T00:00:00.000Z"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          activeWorkspaceId: null,
        },
        user: {
          id: "auth_user_001",
          email: "operator@example.com",
          name: "Operator",
          emailVerified: true,
        },
      },
      PLATFORM_USER_ID,
      USER_ENTERPRISE_ID
    );

    const result = await resolveOperatingContext({ session });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MISSING_LEGAL_ENTITY_SELECTION");
    }
  });

  it("resolveOperatingContext delegates session path to database assembly", async () => {
    const session = createLinkedSession();

    findTenantByIdMock.mockResolvedValueOnce({
      id: TENANT_PK,
      enterpriseId: TENANT_ENTERPRISE_ID,
      slug: "dev-local",
      name: "Dev Local",
      status: "active",
    });
    findCompanyByIdMock.mockResolvedValueOnce({
      id: COMPANY_PK,
      enterpriseId: COMPANY_ENTERPRISE_ID,
      tenantId: TENANT_PK,
      entityGroupEnterpriseId: null,
      legalName: "Dev Local Co",
      displayName: "Dev Local Co",
      slug: "dev-local-co",
      companyType: "standalone",
      countryCode: "US",
      baseCurrency: "USD",
      fiscalCalendarId: null,
      registrationNumber: null,
      taxId: null,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      status: "active",
    });
    findActiveCompanyMembershipForUserMock.mockResolvedValueOnce({
      scopeType: "company",
      membershipEnterpriseId: createTestEnterpriseId(
        "membership",
        "01ARZ3NDEKTSV4RRFFQ69G5FAY"
      ),
      roleEnterpriseId: createTestEnterpriseId(
        "role",
        "01ARZ3NDEKTSV4RRFFQ69G5FAZ"
      ),
    });

    const result = await resolveOperatingContext({ session });

    expect(result.ok).toBe(true);
  });

  it("resolveOperatingContext assembles consolidation scope for entity-group workspaces", async () => {
    const session = createLinkedSession();

    findTenantByIdMock.mockResolvedValueOnce({
      id: TENANT_PK,
      enterpriseId: TENANT_ENTERPRISE_ID,
      slug: "dev-local",
      name: "Dev Local",
      status: "active",
    });
    findCompanyByIdMock.mockResolvedValueOnce({
      id: COMPANY_PK,
      enterpriseId: COMPANY_ENTERPRISE_ID,
      tenantId: TENANT_PK,
      entityGroupId: ENTITY_GROUP_PK,
      entityGroupEnterpriseId: ENTITY_GROUP_ENTERPRISE_ID,
      legalName: "Dev Local Co",
      displayName: "Dev Local Co",
      slug: "dev-local-co",
      companyType: "standalone",
      countryCode: "US",
      baseCurrency: "USD",
      fiscalCalendarId: null,
      registrationNumber: null,
      taxId: null,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      status: "active",
    });
    findEntityGroupByIdMock.mockResolvedValueOnce({
      id: ENTITY_GROUP_PK,
      enterpriseId: ENTITY_GROUP_ENTERPRISE_ID,
      tenantId: TENANT_PK,
      slug: "dev-group",
      displayName: "Dev Group",
      parentLegalEntityId: COMPANY_PK,
      parentLegalEntityEnterpriseId: COMPANY_ENTERPRISE_ID,
      status: "active",
    });
    findOwnershipInterestsByEntityGroupMock.mockResolvedValueOnce([
      {
        id: "ownership-001",
        enterpriseId: createTestEnterpriseId(
          "ownershipInterest",
          "01ARZ3NDEKTSV4RRFFQ69G5FDV"
        ),
        tenantId: TENANT_PK,
        tenantEnterpriseId: TENANT_ENTERPRISE_ID,
        entityGroupId: ENTITY_GROUP_PK,
        entityGroupEnterpriseId: ENTITY_GROUP_ENTERPRISE_ID,
        parentLegalEntityId: COMPANY_PK,
        parentLegalEntityEnterpriseId: COMPANY_ENTERPRISE_ID,
        childLegalEntityId: "880e8400-e29b-41d4-a716-446655440003",
        childLegalEntityEnterpriseId: CHILD_COMPANY_ENTERPRISE_ID,
        ownershipPercentage: 100,
        votingPercentage: 100,
        controlType: "control",
        consolidationTreatment: "full_consolidation",
        nonControllingInterestApplicable: false,
        effectiveFrom: "2026-01-01",
        effectiveTo: null,
        status: "active",
      },
    ]);
    findActiveCompanyMembershipForUserMock.mockResolvedValueOnce({
      scopeType: "company",
      membershipEnterpriseId: createTestEnterpriseId(
        "membership",
        "01ARZ3NDEKTSV4RRFFQ69G5FAY"
      ),
      roleEnterpriseId: createTestEnterpriseId(
        "role",
        "01ARZ3NDEKTSV4RRFFQ69G5FAZ"
      ),
    });

    const result = await resolveOperatingContext({ session });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.entityGroup?.entityGroupId).toBe(
        ENTITY_GROUP_ENTERPRISE_ID
      );
      expect(result.value.ownershipInterests).toHaveLength(1);
      expect(result.value.consolidationScope?.entityGroupId).toBe(
        ENTITY_GROUP_ENTERPRISE_ID
      );
      expect(result.value.consolidationScope?.legalEntities).toHaveLength(1);
    }
  });
});
