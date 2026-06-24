import type { MembershipContract } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";
import { resolveLegalEntityContext } from "@/lib/context/resolve-legal-entity-context.server";

const TENANT_ID = "tenant-001";
const COMPANY_ID = "company-001";
const ACTOR_ID = "user-001";

const tenant = {
  tenantId: TENANT_ID,
  slug: "dev-local",
  displayName: "Dev Local Workspace",
  status: "active" as const,
};

const companyRow = {
  id: COMPANY_ID,
  tenantId: TENANT_ID,
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

const companyMembership: MembershipContract = {
  id: "membership-001",
  tenantId: TENANT_ID,
  companyId: COMPANY_ID,
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
    findCompanyByTenantAndSlug: vi.fn(),
    findCompanyById: vi.fn(),
    findEntityGroupById: vi.fn(),
  };
});

import {
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
      expect(result.value.legalEntity.companyId).toBe(COMPANY_ID);
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
    expect(findCompanyById).toHaveBeenCalledWith(COMPANY_ID, undefined);
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
});
