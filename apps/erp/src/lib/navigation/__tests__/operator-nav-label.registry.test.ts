import {
  buildVocabularyAllowlist,
  validateSurfaceStrings,
} from "@afenda/enterprise-knowledge";
import { describe, expect, it } from "vitest";

import { ALL_OPERATOR_NAV_LABEL_DEFINITIONS } from "../operator-nav-label.registry";

describe("operator-nav-label.registry", () => {
  it("links every operator nav label to the PAS-004E vocabulary allowlist", () => {
    const allowlist = buildVocabularyAllowlist();

    for (const definition of ALL_OPERATOR_NAV_LABEL_DEFINITIONS) {
      const violations = validateSurfaceStrings(
        allowlist,
        "operator-nav-label.registry.ts",
        `label: "${definition.label}",`
      );

      expect(violations).toEqual([]);
    }
  });
});
