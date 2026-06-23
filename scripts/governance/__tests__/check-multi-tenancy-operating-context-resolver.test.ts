import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyOperatingContextResolver,
  formatMultiTenancyOperatingContextResolverViolations,
} from "../check-multi-tenancy-operating-context-resolver.mts";
import {
  MULTI_TENANCY_DOC_OPERATING_CONTEXT_RESOLVER_MARKERS,
  MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_DIMENSIONS,
  MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_SURFACE_RULE,
  OPERATING_CONTEXT_RESOLVER_PIPELINE,
} from "../multi-tenancy-operating-context-resolver-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-operating-context-resolver script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyOperatingContextResolver();
    expect(
      violations,
      formatMultiTenancyOperatingContextResolverViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 7 markers from multi-tenancy.md §561–571", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_OPERATING_CONTEXT_RESOLVER_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines eight Step 7 resolution pipeline steps", () => {
    expect(OPERATING_CONTEXT_RESOLVER_PIPELINE).toHaveLength(8);
  });

  it("defines four Step 7 operating context resolver dimensions", () => {
    expect(MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_DIMENSIONS).toHaveLength(4);
  });

  it("exports the operating context resolver surface rule", () => {
    expect(MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_SURFACE_RULE).toBe(
      "multi-tenancy-operating-context-resolver-is-canonical-fail-closed-server-assembly"
    );
  });
});
