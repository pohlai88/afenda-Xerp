import { createTestEnterpriseId } from "@afenda/kernel";
import type { MembershipContract } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";
import { resolveLegalEntityContext } from "@/lib/context/resolve-legal-entity-context.server";

const TENANT_ID = createTestEnterpriseId("tenant");
const COMPANY_ENTERPRISE_ID = createTestEnterpriseId("company");
const COMPANY_PK = "company-001";
const ACTOR_ID = "user-001";

const tenant = {
  tenantId: TENANT_ID,
  slug: "dev-local",
  displayName: "Dev Local Workspace",
  status: "active" as const,
};

const companyRow = {
  id: COMPANY_PK,
  enterpriseId: COMPANY_ENTERPRISE_ID,
  tenantId: TENANT_ID,
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
  tenantId: TENANT_ID,
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
      tenant,
      memberships: [companyMembership],
      selection: { companySlug: "dev-company", companyId: null },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.legalEntity.companyId).toBe(COMPANY_ENTERPRISE_ID);
      expect(result.value.entityGroup).toBeNull();
    }
  });

  it("defaults to membership company when no slug hint", async () => {
    vi.mocked(findCompanyById).mockResolvedValueOnce(companyRow);

    const result = await resolveLegalEntityContext({
      tenant,
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
      tenant,
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
      entityGroupId: "group-001",
      entityGroupEnterpriseId: createTestEnterpriseId("entityGroup"),
    });
    vi.mocked(findEntityGroupById).mockResolvedValueOnce(null);

    const result = await resolveLegalEntityContext({
      tenant,
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
      entityGroupId: "group-001",
      scopeType: "entity_group",
    };
    const mockDb = {} as import("@afenda/database").AfendaDatabase;

    vi.mocked(findEntityGroupById).mockResolvedValue({
      id: "group-001",
      enterpriseId: createTestEnterpriseId("entityGroup"),
      tenantId: TENANT_ID,
      slug: "dev-group",
      displayName: "Dev Group",
      parentLegalEntityId: COMPANY_PK,
      parentLegalEntityEnterpriseId: COMPANY_ENTERPRISE_ID,
      status: "active",
    });
    vi.mocked(findCompanyById).mockImplementation(async (companyId) =>
      companyId === COMPANY_PK ? companyRow : null
    );

    const result = await resolveLegalEntityContext({
      db: mockDb,
      tenant,
      memberships: [entityGroupMembership],
      selection: { companySlug: null, companyId: null },
    });

    expect(result.ok).toBe(true);
    expect(findEntityGroupById).toHaveBeenCalledWith("group-001", mockDb);
    expect(findCompanyById).toHaveBeenCalledWith(COMPANY_PK, mockDb);
  });

  it("defaults to first active company in group when parent legal entity is absent", async () => {
    const subsidiaryEnterpriseId = createTestEnterpriseId(
      "company",
      "01ARZ3NDEKTSV4RRFFQ69G5FCV"
    );
    const subsidiaryPk = "company-002";
    const entityGroupMembership: MembershipContract = {
      ...companyMembership,
      id: "membership-group-002",
      companyId: null,
      entityGroupId: "group-002",
      scopeType: "entity_group",
    };
    const mockDb = {} as import("@afenda/database").AfendaDatabase;

    vi.mocked(findEntityGroupById).mockResolvedValue({
      id: "group-002",
      enterpriseId: createTestEnterpriseId(
        "entityGroup",
        "01ARZ3NDEKTSV4RRFFQ69G5FDV"
      ),
      tenantId: TENANT_ID,
      slug: "dev-group-2",
      displayName: "Dev Group 2",
      parentLegalEntityId: null,
      parentLegalEntityEnterpriseId: null,
      status: "active",
    });
    vi.mocked(findActiveCompaniesByEntityGroupId).mockResolvedValue([
      {
        ...companyRow,
        id: subsidiaryPk,
        enterpriseId: subsidiaryEnterpriseId,
        slug: "subsidiary-co",
        displayName: "Subsidiary Co",
      },
    ]);
    vi.mocked(findCompanyById).mockImplementation(async (companyId) => {
      if (companyId === subsidiaryPk) {
        return {
          ...companyRow,
          id: subsidiaryPk,
          enterpriseId: subsidiaryEnterpriseId,
          slug: "subsidiary-co",
        };
      }
      return null;
    });

    const result = await resolveLegalEntityContext({
      db: mockDb,
      tenant,
      memberships: [entityGroupMembership],
      selection: { companySlug: null, companyId: null },
    });

    expect(result.ok).toBe(true);
    expect(findActiveCompaniesByEntityGroupId).toHaveBeenCalledWith(
      "group-002",
      TENANT_ID,
      mockDb
    );
    if (result.ok) {
      expect(result.value.legalEntity.companyId).toBe(subsidiaryEnterpriseId);
    }
  });
});
