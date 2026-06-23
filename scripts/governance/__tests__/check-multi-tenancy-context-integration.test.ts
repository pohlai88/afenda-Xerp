import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyContextIntegration,
  formatMultiTenancyContextIntegrationViolations,
} from "../check-multi-tenancy-context-integration.mts";
import {
  CONTEXT_INTEGRATION_WIRING,
  MULTI_TENANCY_CONTEXT_INTEGRATION_DIMENSIONS,
  MULTI_TENANCY_CONTEXT_INTEGRATION_SURFACE_RULE,
  MULTI_TENANCY_DOC_CONTEXT_INTEGRATION_MARKERS,
} from "../multi-tenancy-context-integration-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-context-integration script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyContextIntegration();
    expect(
      violations,
      formatMultiTenancyContextIntegrationViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 8 markers from multi-tenancy.md §572–579", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_CONTEXT_INTEGRATION_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines five Step 8 integration wiring steps", () => {
    expect(CONTEXT_INTEGRATION_WIRING).toHaveLength(5);
  });

  it("defines five Step 8 context integration dimensions", () => {
    expect(MULTI_TENANCY_CONTEXT_INTEGRATION_DIMENSIONS).toHaveLength(5);
  });

  it("exports the context integration surface rule", () => {
    expect(MULTI_TENANCY_CONTEXT_INTEGRATION_SURFACE_RULE).toBe(
      "multi-tenancy-context-integration-is-canonical-api-action-appshell-wiring"
    );
  });
});
