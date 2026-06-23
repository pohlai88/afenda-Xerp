import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyTests,
  formatMultiTenancyTestsViolations,
} from "../check-multi-tenancy-tests.mts";
import {
  MULTI_TENANCY_DOC_TESTS_MARKERS,
  MULTI_TENANCY_TESTS_DIMENSIONS,
  MULTI_TENANCY_TESTS_SURFACE_RULE,
  MULTI_TENANCY_TEST_REQUIREMENTS,
} from "../multi-tenancy-tests-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-tests script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyTests();
    expect(
      violations,
      formatMultiTenancyTestsViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 9 markers from multi-tenancy.md §580–599", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_TESTS_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines seventeen Step 9 test requirements", () => {
    expect(MULTI_TENANCY_TEST_REQUIREMENTS).toHaveLength(17);
  });

  it("defines five Step 9 test documentation dimensions", () => {
    expect(MULTI_TENANCY_TESTS_DIMENSIONS).toHaveLength(5);
  });

  it("exports the multi-tenancy tests surface rule", () => {
    expect(MULTI_TENANCY_TESTS_SURFACE_RULE).toBe(
      "multi-tenancy-tests-is-canonical-step-9-coverage-matrix"
    );
  });
});
