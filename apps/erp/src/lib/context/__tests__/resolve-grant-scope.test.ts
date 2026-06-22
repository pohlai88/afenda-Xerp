import { describe, expect, it, vi } from "vitest";

import { resolveGrantScope } from "@/lib/context/resolve-grant-scope.server";
import type { MembershipContract } from "@afenda/permissions";

const TENANT_ID = "tenant-001";
const COMPANY_ID = "company-001";
const ORG_ID = "org-001";
const ACTOR_ID = "user-001";

const companyMembership: MembershipContract = {
  id: "membership-001",
  tenantId: TENANT_ID,
  companyId: COMPANY_ID,
  organizationId: null,
  userId: ACTOR_ID,
  roleId: "role-001",
  scopeType: "company",
  status: "active",
};

const organizationMembership: MembershipContract = {
  ...companyMembership,
  id: "membership-002",
  scopeType: "organization",
  organizationId: ORG_ID,
};

vi.mock("@afenda/permissions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/permissions")>();
  return {
    ...actual,
    createProductionAuthorizationDataSources: vi.fn(() => ({
      permission: {
        getRole: vi.fn().mockResolvedValue({
          id: "role-001",
          key: "organization.admin",
          name: "Organization Admin",
          description: null,
          scope: "organization",
          status: "active",
          tenantId: TENANT_ID,
        }),
      },
      policy: {},
    })),
  };
});

describe("resolveGrantScope", () => {
  it("resolves company-scoped permission context", async () => {
    const result = await resolveGrantScope({
      actorUserId: ACTOR_ID,
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationId: null,
      memberships: [companyMembership],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.permissionScope.grantScopeType).toBe("company");
      expect(result.value.permissionScope.companyId).toBe(COMPANY_ID);
    }
  });

  it("selects narrowest organization membership when org is selected", async () => {
    const result = await resolveGrantScope({
      actorUserId: ACTOR_ID,
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationId: ORG_ID,
      memberships: [companyMembership, organizationMembership],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.permissionScope.grantScopeType).toBe("organization");
      expect(result.value.permissionScope.organizationId).toBe(ORG_ID);
    }
  });

  it("denies when no membership matches workspace scope", async () => {
    const result = await resolveGrantScope({
      actorUserId: ACTOR_ID,
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationId: ORG_ID,
      memberships: [],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MEMBERSHIP_DENIED");
    }
  });
});
