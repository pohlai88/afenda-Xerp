import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ACCESSIBILITY_REQUIREMENTS,
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  accessibilityContract,
  accessibilityPolicy,
  classNamePolicy,
  classNamePolicyContract,
  componentContract,
  DENSITIES,
  DESIGN_AUTHORITY_DOMAINS,
  designSystemAuthorityContract,
  designSystemContract,
  driftPreventionChecklist,
  erpGovernedExamples,
  exampleContract,
  exportContract,
  GOVERNED_STATES,
  getPackageName,
  isPublicDesignSystemImport,
  MOTION_INTENTS,
  motionContract,
  motionPolicy,
  PACKAGE_NAME,
  PROHIBITED_CLASSNAME_PATTERNS,
  publicExportContract,
  RADII,
  recipeContract,
  recipeRegistry,
  SHADOWS,
  SIZES,
  SLOT_ROLES,
  STATUS_TONES,
  slotContract,
  stateContract,
  statePolicy,
  TIP_004_DOWNSTREAM_CONTRACTS,
  TOKEN_CATEGORIES,
  tokenContract,
  tokenRegistry,
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  validateDesignSystemGovernance,
  validateLayoutClassName,
  variantContract,
  variantRegistry,
} from "../index";

const requiredContractFiles = [
  "design-system-authority.contract.ts",
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

/**
 * Every value exported from the public entry point must be listed here.
 * The "keeps public imports on the stable root export surface" test compares
 * Object.keys(publicRuntimeExports).sort() against publicExportContract.stableExports,
 * so the two must stay in sync.
 */
const publicRuntimeExports = {
  ACCESSIBILITY_REQUIREMENTS,
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  DENSITIES,
  DESIGN_AUTHORITY_DOMAINS,
  GOVERNED_STATES,
  MOTION_INTENTS,
  PACKAGE_NAME,
  PROHIBITED_CLASSNAME_PATTERNS,
  RADII,
  SHADOWS,
  SIZES,
  SLOT_ROLES,
  STATUS_TONES,
  TIP_004_DOWNSTREAM_CONTRACTS,
  TOKEN_CATEGORIES,
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  accessibilityContract,
  accessibilityPolicy,
  classNamePolicy,
  classNamePolicyContract,
  componentContract,
  designSystemAuthorityContract,
  designSystemContract,
  driftPreventionChecklist,
  erpGovernedExamples,
  exampleContract,
  exportContract,
  getPackageName,
  isPublicDesignSystemImport,
  motionContract,
  motionPolicy,
  publicExportContract,
  recipeContract,
  recipeRegistry,
  slotContract,
  stateContract,
  statePolicy,
  tokenContract,
  tokenRegistry,
  validateDesignSystemGovernance,
  validateLayoutClassName,
  variantContract,
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

  it("defines TIP-003 authority without creating TIP-004 implementation ownership", () => {
    expect(designSystemAuthorityContract.identity).toMatchObject({
      contractId: "afenda.design-system.authority",
      version: "0.1.0",
      owner: "Afenda Architecture Authority",
      packageOwner: "@afenda/design-system",
      decisionAuthority: "ADR-governed Design System Authority",
    });
    expect(designSystemAuthorityContract.identity.relatedTips).toEqual([
      "TIP-003",
      "TIP-004",
    ]);
    expect(
      designSystemAuthorityContract.identity.downstreamContractsOwnedByTip004
    ).toEqual([...TIP_004_DOWNSTREAM_CONTRACTS]);
  });

  it("declares every design authority domain exactly once", () => {
    const declaredDomains = designSystemAuthorityContract.ownershipDomains.map(
      (entry) => entry.domain
    );

    expect(declaredDomains).toEqual([...DESIGN_AUTHORITY_DOMAINS]);
    expect(new Set(declaredDomains).size).toBe(DESIGN_AUTHORITY_DOMAINS.length);

    for (const entry of designSystemAuthorityContract.ownershipDomains) {
      expect(entry.owner).toContain("TIP-004");
      expect(entry.owns.length).toBeGreaterThan(0);
      expect(entry.boundary.length).toBeGreaterThan(0);
    }
  });

  it("lists prohibited overlap and AI anti-drift rules", () => {
    const prohibitedRuleIds =
      designSystemAuthorityContract.prohibitedOverlap.map((rule) => rule.id);

    expect(prohibitedRuleIds).toEqual(
      expect.arrayContaining([
        "components-must-not-invent-tokens",
        "recipes-must-not-invent-behavior",
        "variants-must-not-invent-raw-values",
        "slots-must-not-invent-styling",
        "examples-must-not-invent-apis",
        "class-name-must-not-override-design-meaning",
        "apps-must-not-define-design-primitives",
        "metadata-ui-must-not-bypass-authority",
        "app-shell-must-not-invent-local-visual-rules",
        "business-modules-must-not-own-ui-governance",
      ])
    );
    expect(designSystemAuthorityContract.aiAntiDriftRules.may).toContain(
      "Implement UI only after TIP-004 contracts exist"
    );
    expect(designSystemAuthorityContract.aiAntiDriftRules.mayNot).toContain(
      "Duplicate design contracts in metadata-ui or apps"
    );
  });

  it("keeps the authority contract immutable except by ADR", () => {
    expect(designSystemAuthorityContract.immutability.rule).toBe(
      "Authority contract is immutable except by ADR"
    );
    expect(Object.isFrozen(designSystemAuthorityContract)).toBe(true);
    expect(Object.isFrozen(designSystemAuthorityContract.identity)).toBe(true);
    expect(
      Object.isFrozen(designSystemAuthorityContract.ownershipDomains)
    ).toBe(true);
    expect(
      Object.isFrozen(designSystemAuthorityContract.prohibitedOverlap)
    ).toBe(true);
    expect(
      Object.isFrozen(designSystemAuthorityContract.aiAntiDriftRules.mayNot)
    ).toBe(true);
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
    for (const radius of RADII) {
      expect(tokenNames.has(`radius.${radius}`)).toBe(true);
    }
  });

  it("covers all governed shadows with a token", () => {
    const tokenNames = new Set<string>(tokenRegistry.tokens.map((t) => t.name));
    for (const shadow of SHADOWS) {
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
    // Every MOTION_INTENTS value must have a policy entry.
    const coveredIntents = new Set(motionPolicy.map((e) => e.intent));
    for (const intent of MOTION_INTENTS) {
      expect(coveredIntents.has(intent)).toBe(true);
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
    expect(DENSITIES).toEqual(["compact", "standard", "comfortable"]);
    expect(VARIANT_INTENTS).toEqual([
      "primary",
      "secondary",
      "quiet",
      "destructive",
    ]);
    expect(VARIANT_EMPHASES).toEqual(["solid", "soft", "outline", "ghost"]);
  });

  it("restricts all variant options to governed values", () => {
    const governedOptions = new Set<string>([
      ...VARIANT_INTENTS,
      ...VARIANT_EMPHASES,
      ...STATUS_TONES,
      ...DENSITIES,
      ...SIZES,
      ...RADII,
      ...SHADOWS,
    ]);
    for (const variant of variantRegistry.variants) {
      expect(
        governedOptions.has(variant.option),
        `Variant axis="${variant.axis}" option="${variant.option}" is not a governed value`
      ).toBe(true);
    }
  });

  it("restricts variant allowedTokenCategories to real token categories", () => {
    const governed = new Set<string>(TOKEN_CATEGORIES);
    for (const variant of variantRegistry.variants) {
      for (const category of variant.allowedTokenCategories) {
        expect(
          governed.has(category),
          `Variant axis="${variant.axis}" option="${variant.option}" lists unknown token category "${category}"`
        ).toBe(true);
      }
    }
  });
});
