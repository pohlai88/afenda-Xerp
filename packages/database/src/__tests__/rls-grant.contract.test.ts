import { describe, expect, it } from "vitest";

import {
  DEFAULT_RLS_GRANT_ELEVATION_FLAGS,
  membershipMatchesGrantScope,
  resolveRlsGrantScope,
  resolveRlsGrantScopeType,
  toRlsFilterContext,
} from "../rls/rls-grant.contract.js";

const TENANT_ID = "tenant-001";
const COMPANY_A = "company-a";
const COMPANY_B = "company-b";
const ORG_A = "org-a";
const MEMBERSHIP_ID = "membership-001";
const ROLE_ID = "role-001";

describe("rls grant contract", () => {
  it("defines all multi-tenancy.md grant scope tiers", () => {
    expect(resolveRlsGrantScopeType({
      roleScope: "platform",
      membership: {
        scopeType: "tenant",
        companyId: null,
        organizationId: null,
        tenantId: TENANT_ID,
        membershipId: MEMBERSHIP_ID,
        roleId: ROLE_ID,
      },
    })).toBe("platform");
  });

  it("fail closed: tenant grant does not cover company or organization context", () => {
    const tenantMembership = {
      scopeType: "tenant" as const,
      companyId: null,
      organizationId: null,
    };

    expect(
      membershipMatchesGrantScope(tenantMembership, {
        companyId: null,
        organizationId: null,
      })
    ).toBe(true);

    expect(
      membershipMatchesGrantScope(tenantMembership, {
        companyId: COMPANY_A,
        organizationId: null,
      })
    ).toBe(false);

    expect(
      membershipMatchesGrantScope(tenantMembership, {
        companyId: COMPANY_A,
        organizationId: ORG_A,
      })
    ).toBe(false);
  });

  it("legal entity grant does not cover sibling companies", () => {
    const companyMembership = {
      scopeType: "company" as const,
      companyId: COMPANY_A,
      organizationId: null,
    };

    expect(
      membershipMatchesGrantScope(companyMembership, {
        companyId: COMPANY_A,
        organizationId: ORG_A,
      })
    ).toBe(true);

    expect(
      membershipMatchesGrantScope(companyMembership, {
        companyId: COMPANY_B,
        organizationId: null,
      })
    ).toBe(false);
  });

  it("organization grant requires exact company and organization unit", () => {
    const orgMembership = {
      scopeType: "organization" as const,
      companyId: COMPANY_A,
      organizationId: ORG_A,
    };

    expect(
      membershipMatchesGrantScope(orgMembership, {
        companyId: COMPANY_A,
        organizationId: ORG_A,
      })
    ).toBe(true);

    expect(
      membershipMatchesGrantScope(orgMembership, {
        companyId: COMPANY_A,
        organizationId: null,
      })
    ).toBe(false);
  });

  it("resolves grant scope for permission checks with RLS filter dimensions", () => {
    const resolved = resolveRlsGrantScope({
      roleScope: "company",
      entityGroupId: "group-001",
      membership: {
        scopeType: "company",
        tenantId: TENANT_ID,
        companyId: COMPANY_A,
        organizationId: null,
        membershipId: MEMBERSHIP_ID,
        roleId: ROLE_ID,
      },
      organizationUnitId: ORG_A,
    });

    expect(resolved.grantScopeType).toBe("company");
    expect(resolved.elevations).toEqual(DEFAULT_RLS_GRANT_ELEVATION_FLAGS);
    expect(toRlsFilterContext(resolved)).toEqual({
      tenantId: TENANT_ID,
      legalEntityId: COMPANY_A,
      entityGroupId: "group-001",
      organizationUnitId: ORG_A,
    });
  });

  it("marks platform admin elevation explicitly", () => {
    const resolved = resolveRlsGrantScope({
      roleScope: "platform",
      membership: {
        scopeType: "tenant",
        tenantId: TENANT_ID,
        companyId: null,
        organizationId: null,
        membershipId: MEMBERSHIP_ID,
        roleId: ROLE_ID,
      },
    });

    expect(resolved.grantScopeType).toBe("platform");
    expect(resolved.elevations.platformAdmin).toBe(true);
    expect(resolved.elevations.crossCompany).toBe(false);
  });
});
