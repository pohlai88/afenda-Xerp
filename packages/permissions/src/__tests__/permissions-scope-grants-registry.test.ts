import { describe, expect, it } from "vitest";

import {
  PERMISSIONS_BARREL_DEPENDENCY_RULE,
  PERMISSIONS_IMPLEMENTED_MEMBERSHIP_SCOPES,
  PERMISSIONS_PLANNED_MEMBERSHIP_SCOPES,
  PERMISSIONS_SCOPE_GRANTS_BARREL_DIRECTORIES,
  PERMISSIONS_SCOPE_GRANTS_MODULES,
} from "../permissions-scope-grants-registry.js";

describe("permissions-scope-grants-registry", () => {
  it("declares scope and grants as canonical barrels", () => {
    expect(PERMISSIONS_SCOPE_GRANTS_BARREL_DIRECTORIES).toEqual([
      "scope",
      "grants",
    ]);
    expect(PERMISSIONS_SCOPE_GRANTS_MODULES).toHaveLength(2);
    expect(PERMISSIONS_SCOPE_GRANTS_MODULES.map((module) => module.directory)).toEqual(
      ["scope", "grants"]
    );
  });

  it("documents implemented and planned membership scopes", () => {
    expect(PERMISSIONS_IMPLEMENTED_MEMBERSHIP_SCOPES).toEqual([
      "tenant",
      "company",
      "organization",
    ]);
    expect(PERMISSIONS_PLANNED_MEMBERSHIP_SCOPES.map((entry) => entry.scopeType)).toEqual(
      ["entity_group", "project"]
    );
  });

  it("enforces one-way barrel dependency", () => {
    expect(PERMISSIONS_BARREL_DEPENDENCY_RULE).toBe(
      "grants-may-import-scope; scope-must-not-import-grants"
    );
  });
});
