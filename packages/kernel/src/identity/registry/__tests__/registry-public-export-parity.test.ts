import { describe, expect, it } from "vitest";
import {
  getIdentityPromotionRequirement as getIdentityPromotionRequirementFromKernel,
  PRIMITIVE_ID_FAMILY_KEYS as kernelPrimitiveFamilyKeys,
  IDENTITY_PROHIBITED_PATTERN_IDS as kernelProhibitedPatternIds,
  IDENTITY_PROMOTION_PAS_CHECKLIST_STEPS as kernelPromotionChecklistSteps,
} from "../../../index.js";
import {
  getIdentityPromotionRequirement,
  getPlatformIdFamilyDefinition,
  IDENTITY_PROHIBITED_PATTERN_IDS,
  IDENTITY_PROMOTION_PAS_CHECKLIST_STEPS,
  IDENTITY_PROMOTION_REQUIREMENT_IDS,
  type IdentityPromotionPasChecklistStep,
  KERNEL_IDENTITY_GOVERNANCE_GATE_SCRIPTS,
  listIdentityPromotionRequirementsForPasStep,
  PLATFORM_ID_FAMILY_TYPE_NAMES,
  PRIMITIVE_ID_FAMILY_KEYS,
  REGISTRY_FAMILY_COUNT,
} from "../../index.js";
import {
  getIdentityProhibitedPattern,
  getKernelIdentityGovernanceGate,
  type IdentityPromotionPasChecklistStepDefinition,
  isIdentityPromotionRequirementId,
  listIdentityProhibitedPatternsWithGate,
} from "../index.js";

/**
 * metadata-ui must not import kernel registry rows — PAS-004 knowledge atoms
 * own presentation labels; kernel owns ID constitution (PAS-001 §4.1).
 */
describe("registry public export parity (PAS-001 §4.1 / Slice B11)", () => {
  it("re-exports promotion helpers from the @afenda/kernel root barrel", () => {
    expect(kernelPromotionChecklistSteps).toBe(
      IDENTITY_PROMOTION_PAS_CHECKLIST_STEPS
    );
    expect(kernelProhibitedPatternIds).toBe(IDENTITY_PROHIBITED_PATTERN_IDS);
    expect(kernelPrimitiveFamilyKeys).toBe(PRIMITIVE_ID_FAMILY_KEYS);
    expect(getIdentityPromotionRequirementFromKernel("registry-row").id).toBe(
      "registry-row"
    );
  });

  it("re-exports promotion helpers from the identity barrel", () => {
    expect(IDENTITY_PROMOTION_REQUIREMENT_IDS.length).toBeGreaterThan(0);
    expect(IDENTITY_PROMOTION_PAS_CHECKLIST_STEPS).toHaveLength(7);
    expect(isIdentityPromotionRequirementId("registry-row")).toBe(true);
    expect(getIdentityPromotionRequirement("registry-row").id).toBe(
      "registry-row"
    );

    const step: IdentityPromotionPasChecklistStep = 2;
    expect(
      listIdentityPromotionRequirementsForPasStep(step).length
    ).toBeGreaterThan(0);
  });

  it("re-exports governance and prohibited-pattern helpers from the identity barrel", () => {
    expect(IDENTITY_PROHIBITED_PATTERN_IDS.length).toBeGreaterThan(0);
    expect(
      getIdentityProhibitedPattern("unchecked-enterprise-id-cast").id
    ).toBe("unchecked-enterprise-id-cast");
    expect(getKernelIdentityGovernanceGate("kernel-identity-surface").id).toBe(
      "kernel-identity-surface"
    );
    expect(KERNEL_IDENTITY_GOVERNANCE_GATE_SCRIPTS.length).toBeGreaterThan(0);
    expect(
      listIdentityProhibitedPatternsWithGate("check:identity-boundary").length
    ).toBeGreaterThan(0);
  });

  it("re-exports IdentityPromotionPasChecklistStepDefinition via registry barrel", () => {
    const firstStep: IdentityPromotionPasChecklistStepDefinition =
      IDENTITY_PROMOTION_PAS_CHECKLIST_STEPS[0];
    expect(firstStep.step).toBe(1);
    expect(firstStep.requirementIds.length).toBeGreaterThan(0);
  });

  it("resolves every registry type name via map-backed getPlatformIdFamilyDefinition", () => {
    expect(PLATFORM_ID_FAMILY_TYPE_NAMES).toHaveLength(REGISTRY_FAMILY_COUNT);

    for (const typeName of PLATFORM_ID_FAMILY_TYPE_NAMES) {
      const definition = getPlatformIdFamilyDefinition(typeName);
      expect(definition.typeName).toBe(typeName);
    }
  });
});
