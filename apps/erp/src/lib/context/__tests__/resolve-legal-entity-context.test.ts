import { createTestEnterpriseId } from "@afenda/kernel";
import type { MembershipContract } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";
import { resolveLegalEntityContext } from "@/lib/context/resolve-legal-entity-context.server";

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
const ENTITY_GROUP_PK = "880e8400-e29b-41d4-a716-446655440003";
const ENTITY_GROUP_A_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ENTITY_GROUP_B_PK = "880e8400-e29b-41d4-a716-446655440004";
const ENTITY_GROUP_B_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV"
);
const SUBSIDIARY_PK = "660e8400-e29b-41d4-a716-446655440005";
const SUBSIDIARY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV"
);
const ACTOR_ID = "user-001";

const tenant = {
  tenantId: TENANT_ENTERPRISE_ID,
  slug: "dev-local",
  displayName: "Dev Local Workspace",
  status: "active" as const,
};

const companyRow = {
  id: COMPANY_PK,
  enterpriseId: COMPANY_ID,
  tenantId: TENANT_PK,
  entityGroupId: null,
  entityGroupEnterpriseId: null,
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

const companyMembership: MembershipContract = {
  id: "membership-001",
  tenantId: TENANT_PK,
  companyId: COMPANY_PK,
  entityGroupId: null,
  organizationId: null,
  projectId: null,
  teamId: null,
  userId: ACTOR_ID,
  roleId: "role-001",
  scopeType: "company",
  status: "active",
};

const baseInput = {
  tenant,
  tenantPk: TENANT_PK,
} as const;

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    findActiveCompaniesByEntityGroupId: vi.fn(),
    findCompanyByTenantAndSlug: vi.fn(),
    findCompanyById: vi.fn(),
    findEntityGroupById: vi.fn(),
  };
});

import {
  findActiveCompaniesByEntityGroupId,
  findCompanyById,
  findCompanyByTenantAndSlug,
  findEntityGroupById,
} from "@afenda/database";

describe("resolveLegalEntityContext", () => {
  it("resolves legal entity from company slug hint", async () => {
    vi.mocked(findCompanyByTenantAndSlug).mockResolvedValueOnce(companyRow);

    const result = await resolveLegalEntityContext({
      ...baseInput,
      memberships: [companyMembership],
      selection: { companySlug: "dev-company", companyId: null },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.legalEntity.companyId).toBe(COMPANY_ID);
      expect(`${result.value.legalEntity.tenantId}`).toBe(TENANT_ENTERPRISE_ID);
      expect(result.value.entityGroup).toBeNull();
    }
    expect(findCompanyByTenantAndSlug).toHaveBeenCalledWith(
      TENANT_PK,
      "dev-company",
      undefined
    );
  });

  it("defaults to membership company when no slug hint", async () => {
    vi.mocked(findCompanyById).mockResolvedValueOnce(companyRow);

    const result = await resolveLegalEntityContext({
      ...baseInput,
      memberships: [companyMembership],
      selection: { companySlug: null, companyId: null },
    });

    expect(result.ok).toBe(true);
    expect(findCompanyById).toHaveBeenCalledWith(COMPANY_PK, undefined);
  });

  it("rejects company outside tenant boundary", async () => {
    vi.mocked(findCompanyByTenantAndSlug).mockResolvedValueOnce({
      ...companyRow,
      tenantId: "other-tenant",
    });

    const result = await resolveLegalEntityContext({
      ...baseInput,
      memberships: [companyMembership],
      selection: { companySlug: "dev-company", companyId: null },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("COMPANY_SCOPE_MISMATCH");
    }
  });

  it("rejects missing entity group for grouped legal entities", async () => {
    vi.mocked(findCompanyByTenantAndSlug).mockResolvedValueOnce({
      ...companyRow,
      entityGroupId: ENTITY_GROUP_PK,
      entityGroupEnterpriseId: ENTITY_GROUP_A_ID,
    });
    vi.mocked(findEntityGroupById).mockResolvedValueOnce(null);

    const result = await resolveLegalEntityContext({
      ...baseInput,
      memberships: [companyMembership],
      selection: { companySlug: "dev-company", companyId: null },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("ENTITY_GROUP_NOT_FOUND");
    }
  });

  it("defaults to parent legal entity for entity_group-only membership", async () => {
    const entityGroupMembership: MembershipContract = {
      ...companyMembership,
      id: "membership-group-001",
      companyId: null,
      entityGroupId: ENTITY_GROUP_PK,
      scopeType: "entity_group",
    };
    const mockDb = {} as import("@afenda/database").AfendaDatabase;

    vi.mocked(findEntityGroupById).mockResolvedValueOnce({
      id: ENTITY_GROUP_PK,
      enterpriseId: ENTITY_GROUP_A_ID,
      tenantId: TENANT_PK,
      slug: "dev-group",
      displayName: "Dev Group",
      parentLegalEntityId: COMPANY_PK,
      parentLegalEntityEnterpriseId: COMPANY_ID,
      status: "active",
    });
    vi.mocked(findCompanyById).mockImplementation(async (companyId) =>
      companyId === COMPANY_PK ? companyRow : null
    );

    const result = await resolveLegalEntityContext({
      db: mockDb,
      ...baseInput,
      memberships: [entityGroupMembership],
      selection: { companySlug: null, companyId: null },
    });

    expect(result.ok).toBe(true);
    expect(findEntityGroupById).toHaveBeenCalledWith(ENTITY_GROUP_PK, mockDb);
    expect(findCompanyById).toHaveBeenCalledWith(COMPANY_PK, mockDb);
  });

  it("defaults to first active company in group when parent legal entity is absent", async () => {
    const entityGroupMembership: MembershipContract = {
      ...companyMembership,
      id: "membership-group-002",
      companyId: null,
      entityGroupId: ENTITY_GROUP_B_PK,
      scopeType: "entity_group",
    };
    const mockDb = {} as import("@afenda/database").AfendaDatabase;

    vi.mocked(findEntityGroupById).mockResolvedValueOnce({
      id: ENTITY_GROUP_B_PK,
      enterpriseId: ENTITY_GROUP_B_ID,
      tenantId: TENANT_PK,
      slug: "dev-group-2",
      displayName: "Dev Group 2",
      parentLegalEntityId: null,
      parentLegalEntityEnterpriseId: null,
      status: "active",
    });
    vi.mocked(findActiveCompaniesByEntityGroupId).mockResolvedValueOnce([
      {
        ...companyRow,
        id: SUBSIDIARY_PK,
        enterpriseId: SUBSIDIARY_ID,
        entityGroupEnterpriseId: ENTITY_GROUP_B_ID,
        slug: "subsidiary-co",
        displayName: "Subsidiary Co",
      },
    ]);
    vi.mocked(findCompanyById).mockResolvedValueOnce({
      ...companyRow,
      id: SUBSIDIARY_PK,
      enterpriseId: SUBSIDIARY_ID,
      slug: "subsidiary-co",
    });

    const result = await resolveLegalEntityContext({
      db: mockDb,
      ...baseInput,
      memberships: [entityGroupMembership],
      selection: { companySlug: null, companyId: null },
    });

    expect(result.ok).toBe(true);
    expect(findActiveCompaniesByEntityGroupId).toHaveBeenCalledWith(
      ENTITY_GROUP_B_PK,
      TENANT_PK,
      mockDb
    );
    if (result.ok) {
      expect(result.value.legalEntity.companyId).toBe(SUBSIDIARY_ID);
      expect(result.value.companyPk).toBe(SUBSIDIARY_PK);
    }
  });
});
