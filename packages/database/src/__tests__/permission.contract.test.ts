import { describe, expect, it } from "vitest";
import {
  buildPermissionInsertRow,
  buildPermissionUpdatePatch,
  PermissionKeyImmutableError,
} from "../permission/permission.contract.js";
import { createPermissionKey } from "../permission-key.contract.js";

describe("permission contract", () => {
  it("builds governed catalog rows from permission keys", () => {
    const row = buildPermissionInsertRow({
      key: " system_admin.users_manage ",
      name: " Manage Users ",
      description: " System admin user management ",
    });

    expect(row).toEqual({
      key: "system_admin.users_manage",
      name: "Manage Users",
      description: "System admin user management",
      domain: "system_admin",
      action: "users_manage",
    });
  });

  it("blocks immutable key updates", () => {
    expect(() =>
      buildPermissionUpdatePatch({
        key: createPermissionKey("hr", "employee_read"),
        name: "Updated",
      } as never)
    ).toThrow(PermissionKeyImmutableError);
  });
});
