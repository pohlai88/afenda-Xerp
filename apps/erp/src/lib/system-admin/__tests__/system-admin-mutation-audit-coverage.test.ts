import { describe, expect, it } from "vitest";

import {
  SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES,
  SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE,
  SYSTEM_ADMIN_OBSERVABILITY_REGISTRY_PARITY_TEST,
  SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES,
  SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES,
} from "../system-admin-mutation-audit.registry";

describe("system-admin-mutation-audit-coverage", () => {
  it("declares the governed surface rule", () => {
    expect(SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE).toBe(
      "system-admin-governed-mutations-emit-audit-evidence"
    );
  });

  it("tracks canonical internal v1 system-admin mutation operation ids", () => {
    expect(
      SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES.map((entry) => entry.id)
    ).toEqual([
      "internal.v1.system-admin.user-invitations.post",
      "internal.v1.system-admin.membership-role-assignments.post",
    ]);
  });

  it("keeps server-action and supplementary audit ids for registry parity", () => {
    expect(
      SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES.length
    ).toBeGreaterThan(0);
    expect(
      SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES.length
    ).toBeGreaterThan(0);
  });

  it("points observability parity at this coverage suite", () => {
    expect(SYSTEM_ADMIN_OBSERVABILITY_REGISTRY_PARITY_TEST).toContain(
      "system-admin-mutation-audit-coverage.test.ts"
    );
  });
});
