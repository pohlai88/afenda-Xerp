import { describe, expect, it } from "vitest";

import { getPackageName, PACKAGE_NAME, PERMISSION_REGISTRY } from "../index";

describe("@afenda/permissions package exports", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/permissions");
    expect(getPackageName()).toBe("@afenda/permissions");
  });

  it("exports governed permission registry keys", () => {
    expect(PERMISSION_REGISTRY.systemAdmin.users.manage).toBe(
      "system_admin.users_manage"
    );
    expect(PERMISSION_REGISTRY.accounting.journal.post).toBe(
      "accounting.journal_post"
    );
  });
});
