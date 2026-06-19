import { describe, expect, it } from "vitest";

import {
  assertRoleKey,
  assertRoleScopeMatchesTenant,
  buildRoleInsertRow,
  buildRoleUpdatePatch,
  InvalidRoleKeyError,
  RoleKeyImmutableError,
  RoleScopeTenantMismatchError,
} from "../role/role.contract.js";

describe("role contract", () => {
  it("accepts canonical dot-case role keys", () => {
    expect(assertRoleKey("system_admin.users.manager")).toBe(
      "system_admin.users.manager"
    );
    expect(assertRoleKey(" finance.approver ")).toBe("finance.approver");
  });

  it("rejects raw display names and invalid keys", () => {
    expect(() => assertRoleKey("Admin User")).toThrow(InvalidRoleKeyError);
    expect(() => assertRoleKey("tenant_admin")).toThrow(InvalidRoleKeyError);
    expect(() => assertRoleKey("Finance Approver")).toThrow(
      InvalidRoleKeyError
    );
  });

  it("enforces scope and tenantId alignment", () => {
    expect(() =>
      assertRoleScopeMatchesTenant("platform", "tenant-001")
    ).toThrow(RoleScopeTenantMismatchError);
    expect(() => assertRoleScopeMatchesTenant("tenant", null)).toThrow(
      RoleScopeTenantMismatchError
    );
    expect(() => assertRoleScopeMatchesTenant("company", null)).toThrow(
      RoleScopeTenantMismatchError
    );
  });

  it("builds governed insert rows", () => {
    const row = buildRoleInsertRow({
      tenantId: "tenant-001",
      key: " hr.employee.viewer ",
      name: " HR Viewer ",
      scope: "company",
    });

    expect(row).toEqual({
      tenantId: "tenant-001",
      key: "hr.employee.viewer",
      name: "HR Viewer",
      description: null,
      scope: "company",
      status: "active",
    });
  });

  it("blocks immutable field updates", () => {
    expect(() =>
      buildRoleUpdatePatch({
        key: "new.key",
        name: "Updated",
      } as never)
    ).toThrow(RoleKeyImmutableError);
  });
});
