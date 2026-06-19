import { describe, expect, it } from "vitest";

import { assertPermissionKey } from "../permission-key.contract.js";
import { PLATFORM_PERMISSION_CATALOG } from "../seeds/platform-permissions.catalog.js";
import { PLATFORM_POLICY_CATALOG } from "../seeds/platform-policies.catalog.js";
import { PLATFORM_ROLE_CATALOG } from "../seeds/platform-roles.catalog.js";
import {
  DEMO_WORKSPACE_FIXTURE,
  DEV_WORKSPACE_FIXTURE,
  PREVIEW_WORKSPACE_FIXTURE,
} from "../seeds/workspace-fixtures.js";

describe("seed catalogs", () => {
  it("defines unique platform permission keys", () => {
    const keys = PLATFORM_PERMISSION_CATALOG.map((entry) => entry.key);
    expect(new Set(keys).size).toBe(keys.length);

    for (const key of keys) {
      expect(assertPermissionKey(key)).toBe(key);
    }
  });

  it("references only catalog permissions from platform roles", () => {
    const catalogKeys = new Set(
      PLATFORM_PERMISSION_CATALOG.map((entry) => entry.key)
    );

    for (const role of PLATFORM_ROLE_CATALOG) {
      for (const permissionKey of role.permissionKeys) {
        expect(catalogKeys.has(permissionKey)).toBe(true);
      }
    }
  });

  it("defines valid platform policy templates", () => {
    expect(PLATFORM_POLICY_CATALOG.length).toBeGreaterThan(0);

    for (const policy of PLATFORM_POLICY_CATALOG) {
      expect(policy.scope).toBe("platform");
      expect(policy.tenantId).toBeNull();
      expect(policy.condition.version).toBe(1);
    }
  });

  it("uses localhost fixture emails only", () => {
    for (const fixture of [
      DEV_WORKSPACE_FIXTURE,
      PREVIEW_WORKSPACE_FIXTURE,
      DEMO_WORKSPACE_FIXTURE,
    ]) {
      expect(fixture.user.email.endsWith("@localhost.afenda")).toBe(true);
    }
  });
});
