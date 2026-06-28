import type { MembershipContract } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";

const TENANT_ID = "tenant-001";
const COMPANY_A_ID = "company-a";
const COMPANY_B_ID = "company-b";
const GROUP_ID = "group-001";
const ACTOR_ID = "user-001";

const entityGroupMembership: MembershipContract = {
  id: "membership-group-001",
  tenantId: TENANT_ID,
  companyId: null,
  entityGroupId: GROUP_ID,
  organizationId: null,
  projectId: null,
  teamId: null,
  userId: ACTOR_ID,
  roleId: "role-001",
  scopeType: "entity_group",
  status: "active",
};

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    findActiveCompaniesByEntityGroupId: vi.fn(),
    findCompanyById: vi.fn(),
    findEntityGroupById: vi.fn(),
    findOrganizationById: vi.fn(),
    getDb: vi.fn(),
  };
});

import {
  findActiveCompaniesByEntityGroupId,
  findCompanyById,
  findEntityGroupById,
} from "@afenda/database";

describe("resolveAllowedContextOptions", () => {
  it("expands entity_group membership into multiple company switch targets", async () => {
    vi.mocked(findEntityGroupById).mockResolvedValueOnce({
      id: GROUP_ID,
      enterpriseId: "entgrp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      tenantId: TENANT_ID,
      slug: "dev-group",
      displayName: "Dev Group",
      parentLegalEntityId: COMPANY_A_ID,
      parentLegalEntityEnterpriseId: "co_01ARZ3NDEKTSV4RRFFQ69G5CAV",
      status: "active",
    });
    vi.mocked(findActiveCompaniesByEntityGroupId).mockResolvedValueOnce([
      {
        id: COMPANY_A_ID,
        enterpriseId: "co_01ARZ3NDEKTSV4RRFFQ69G5CAV",
        entityGroupEnterpriseId: "entgrp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
        tenantId: TENANT_ID,
        entityGroupId: GROUP_ID,
        slug: "company-a",
        legalName: "Company A Pty Ltd",
        displayName: "Company A",
        registrationNumber: "A-001",
        taxId: null,
        baseCurrency: "AUD",
        countryCode: "AU",
        companyType: "subsidiary",
        fiscalCalendarId: null,
        effectiveFrom: null,
        effectiveTo: null,
        status: "active",
      },
      {
        id: COMPANY_B_ID,
        enterpriseId: "co_01ARZ3NDEKTSV4RRFFQ69G5CBV",
        entityGroupEnterpriseId: "entgrp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
        tenantId: TENANT_ID,
        entityGroupId: GROUP_ID,
        slug: "company-b",
        legalName: "Company B Pty Ltd",
        displayName: "Company B",
        registrationNumber: "B-001",
        taxId: null,
        baseCurrency: "AUD",
        countryCode: "AU",
        companyType: "subsidiary",
        fiscalCalendarId: null,
        effectiveFrom: null,
        effectiveTo: null,
        status: "active",
      },
    ]);

    vi.mocked(findCompanyById).mockImplementation(async (companyId) => {
      if (companyId === COMPANY_A_ID) {
        return {
          id: COMPANY_A_ID,
          enterpriseId: "co_01ARZ3NDEKTSV4RRFFQ69G5CAV",
          tenantId: TENANT_ID,
          entityGroupId: GROUP_ID,
          entityGroupEnterpriseId: "entgrp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
          slug: "company-a",
          legalName: "Company A Pty Ltd",
          displayName: "Company A",
          registrationNumber: "A-001",
          taxId: null,
          baseCurrency: "AUD",
          countryCode: "AU",
          companyType: "subsidiary",
          fiscalCalendarId: null,
          effectiveFrom: null,
          effectiveTo: null,
          status: "active",
        };
      }
      if (companyId === COMPANY_B_ID) {
        return {
          id: COMPANY_B_ID,
          enterpriseId: "co_01ARZ3NDEKTSV4RRFFQ69G5CBV",
          tenantId: TENANT_ID,
          entityGroupId: GROUP_ID,
          entityGroupEnterpriseId: "entgrp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
          slug: "company-b",
          legalName: "Company B Pty Ltd",
          displayName: "Company B",
          registrationNumber: "B-001",
          taxId: null,
          baseCurrency: "AUD",
          countryCode: "AU",
          companyType: "subsidiary",
          fiscalCalendarId: null,
          effectiveFrom: null,
          effectiveTo: null,
          status: "active",
        };
      }
      return null;
    });

    const result = await resolveAllowedContextOptions({
      actorUserId: ACTOR_ID,
      memberships: [entityGroupMembership],
      selectedCompanySlug: "company-a",
      selectedOrganizationSlug: null,
      tenantId: TENANT_ID,
    });

    expect(result.targets).toHaveLength(2);
    expect(result.targets.map((target) => target.companySlug).sort()).toEqual([
      "company-a",
      "company-b",
    ]);
    expect(
      result.targets.find((target) => target.companySlug === "company-a")
        ?.isSelected
    ).toBe(true);
  });
});
