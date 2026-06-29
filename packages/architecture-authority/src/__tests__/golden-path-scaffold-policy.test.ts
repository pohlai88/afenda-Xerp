import { describe, expect, it } from "vitest";

import {
  GOLDEN_PATH_SCAFFOLD_POLICY_MARKERS,
  validateGoldenPathScaffoldPolicy,
} from "../validators/validate-golden-path-scaffold-policy.js";

describe("@afenda/architecture-authority golden-path scaffold policy (PAS-002 B45)", () => {
  it("declares scaffold policy markers for CI enforcement", () => {
    expect(GOLDEN_PATH_SCAFFOLD_POLICY_MARKERS.length).toBeGreaterThanOrEqual(
      5
    );
    expect(GOLDEN_PATH_SCAFFOLD_POLICY_MARKERS).toContain(
      "package-registry.data.ts"
    );
  });

  it("passes golden-path scaffold policy validation", () => {
    const result = validateGoldenPathScaffoldPolicy();
    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });
});
