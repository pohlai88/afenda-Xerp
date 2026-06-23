import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyAuthorityDesign,
  formatMultiTenancyAuthorityDesignViolations,
} from "../check-multi-tenancy-authority-design.mts";
import {
  MULTI_TENANCY_AUTHORITY_DESIGN_DIMENSIONS,
  MULTI_TENANCY_AUTHORITY_DESIGN_SURFACE_RULE,
  MULTI_TENANCY_DOC_AUTHORITY_DESIGN_MARKERS,
  MULTI_TENANCY_KERNEL_CONTRACT_ROW_MARKERS,
  MULTI_TENANCY_PACKAGE_OWNERSHIP_ROW_MARKERS,
} from "../multi-tenancy-authority-design-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-authority-design script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyAuthorityDesign();
    expect(
      violations,
      formatMultiTenancyAuthorityDesignViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 3 markers from multi-tenancy.md §503–509", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_AUTHORITY_DESIGN_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines five Step 3 authority dimensions", () => {
    expect(MULTI_TENANCY_AUTHORITY_DESIGN_DIMENSIONS).toHaveLength(5);
  });

  it("requires package ownership and kernel contract row markers", () => {
    expect(MULTI_TENANCY_PACKAGE_OWNERSHIP_ROW_MARKERS.length).toBeGreaterThanOrEqual(6);
    expect(MULTI_TENANCY_KERNEL_CONTRACT_ROW_MARKERS).toHaveLength(10);
  });

  it("exports the authority design surface rule", () => {
    expect(MULTI_TENANCY_AUTHORITY_DESIGN_SURFACE_RULE).toBe(
      "multi-tenancy-authority-design-is-canonical-package-boundary-confirmation"
    );
  });
});
