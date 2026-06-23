import { describe, expect, it } from "vitest";

import {
  APPSHELL_CONTEXT_CONSUMPTION_MODULES,
  APPSHELL_CONTEXT_SURFACE_RULE,
  APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES,
} from "../context/appshell-context-surface-registry.js";

describe("appshell-context-surface-registry", () => {
  it("declares consume-only context surface rule", () => {
    expect(APPSHELL_CONTEXT_SURFACE_RULE).toBe(
      "consume-context-only; never-resolve-tenant-or-database-authority"
    );
  });

  it("lists context consumption modules", () => {
    expect(APPSHELL_CONTEXT_CONSUMPTION_MODULES.length).toBeGreaterThanOrEqual(
      4
    );
    expect(
      APPSHELL_CONTEXT_CONSUMPTION_MODULES.some(
        (module) => module.path === "app-shell.types.ts"
      )
    ).toBe(true);
  });

  it("forbids authority packages", () => {
    expect(APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES).toContain(
      "@afenda/database"
    );
    expect(APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES).toContain(
      "@afenda/permissions"
    );
  });
});
