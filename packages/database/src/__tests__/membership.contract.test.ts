import { describe, expect, it } from "vitest";

import {
  assertMembershipScopeShape,
  assertRoleMatchesMembershipScope,
  buildMembershipInsertRow,
  buildMembershipScopeKey,
  MembershipRoleScopeError,
  MembershipScopeValidationError,
} from "../membership/membership.contract.js";

describe("membership contract", () => {
  it("builds tenant-scoped membership rows", () => {
    const row = buildMembershipInsertRow({
      tenantId: "00000000-0000-4000-8000-000000000001",
      userId: "00000000-0000-4000-8000-000000000002",
      roleId: "00000000-0000-4000-8000-000000000003",
      scopeType: "tenant",
    });

    expect(row.companyId).toBeNull();
    expect(row.organizationId).toBeNull();
    expect(row.scopeType).toBe("tenant");
  });

  it("requires company scope columns", () => {
    expect(() =>
      buildMembershipInsertRow({
        tenantId: "00000000-0000-4000-8000-000000000001",
        userId: "00000000-0000-4000-8000-000000000002",
        roleId: "00000000-0000-4000-8000-000000000003",
        scopeType: "company",
      })
    ).toThrow(MembershipScopeValidationError);
  });

  it("requires organization scope columns", () => {
    expect(() =>
      assertMembershipScopeShape("organization", "company-1", null)
    ).toThrow(MembershipScopeValidationError);
  });

  it("validates role scope against membership scope", () => {
    expect(() =>
      assertRoleMatchesMembershipScope("tenant", "organization")
    ).toThrow(MembershipRoleScopeError);

    expect(() =>
      assertRoleMatchesMembershipScope("company", "company")
    ).not.toThrow();
  });

  it("builds deterministic duplicate scope keys", () => {
    const key = buildMembershipScopeKey({
      userId: "user-1",
      tenantId: "tenant-1",
      scopeType: "company",
      companyId: "company-1",
      organizationId: null,
      roleId: "role-1",
    });

    expect(key).toBe("user-1:tenant-1:company:company-1::role-1");
  });
});
