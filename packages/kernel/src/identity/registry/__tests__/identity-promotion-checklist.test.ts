import { describe, expect, it } from "vitest";

import {
  getIdentityPromotionRequirement,
  IDENTITY_PROMOTION_PAS_CHECKLIST_STEPS,
  IDENTITY_PROMOTION_REQUIREMENT_IDS,
  IDENTITY_PROMOTION_REQUIREMENTS,
  type IdentityPromotionPasChecklistStep,
  type IdentityPromotionPasChecklistStepDefinition,
  KERNEL_IDENTITY_GOVERNANCE_BUNDLE,
  listIdentityPromotionRequirementsForPasStep,
} from "../id-family.registry.js";

describe("identity promotion checklist (PAS-001 §4.1.14)", () => {
  it("assigns pasChecklistStep to every requirement", () => {
    for (const id of IDENTITY_PROMOTION_REQUIREMENT_IDS) {
      expect(
        IDENTITY_PROMOTION_REQUIREMENTS[id].pasChecklistStep
      ).toBeGreaterThan(0);
      expect(IDENTITY_PROMOTION_REQUIREMENTS[id].pasChecklistStep).toBeLessThan(
        8
      );
    }
  });

  it("covers each PAS checklist step with at least one requirement", () => {
    const steps: IdentityPromotionPasChecklistStep[] = [1, 2, 3, 4, 5, 6, 7];
    for (const step of steps) {
      expect(
        listIdentityPromotionRequirementsForPasStep(step).length
      ).toBeGreaterThan(0);
    }
  });

  it("records governance bundle gate for step 4", () => {
    expect(
      IDENTITY_PROMOTION_REQUIREMENTS["kernel-identity-surface-gate"]
        .evidenceGate
    ).toBe(KERNEL_IDENTITY_GOVERNANCE_BUNDLE);
    expect(
      IDENTITY_PROMOTION_REQUIREMENTS["kernel-identity-surface-gate"]
        .evidenceGate
    ).toBe("check:kernel-identity-governance");
  });

  it("records no-unsafe-id-casts gate for step 6 ERP ingress", () => {
    expect(
      IDENTITY_PROMOTION_REQUIREMENTS["erp-parse-at-boundary"].evidenceGate
    ).toBe("check:no-unsafe-id-casts");
  });

  it("defines seven PAS checklist steps partitioning all thirteen requirements", () => {
    expect(IDENTITY_PROMOTION_PAS_CHECKLIST_STEPS).toHaveLength(7);

    const partitionedIds = IDENTITY_PROMOTION_PAS_CHECKLIST_STEPS.flatMap(
      (entry: IdentityPromotionPasChecklistStepDefinition) =>
        entry.requirementIds
    );
    expect(partitionedIds).toHaveLength(13);
    expect(new Set(partitionedIds).size).toBe(13);
    expect(partitionedIds.sort()).toEqual(
      [...IDENTITY_PROMOTION_REQUIREMENT_IDS].sort()
    );
  });

  it("throws for unknown promotion requirement ids", () => {
    expect(() =>
      getIdentityPromotionRequirement(
        "not-a-requirement" as "adr-or-pas-amendment"
      )
    ).toThrow(/Unknown identity promotion requirement/);
  });

  it("returns requirement definitions via getIdentityPromotionRequirement", () => {
    const requirement = getIdentityPromotionRequirement("registry-row");
    expect(requirement.id).toBe("registry-row");
    expect(requirement.pasChecklistStep).toBe(2);
  });
});
