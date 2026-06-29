import { describe, expect, it } from "vitest";

import {
  checkKnowledgeLegacySurfaceRetirement,
  formatKnowledgeLegacySurfaceRetirementViolations,
  KNOWLEDGE_LEGACY_SURFACE_RETIREMENT_RULE,
} from "../check-knowledge-legacy-surface-retirement.mts";

describe("check-knowledge-legacy-surface-retirement", () => {
  it("passes on the current repository state", () => {
    const violations = checkKnowledgeLegacySurfaceRetirement();
    expect(
      violations,
      formatKnowledgeLegacySurfaceRetirementViolations(violations)
    ).toEqual([]);
  });

  it("exports the legacy surface retirement rule", () => {
    expect(KNOWLEDGE_LEGACY_SURFACE_RETIREMENT_RULE).toBe(
      "knowledge-legacy-surface-retirement-strips-implementationMapping-at-loader-boundary"
    );
  });
});
