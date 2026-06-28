import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import { listPermissionRegistryEntries } from "../list-permission-registry-entries";
import { isSystemAdminSectionId } from "../system-admin-sections";

const DOMAIN_SEGMENT_PATTERN = /^[a-z0-9_]+$/;
const ACTION_SEGMENT_PATTERN = /^[a-z0-9_]+$/;

describe("listPermissionRegistryEntries (Foundation phase 13 Slice 2)", () => {
  it("returns every PERMISSION_REGISTRY leaf as domain, action, and key", () => {
    const entries = listPermissionRegistryEntries();

    expect(entries.length).toBeGreaterThan(0);

    for (const entry of entries) {
      expect(entry.domain).toMatch(DOMAIN_SEGMENT_PATTERN);
      expect(entry.action).toMatch(ACTION_SEGMENT_PATTERN);
      expect(entry.key).toBe(`${entry.domain}.${entry.action}`);
    }
  });

  it("includes known system admin permission keys", () => {
    const keys = listPermissionRegistryEntries().map((entry) => entry.key);

    expect(keys).toContain(PERMISSION_REGISTRY.systemAdmin.users.read);
    expect(keys).toContain(PERMISSION_REGISTRY.systemAdmin.roles.manage);
    expect(keys).toContain(PERMISSION_REGISTRY.systemAdmin.permissions.manage);
  });

  it("returns entries sorted by key", () => {
    const entries = listPermissionRegistryEntries();
    const keys = entries.map((entry) => entry.key);
    const sortedKeys = [...keys].sort((left, right) =>
      left.localeCompare(right)
    );

    expect(keys).toEqual(sortedKeys);
  });

  it("ignores unregistered string leaves in the registry tree", () => {
    const hasUnregisteredKey = listPermissionRegistryEntries().some(
      (entry) => entry.domain === "not" && entry.action === "a_registered_key"
    );

    expect(hasUnregisteredKey).toBe(false);
  });
});

describe("isSystemAdminSectionId", () => {
  it("accepts known section ids", () => {
    expect(isSystemAdminSectionId("users")).toBe(true);
    expect(isSystemAdminSectionId("memberships")).toBe(true);
    expect(isSystemAdminSectionId("roles")).toBe(true);
    expect(isSystemAdminSectionId("permissions")).toBe(true);
    expect(isSystemAdminSectionId("audit")).toBe(true);
    expect(isSystemAdminSectionId("settings")).toBe(true);
  });

  it("rejects unknown section ids", () => {
    expect(isSystemAdminSectionId("unknown-section")).toBe(false);
    expect(isSystemAdminSectionId("")).toBe(false);
  });
});
