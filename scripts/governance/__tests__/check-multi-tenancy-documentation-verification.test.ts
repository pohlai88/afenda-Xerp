import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyDocumentationVerification,
  formatMultiTenancyDocumentationVerificationViolations,
} from "../check-multi-tenancy-documentation-verification.mts";
import {
  MULTI_TENANCY_DOC_DOCUMENTATION_VERIFICATION_MARKERS,
  MULTI_TENANCY_DOCUMENTATION_VERIFICATION_DIMENSIONS,
  MULTI_TENANCY_DOCUMENTATION_VERIFICATION_SURFACE_RULE,
  MULTI_TENANCY_VERIFICATION_COMMANDS,
} from "../multi-tenancy-documentation-verification-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-documentation-verification script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyDocumentationVerification();
    expect(
      violations,
      formatMultiTenancyDocumentationVerificationViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 10 markers from multi-tenancy.md §601–611", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_DOCUMENTATION_VERIFICATION_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines four Step 10 canonical verification commands", () => {
    expect(MULTI_TENANCY_VERIFICATION_COMMANDS).toHaveLength(4);
  });

  it("defines two Step 10 documentation verification dimensions", () => {
    expect(MULTI_TENANCY_DOCUMENTATION_VERIFICATION_DIMENSIONS).toHaveLength(2);
  });

  it("exports the documentation verification surface rule", () => {
    expect(MULTI_TENANCY_DOCUMENTATION_VERIFICATION_SURFACE_RULE).toBe(
      "multi-tenancy-documentation-verification-is-canonical-step-10-delivery-and-ci-chain"
    );
  });
});
