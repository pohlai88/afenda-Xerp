import { describe, expect, it } from "vitest";

import {
  checkLegacyDeliveryTerminology,
  formatLegacyDeliveryTerminologyViolations,
} from "../check-legacy-delivery-terminology.mts";
import {
  LEGACY_DELIVERY_TERMINOLOGY_PATTERNS,
  LEGACY_DELIVERY_TERMINOLOGY_SKIP_PATH_PREFIXES,
  LEGACY_DELIVERY_TERMINOLOGY_SURFACE_RULE,
} from "../legacy-delivery-terminology-registry.mts";

describe("legacy-delivery-terminology-registry", () => {
  it("defines the canonical surface rule", () => {
    expect(LEGACY_DELIVERY_TERMINOLOGY_SURFACE_RULE).toBe(
      "legacy-delivery-terminology-guard-blocks-fdr-tip-in-active-surfaces"
    );
  });

  it("excludes ADR historical evidence from scanning", () => {
    expect(LEGACY_DELIVERY_TERMINOLOGY_SKIP_PATH_PREFIXES).toContain(
      "docs/adr/"
    );
  });

  it("registers core retired delivery patterns", () => {
    const ids = LEGACY_DELIVERY_TERMINOLOGY_PATTERNS.map((entry) => entry.id);

    expect(ids).toEqual(
      expect.arrayContaining([
        "fdr-word",
        "fdr-id",
        "tip-id",
        "tip-ui-id",
        "pas-status-index",
        "pas-status-index",
        "pas-slice-planner",
        "afenda-orchestrator",
        "fdr-slice-agent",
        "afenda-batch",
        "tip-004-policy",
      ])
    );
    expect(ids).toHaveLength(11);
  });
});

describe("check-legacy-delivery-terminology", () => {
  it("passes on the current repository state", () => {
    const violations = checkLegacyDeliveryTerminology();

    expect(
      violations,
      formatLegacyDeliveryTerminologyViolations(violations)
    ).toEqual([]);
  });
});
