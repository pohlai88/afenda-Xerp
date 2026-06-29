import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyContextContracts,
  formatMultiTenancyContextContractsViolations,
} from "../check-multi-tenancy-context-contracts.mts";
import {
  MULTI_TENANCY_CONTEXT_CONTRACTS_DIMENSIONS,
  MULTI_TENANCY_CONTEXT_CONTRACTS_SURFACE_RULE,
  MULTI_TENANCY_DOC_CONTEXT_CONTRACTS_MARKERS,
  MULTI_TENANCY_STEP4_PRIMARY_TYPES,
} from "../multi-tenancy-context-contracts-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-context-contracts script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyContextContracts();
    expect(
      violations,
      formatMultiTenancyContextContractsViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 4 markers from multi-tenancy.md §522–536", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_CONTEXT_CONTRACTS_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines ten Step 4 primary context contract types", () => {
    expect(MULTI_TENANCY_STEP4_PRIMARY_TYPES).toHaveLength(10);
  });

  it("defines four Step 4 context contract dimensions", () => {
    expect(MULTI_TENANCY_CONTEXT_CONTRACTS_DIMENSIONS).toHaveLength(4);
  });

  it("exports the context contracts surface rule", () => {
    expect(MULTI_TENANCY_CONTEXT_CONTRACTS_SURFACE_RULE).toBe(
      "multi-tenancy-context-contracts-are-canonical-serializable-kernel-boundary"
    );
  });
});
