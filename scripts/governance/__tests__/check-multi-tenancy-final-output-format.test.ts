import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  checkMultiTenancyFinalOutputFormat,
  formatMultiTenancyFinalOutputFormatViolations,
} from "../check-multi-tenancy-final-output-format.mts";
import {
  MULTI_TENANCY_DOC_FINAL_OUTPUT_MARKERS,
  MULTI_TENANCY_FINAL_OUTPUT_FORMAT_SURFACE_RULE,
  MULTI_TENANCY_FINAL_OUTPUT_SECTIONS,
  MULTI_TENANCY_FINAL_SCORE_DIMENSIONS,
} from "../multi-tenancy-final-output-format-registry.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-multi-tenancy-final-output-format script", () => {
  it("passes on the current repository state", () => {
    const violations = checkMultiTenancyFinalOutputFormat();
    expect(
      violations,
      formatMultiTenancyFinalOutputFormatViolations(violations)
    ).toEqual([]);
  });

  it("documents final output markers from multi-tenancy.md §686–718", () => {
    const multiTenancyDoc = readFileSync(
      join(repoRoot, "docs/architecture/multi-tenancy.md"),
      "utf8"
    );

    for (const marker of MULTI_TENANCY_DOC_FINAL_OUTPUT_MARKERS) {
      expect(multiTenancyDoc).toContain(marker);
    }
  });

  it("defines twenty required delivery sections", () => {
    expect(MULTI_TENANCY_FINAL_OUTPUT_SECTIONS).toHaveLength(20);
  });

  it("defines nine final score dimensions", () => {
    expect(MULTI_TENANCY_FINAL_SCORE_DIMENSIONS).toHaveLength(9);
  });

  it("exports the final output format surface rule", () => {
    expect(MULTI_TENANCY_FINAL_OUTPUT_FORMAT_SURFACE_RULE).toBe(
      "multi-tenancy-final-output-format-is-canonical-delivery-doc-shape"
    );
  });
});
