import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyPersistenceLookup,
  formatMultiTenancyPersistenceLookupViolations,
} from "../check-multi-tenancy-persistence-lookup.mts";
import {
  MULTI_TENANCY_DOC_PERSISTENCE_LOOKUP_MARKERS,
  MULTI_TENANCY_FOUNDATION_TABLE_ROW_MARKERS,
  MULTI_TENANCY_INDEX_ROW_MARKERS,
  MULTI_TENANCY_PERSISTENCE_LOOKUP_DIMENSIONS,
  MULTI_TENANCY_PERSISTENCE_LOOKUP_SURFACE_RULE,
} from "../multi-tenancy-persistence-lookup-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-persistence-lookup script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyPersistenceLookup();
    expect(
      violations,
      formatMultiTenancyPersistenceLookupViolations(violations)
    ).toEqual([]);
  });

  it("documents Step 5 markers from multi-tenancy.md §538–551", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_PERSISTENCE_LOOKUP_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines four Step 5 persistence dimensions", () => {
    expect(MULTI_TENANCY_PERSISTENCE_LOOKUP_DIMENSIONS).toHaveLength(4);
  });

  it("requires foundation table and index row markers", () => {
    expect(MULTI_TENANCY_FOUNDATION_TABLE_ROW_MARKERS).toHaveLength(6);
    expect(MULTI_TENANCY_INDEX_ROW_MARKERS.length).toBeGreaterThanOrEqual(9);
  });

  it("exports the persistence lookup surface rule", () => {
    expect(MULTI_TENANCY_PERSISTENCE_LOOKUP_SURFACE_RULE).toBe(
      "multi-tenancy-persistence-lookup-is-canonical-foundation-storage-baseline"
    );
  });
});
