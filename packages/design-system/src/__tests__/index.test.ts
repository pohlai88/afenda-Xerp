import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  accessibilityPolicy,
  classNamePolicy,
  designSystemContract,
  driftPreventionChecklist,
  erpGovernedExamples,
  GOVERNED_STATES,
  getPackageName,
  isPublicDesignSystemImport,
  MOTION_INTENTS,
  motionPolicy,
  PACKAGE_NAME,
  publicExportContract,
  RADII,
  recipeRegistry,
  SHADOWS,
  SIZES,
  SLOT_ROLES,
  STATUS_TONES,
  statePolicy,
  TOKEN_CATEGORIES,
  tokenRegistry,
  VARIANT_AXES,
  validateDesignSystemGovernance,
  validateLayoutClassName,
  variantRegistry,
} from "../index";

const requiredContractFiles = [
  "design-system.contract.ts",
  "token.contract.ts",
  "recipe.contract.ts",
  "component.contract.ts",
  "slot.contract.ts",
  "variant.contract.ts",
  "class-name-policy.contract.ts",
  "export.contract.ts",
  "accessibility.contract.ts",
  "motion.contract.ts",
  "state.contract.ts",
  "example.contract.ts",
] as const;

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const SEMANTIC_CLASS_PATTERN = /\b(?:bg|text|rounded|shadow|animate)-/;

const publicRuntimeExports = {
  GOVERNED_STATES,
  MOTION_INTENTS,
  PACKAGE_NAME,
  RADII,
  SLOT_ROLES,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  TOKEN_CATEGORIES,
  VARIANT_AXES,
  accessibilityPolicy,
  classNamePolicy,
  designSystemContract,
  driftPreventionChecklist,
  erpGovernedExamples,
  getPackageName,
  isPublicDesignSystemImport,
  motionPolicy,
  publicExportContract,
  recipeRegistry,
  statePolicy,
  tokenRegistry,
  validateDesignSystemGovernance,
  validateLayoutClassName,
  variantRegistry,
};

describe("@afenda/design-system", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/design-system");
    expect(getPackageName()).toBe("@afenda/design-system");
  });

  it("defines the required TIP-006 contract surface", () => {
    for (const fileName of requiredContractFiles) {
      expect(
        existsSync(join(currentDirectory, "..", "contracts", fileName))
      ).toBe(true);
    }

    expect(designSystemContract.principle).toMatchObject({
      tokenOwnsValue: true,
      variantOwnsMeaning: true,
      recipeOwnsStyling: true,
      componentOwnsBehavior: true,
      slotOwnsStructure: true,
      classNameOwnsLayoutOnly: true,
      exampleOwnsAiImitation: true,
    });
  });

  it("validates recipe references against tokens and variants", () => {
    const result = validateDesignSystemGovernance();

    expect(result).toEqual({ valid: true, errors: [] });
    expect(tokenRegistry.tokens.length).toBeGreaterThan(0);
    expect(variantRegistry.variants.length).toBeGreaterThan(0);
    expect(
      recipeRegistry.recipes.map((recipe) => recipe.componentKind)
    ).toEqual(
      expect.arrayContaining([
        "button",
        "badge",
        "card",
        "table",
        "form",
        "status",
      ])
    );
  });

  it("keeps className limited to layout", () => {
    expect(validateLayoutClassName("grid gap-4 items-center").valid).toBe(true);
    expect(
      validateLayoutClassName("grid bg-red-500 rounded-xl").violations
    ).toEqual(["bg-red-500", "rounded-xl"]);
    expect(classNamePolicy.allowedPurpose).toBe("layout-only");
  });

  it("governs accessibility, state, and examples for AI imitation", () => {
    expect(accessibilityPolicy.baseline).toEqual(
      expect.arrayContaining([
        "semanticElement",
        "keyboardReachable",
        "visibleFocus",
        "programmaticName",
        "stateAnnounced",
        "colorNotOnlySignal",
        "reducedMotionSafe",
      ])
    );
    expect(statePolicy.states.map((state) => state.state)).toEqual([
      "loading",
      "empty",
      "error",
      "forbidden",
      "invalid",
      "ready",
    ]);
    expect(erpGovernedExamples.length).toBeGreaterThanOrEqual(4);
    for (const example of erpGovernedExamples) {
      expect(example.source).toContain('from "@afenda/design-system"');
      expect(example.source).not.toMatch(SEMANTIC_CLASS_PATTERN);
    }
    expect(driftPreventionChecklist.length).toBeGreaterThanOrEqual(7);
  });

  it("keeps public imports on the stable root export surface", () => {
    expect(publicExportContract.deepImportsAllowed).toBe(false);
    expect(publicExportContract.publicEntrypoints).toEqual(["."]);
    expect(publicExportContract.stableExports).toEqual(
      Object.keys(publicRuntimeExports).sort()
    );
    expect(isPublicDesignSystemImport("@afenda/design-system")).toBe(true);
    expect(isPublicDesignSystemImport("@afenda/design-system/tokens")).toBe(
      false
    );
  });

  it("covers all governed status tones with a surface token", () => {
    const tokenNames = new Set<string>(tokenRegistry.tokens.map((t) => t.name));
    for (const tone of STATUS_TONES) {
      expect(tokenNames.has(`statusTone.${tone}.surface`)).toBe(true);
    }
  });

  it("covers all governed radii with a token", () => {
    const tokenNames = new Set<string>(tokenRegistry.tokens.map((t) => t.name));
    const radii = ["none", "sm", "md", "lg"];
    for (const radius of radii) {
      expect(tokenNames.has(`radius.${radius}`)).toBe(true);
    }
  });

  it("covers all governed shadows with a token", () => {
    const tokenNames = new Set<string>(tokenRegistry.tokens.map((t) => t.name));
    const shadows = ["none", "raised", "overlay"];
    for (const shadow of shadows) {
      expect(tokenNames.has(`shadow.${shadow}`)).toBe(true);
    }
  });

  it("uses per-intent duration tokens in motionPolicy", () => {
    const intentToToken: Record<string, string> = {
      instant: "motion.duration.instant",
      feedback: "motion.duration.feedback",
      navigation: "motion.duration.navigation",
      overlay: "motion.duration.overlay",
    };
    for (const entry of motionPolicy) {
      expect(entry.durationToken).toBe(intentToToken[entry.intent]);
    }
  });

  it("exports governed runtime constants", () => {
    expect(GOVERNED_STATES).toEqual([
      "loading",
      "empty",
      "error",
      "forbidden",
      "invalid",
      "ready",
    ]);
    expect(MOTION_INTENTS).toEqual([
      "instant",
      "feedback",
      "navigation",
      "overlay",
    ]);
    expect(SLOT_ROLES).toContain("root");
    expect(STATUS_TONES).toContain("danger");
  });
});
