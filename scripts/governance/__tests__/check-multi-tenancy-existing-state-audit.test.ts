import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyExistingStateAudit,
  formatMultiTenancyExistingStateAuditViolations,
} from "../check-multi-tenancy-existing-state-audit.mts";
import {
  MULTI_TENANCY_DOC_EXISTING_STATE_AUDIT_MARKERS,
  MULTI_TENANCY_EXISTING_STATE_AUDIT_DIMENSIONS,
  MULTI_TENANCY_EXISTING_STATE_AUDIT_SURFACE_RULE,
  MULTI_TENANCY_KERNEL_CONTEXT_AUDIT_ROW_MARKERS,
  MULTI_TENANCY_SCHEMA_AUDIT_ROW_MARKERS,
} from "../multi-tenancy-existing-state-audit-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-existing-state-audit script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyExistingStateAudit();
    expect(
      violations,
      formatMultiTenancyExistingStateAuditViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 2 markers from multi-tenancy.md §502–511", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_EXISTING_STATE_AUDIT_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines six Step 2 audit dimensions", () => {
    expect(MULTI_TENANCY_EXISTING_STATE_AUDIT_DIMENSIONS).toHaveLength(6);
  });

  it("requires schema and kernel baseline row markers", () => {
    expect(MULTI_TENANCY_SCHEMA_AUDIT_ROW_MARKERS.length).toBeGreaterThanOrEqual(7);
    expect(MULTI_TENANCY_KERNEL_CONTEXT_AUDIT_ROW_MARKERS).toHaveLength(10);
  });

  it("exports the existing-state audit surface rule", () => {
    expect(MULTI_TENANCY_EXISTING_STATE_AUDIT_SURFACE_RULE).toBe(
      "multi-tenancy-existing-state-audit-is-canonical-pre-modification-baseline"
    );
  });
});
