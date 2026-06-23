import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyTestingVerificationAcceptance,
  formatMultiTenancyTestingVerificationAcceptanceViolations,
} from "../check-multi-tenancy-testing-verification-acceptance.mts";
import {
  MULTI_TENANCY_DOC_TESTING_VERIFICATION_MARKERS,
  MULTI_TENANCY_TESTING_ACCEPTANCE_REQUIREMENTS,
  MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_SURFACE_RULE,
  MULTI_TENANCY_TESTING_VERIFICATION_DIMENSIONS,
  MULTI_TENANCY_VERIFICATION_ACCEPTANCE_REQUIREMENTS,
} from "../multi-tenancy-testing-verification-acceptance-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-testing-verification-acceptance script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyTestingVerificationAcceptance();
    expect(
      violations,
      formatMultiTenancyTestingVerificationAcceptanceViolations(violations)
    ).toEqual([]);
  });

  it("documents testing and verification acceptance markers from multi-tenancy.md §667–685", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_TESTING_VERIFICATION_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines eight testing acceptance requirements", () => {
    expect(MULTI_TENANCY_TESTING_ACCEPTANCE_REQUIREMENTS).toHaveLength(8);
  });

  it("defines four verification acceptance CI commands", () => {
    expect(MULTI_TENANCY_VERIFICATION_ACCEPTANCE_REQUIREMENTS).toHaveLength(4);
  });

  it("defines three testing and verification acceptance dimensions", () => {
    expect(MULTI_TENANCY_TESTING_VERIFICATION_DIMENSIONS).toHaveLength(3);
  });

  it("exports the testing and verification acceptance surface rule", () => {
    expect(MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_SURFACE_RULE).toBe(
      "multi-tenancy-testing-verification-acceptance-is-canonical-slice-signoff-matrix"
    );
  });
});
