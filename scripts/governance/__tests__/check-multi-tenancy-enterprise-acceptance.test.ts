import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyEnterpriseAcceptance,
  formatMultiTenancyEnterpriseAcceptanceViolations,
} from "../check-multi-tenancy-enterprise-acceptance.mts";
import {
  MULTI_TENANCY_DOC_ENTERPRISE_ACCEPTANCE_MARKERS,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_CRITERIA,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_DIMENSIONS,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SURFACE_RULE,
} from "../multi-tenancy-enterprise-acceptance-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-enterprise-acceptance script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyEnterpriseAcceptance();
    expect(
      violations,
      formatMultiTenancyEnterpriseAcceptanceViolations(violations)
    ).toEqual([]);
  });

  it("documents enterprise acceptance markers from multi-tenancy.md §612–666", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_ENTERPRISE_ACCEPTANCE_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines 38 enterprise acceptance criteria", () => {
    expect(MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_CRITERIA).toHaveLength(38);
  });

  it("defines five enterprise acceptance category dimensions", () => {
    expect(MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_DIMENSIONS).toHaveLength(5);
  });

  it("exports the enterprise acceptance surface rule", () => {
    expect(MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SURFACE_RULE).toBe(
      "multi-tenancy-enterprise-acceptance-is-canonical-slice-completion-matrix"
    );
  });
});
