import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = join(import.meta.dirname, "..");

describe("@afenda/permissions package structure", () => {
  it("aligns scope resolution with multi-tenancy architecture", () => {
    for (const moduleName of [
      "scope/membership.contract.ts",
      "scope/role-scope.contract.ts",
      "scope/grant-scope-resolution.ts",
      "scope/membership-resolution.ts",
      "scope/index.ts",
    ]) {
      expect(existsSync(join(packageRoot, moduleName))).toBe(true);
    }
  });

  it("aligns grant enforcement with multi-tenancy architecture", () => {
    for (const moduleName of [
      "grants/permission.contract.ts",
      "grants/permission-checker.ts",
      "grants/role.contract.ts",
      "grants/index.ts",
    ]) {
      expect(existsSync(join(packageRoot, moduleName))).toBe(true);
    }
  });

  it("does not retain flat scope/grant modules at package root", () => {
    for (const legacyModule of [
      "membership.contract.ts",
      "grant-scope-resolution.ts",
      "membership-resolution.ts",
      "permission.contract.ts",
      "permission-checker.ts",
      "role.contract.ts",
    ]) {
      expect(existsSync(join(packageRoot, legacyModule))).toBe(false);
    }
  });
});
