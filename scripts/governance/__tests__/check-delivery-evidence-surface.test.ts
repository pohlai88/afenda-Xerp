import { describe, expect, it } from "vitest";

import {
  checkDeliveryEvidenceSurface,
  formatDeliveryEvidenceViolations,
} from "../check-delivery-evidence-surface.mts";
import {
  DELIVERY_EVIDENCE_SURFACE_RULE,
  GOVERNANCE_DIST_BUILD_SCRIPT,
  GOVERNANCE_DIST_PACKAGES,
  MULTI_TENANCY_GOVERNANCE_GATES,
  TIP_007_012_ACCEPTANCE_CHECKLIST,
  TIP_007_012_FORBIDDEN_OVERCLAIM_PATTERNS,
  TIP_007_012_REQUIRED_DISCLAIMERS,
  TIP_007_012_REQUIRED_SECTIONS,
} from "../delivery-evidence-surface-registry.mts";

describe("delivery-evidence-surface-registry", () => {
  it("defines the canonical surface rule", () => {
    expect(DELIVERY_EVIDENCE_SURFACE_RULE).toBe(
      "tip-007-012-doc-is-canonical-delivery-evidence-for-multi-tenancy-foundation"
    );
  });

  it("lists all multi-tenancy governance gates including delivery evidence", () => {
    const checkScripts = MULTI_TENANCY_GOVERNANCE_GATES.map((gate) => gate.checkScript);

    expect(checkScripts).toContain("check:delivery-evidence-surface");
    expect(checkScripts).toContain("check:multi-tenancy-dos-prohibitions");
    expect(checkScripts).toHaveLength(10);
  });

  it("requires twenty-one delivery doc sections", () => {
    expect(TIP_007_012_REQUIRED_SECTIONS).toHaveLength(21);
  });

  it("requires seventeen acceptance checklist items", () => {
    expect(TIP_007_012_ACCEPTANCE_CHECKLIST).toHaveLength(17);
  });

  it("defines dist build script and governed packages", () => {
    expect(GOVERNANCE_DIST_BUILD_SCRIPT).toBe("build:governance-dist");
    expect(GOVERNANCE_DIST_PACKAGES).toHaveLength(6);
  });

  it("defines scope disclaimers and overclaim guards", () => {
    expect(TIP_007_012_REQUIRED_DISCLAIMERS.length).toBeGreaterThanOrEqual(3);
    expect(TIP_007_012_FORBIDDEN_OVERCLAIM_PATTERNS.length).toBeGreaterThanOrEqual(4);
  });
});

describe("check-delivery-evidence-surface", () => {
  it("passes on the current repository state", () => {
    const violations = checkDeliveryEvidenceSurface();

    expect(violations, formatDeliveryEvidenceViolations(violations)).toEqual([]);
  });
});
