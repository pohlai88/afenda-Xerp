import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ACCESSIBILITY_REQUIREMENTS,
  AFENDA_ACCESSIBILITY_REGISTRY,
  AFENDA_ACCESSIBILITY_REQUIREMENTS,
  AFENDA_CSS_VARIABLES,
  AFENDA_MOTION_INTENTS,
  AFENDA_MOTION_REGISTRY,
  AFENDA_RECIPE_REGISTRY,
  AFENDA_SEMANTIC_ROLE_REGISTRY,
  AFENDA_STATE_NAMES,
  AFENDA_STATE_REGISTRY,
  AFENDA_TOKEN_CATEGORIES,
  AFENDA_TOKEN_NAMES,
  AFENDA_TOKEN_REGISTRY,
  AFENDA_VARIANT_AXES,
  AFENDA_VARIANT_OPTIONS,
  AFENDA_VARIANT_REGISTRY,
  AI_GENERATION_RULES,
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  accessibilityContract,
  accessibilityPolicy,
  appShellRecipe,
  assertAfendaCssVariable,
  assertAfendaTokenName,
  classNamePolicy,
  classNamePolicyContract,
  componentContract,
  cssVariablePolicy,
  DENSITIES,
  DENSITY_ATTRIBUTES,
  DESIGN_AUTHORITY_DOMAINS,
  densityAttributeSelector,
  densityContract,
  densityFromAttribute,
  densityToAttribute,
  designSystemAuthorityContract,
  designSystemContract,
  designTokenPolicy,
  driftPreventionChecklist,
  erpGovernedExamples,
  exampleContract,
  exportContract,
  extractTokenCategory,
  GOVERNED_STATES,
  getPackageName,
  isAfendaCssVariable,
  isAfendaTokenName,
  isDensity,
  isDensityAttribute,
  isPublicDesignSystemImport,
  MOTION_INTENTS,
  metadataUiRecipe,
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
  tokenNamePolicy,
  tokenNameToCssVariable,
  tokenRegistry,
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
  validateClassNames,
  validateDesignSystemGovernance,
  validateExportSurface,
  validateLayoutClassName,
  validateMotionRegistry,
  validateRecipeRegistry,
  validateStateRegistry,
  validateTokenName,
  validateTokenRegistry,
  validateVariantRegistry,
  variantContract,
  variantRegistry,
  visualDriftPolicy,
} from "../index";

// ─── Contract file presence ───────────────────────────────────────────────────

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
const SEMANTIC_CLASS_PATTERN = /\b(?:bg|text|rounded|shadow|animate)-/u;
const AFENDA_TOKEN_NAME_PATTERN = /^afenda\./;
const AFENDA_CSS_VARIABLE_PATTERN = /^--afenda-/;
const AFENDA_MOTION_DURATION_TOKEN_PATTERN = /^afenda\.motion\.duration\./;
const AFENDA_MOTION_EASING_TOKEN_PATTERN = /^afenda\.motion\.easing\./;

// ─── Stable runtime export map ────────────────────────────────────────────────

/**
 * Every value exported from the public entry point must be listed here AND
 * in `publicExportContract.stableExports`.
 */
const publicRuntimeExports = {
  ACCESSIBILITY_REQUIREMENTS,
  AFENDA_ACCESSIBILITY_REGISTRY,
  AFENDA_ACCESSIBILITY_REQUIREMENTS,
  AFENDA_CSS_VARIABLES,
  AFENDA_MOTION_INTENTS,
  AFENDA_MOTION_REGISTRY,
  AFENDA_RECIPE_REGISTRY,
  AFENDA_SEMANTIC_ROLE_REGISTRY,
  AFENDA_STATE_NAMES,
  AFENDA_STATE_REGISTRY,
  AFENDA_TOKEN_CATEGORIES,
  AFENDA_TOKEN_NAMES,
  AFENDA_TOKEN_REGISTRY,
  AFENDA_VARIANT_AXES,
  AFENDA_VARIANT_OPTIONS,
  AFENDA_VARIANT_REGISTRY,
  AI_GENERATION_RULES,
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  DENSITIES,
  DENSITY_ATTRIBUTES,
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
  appShellRecipe,
  assertAfendaCssVariable,
  assertAfendaTokenName,
  classNamePolicy,
  classNamePolicyContract,
  componentContract,
  cssVariablePolicy,
  densityAttributeSelector,
  densityContract,
  densityFromAttribute,
  densityToAttribute,
  designSystemAuthorityContract,
  designSystemContract,
  designTokenPolicy,
  driftPreventionChecklist,
  erpGovernedExamples,
  exampleContract,
  exportContract,
  extractTokenCategory,
  getPackageName,
  isAfendaCssVariable,
  isAfendaTokenName,
  isDensity,
  isDensityAttribute,
  isPublicDesignSystemImport,
  metadataUiRecipe,
  motionContract,
  motionPolicy,
  publicExportContract,
  recipeContract,
  recipeRegistry,
  slotContract,
  stateContract,
  statePolicy,
  tokenContract,
  tokenNamePolicy,
  tokenNameToCssVariable,
  tokenRegistry,
  validateClassNames,
  validateDesignSystemGovernance,
  validateExportSurface,
  validateLayoutClassName,
  validateMotionRegistry,
  validateRecipeRegistry,
  validateStateRegistry,
  validateTokenName,
  validateTokenRegistry,
  validateVariantRegistry,
  variantContract,
  variantRegistry,
  visualDriftPolicy,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("@afenda/design-system (TIP-004A)", () => {
  // ── Package identity ──────────────────────────────────────────────────────

  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/design-system");
    expect(getPackageName()).toBe("@afenda/design-system");
  });

  // ── Contract file surface ─────────────────────────────────────────────────

  it("defines the required contract file surface", () => {
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

  // ── Authority contract ────────────────────────────────────────────────────

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

  // ── Token prefix policy (TIP-004A core) ──────────────────────────────────

  it("enforces afenda. prefix on every token name", () => {
    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(token.name).toMatch(AFENDA_TOKEN_NAME_PATTERN);
    }
    expect(AFENDA_TOKEN_NAMES.every((n) => n.startsWith("afenda."))).toBe(true);
  });

  it("enforces --afenda- prefix on every CSS variable", () => {
    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(token.cssVariable).toMatch(AFENDA_CSS_VARIABLE_PATTERN);
    }
    expect(AFENDA_CSS_VARIABLES.every((v) => v.startsWith("--afenda-"))).toBe(
      true
    );
  });

  it("cssVariable is derived from the token name (dot→hyphen transform)", () => {
    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(token.cssVariable).toBe(tokenNameToCssVariable(token.name));
    }
  });

  it("isAfendaTokenName identifies valid token names", () => {
    expect(isAfendaTokenName("afenda.color.surface.canvas")).toBe(true);
    expect(isAfendaTokenName("color.surface.canvas")).toBe(false);
    expect(isAfendaTokenName("--afenda-color-surface-canvas")).toBe(false);
  });

  it("assertAfendaTokenName throws on unprefixed names", () => {
    expect(() => assertAfendaTokenName("color.surface.canvas")).toThrow();
    expect(() =>
      assertAfendaTokenName("afenda.color.surface.canvas")
    ).not.toThrow();
  });

  it("isAfendaCssVariable identifies valid CSS variables", () => {
    expect(isAfendaCssVariable("--afenda-color-surface-canvas")).toBe(true);
    expect(isAfendaCssVariable("--token-color-surface-canvas")).toBe(false);
  });

  it("assertAfendaCssVariable throws on wrong prefix", () => {
    expect(() =>
      assertAfendaCssVariable("--token-color-surface-canvas")
    ).toThrow();
    expect(() =>
      assertAfendaCssVariable("--afenda-color-surface-canvas")
    ).not.toThrow();
  });

  it("tokenNameToCssVariable converts dot-notation to CSS custom property", () => {
    expect(tokenNameToCssVariable("afenda.color.surface.canvas")).toBe(
      "--afenda-color-surface-canvas"
    );
    expect(tokenNameToCssVariable("afenda.status-tone.danger.surface")).toBe(
      "--afenda-status-tone-danger-surface"
    );
  });

  // ── Token registry coverage ───────────────────────────────────────────────

  it("covers all governed status tones with surface, foreground, border, and focus tokens", () => {
    const tokenNames = new Set<string>(
      AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name)
    );
    for (const tone of STATUS_TONES) {
      for (const variant of ["surface", "foreground", "border", "focus"]) {
        expect(
          tokenNames.has(`afenda.status-tone.${tone}.${variant}`),
          `Missing afenda.status-tone.${tone}.${variant}`
        ).toBe(true);
      }
    }
  });

  it("covers all governed radii with tokens (including full)", () => {
    const tokenNames = new Set<string>(
      AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name)
    );
    for (const radius of RADII) {
      expect(
        tokenNames.has(`afenda.radius.${radius}`),
        `Missing afenda.radius.${radius}`
      ).toBe(true);
    }
    expect(RADII).toContain("full");
  });

  it("covers all governed shadows with tokens (including focus)", () => {
    const tokenNames = new Set<string>(
      AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name)
    );
    for (const shadow of SHADOWS) {
      expect(
        tokenNames.has(`afenda.shadow.${shadow}`),
        `Missing afenda.shadow.${shadow}`
      ).toBe(true);
    }
    expect(SHADOWS).toContain("focus");
  });

  it("includes the touch target token for accessibility", () => {
    const tokenNames = new Set<string>(
      AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name)
    );
    expect(tokenNames.has("afenda.layout.touch-target.minimum")).toBe(true);
  });

  it("every token has stable: true and public: true", () => {
    for (const token of AFENDA_TOKEN_REGISTRY.tokens) {
      expect(token.stable, `${token.name} not stable`).toBe(true);
      expect(token.public, `${token.name} not public`).toBe(true);
    }
  });

  // ── Governance validation ─────────────────────────────────────────────────

  it("validates recipe references against afenda.* tokens and governed variant axes", () => {
    const result = validateDesignSystemGovernance();

    expect(result).toEqual({ valid: true, errors: [] });
    expect(AFENDA_TOKEN_REGISTRY.tokens.length).toBeGreaterThan(0);
    expect(AFENDA_VARIANT_REGISTRY.variants.length).toBeGreaterThan(0);
    expect(
      AFENDA_RECIPE_REGISTRY.recipes.map((recipe) => recipe.componentKind)
    ).toEqual(
      expect.arrayContaining([
        "button",
        "badge",
        "card",
        "table",
        "form",
        "status",
        "app-shell",
        "metadata-ui",
      ])
    );
  });

  it("passes all validators from the validation layer", () => {
    const tokenResults = validateTokenRegistry();
    const variantResults = validateVariantRegistry();
    const recipeResults = validateRecipeRegistry();
    const stateResults = validateStateRegistry();
    const motionResults = validateMotionRegistry();

    const allFailed = [
      ...tokenResults,
      ...variantResults,
      ...recipeResults,
      ...stateResults,
      ...motionResults,
    ].filter((r) => !r.passed);

    expect(
      allFailed,
      `Validation failures:\n${allFailed.map((r) => r.detail).join("\n")}`
    ).toHaveLength(0);
  });

  // ── className policy ──────────────────────────────────────────────────────

  it("keeps className limited to layout", () => {
    expect(validateLayoutClassName("grid gap-4 items-center").valid).toBe(true);
    expect(
      validateLayoutClassName("grid bg-red-500 rounded-xl").violations
    ).toEqual(["bg-red-500", "rounded-xl"]);
    expect(classNamePolicy.allowedPurpose).toBe("layout-only");
  });

  // ── Accessibility, state, motion ──────────────────────────────────────────

  it("governs accessibility with afenda.* token references", () => {
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
    expect(accessibilityPolicy.focusRingToken).toBe("afenda.color.focus.ring");
    expect(accessibilityPolicy.minTouchTarget).toBe("44px");
  });

  it("governs state policy with all six UI states", () => {
    expect(statePolicy.states.map((s) => s.state)).toEqual([
      "loading",
      "empty",
      "error",
      "forbidden",
      "invalid",
      "ready",
    ]);
  });

  it("uses per-intent afenda.* duration tokens in motionPolicy", () => {
    const intentToToken: Record<string, string> = {
      instant: "afenda.motion.duration.instant",
      feedback: "afenda.motion.duration.fast",
      overlay: "afenda.motion.duration.normal",
      navigation: "afenda.motion.duration.slow",
    };
    for (const entry of motionPolicy) {
      expect(
        entry.durationToken,
        `Intent "${entry.intent}" has wrong duration token`
      ).toBe(intentToToken[entry.intent]);
      expect(entry.durationToken).toMatch(AFENDA_TOKEN_NAME_PATTERN);
      expect(entry.easingToken).toMatch(AFENDA_TOKEN_NAME_PATTERN);
    }
    const coveredIntents = new Set(motionPolicy.map((e) => e.intent));
    for (const intent of MOTION_INTENTS) {
      expect(coveredIntents.has(intent)).toBe(true);
    }
  });

  // ── Examples ──────────────────────────────────────────────────────────────

  it("governs examples for AI imitation", () => {
    expect(erpGovernedExamples.length).toBeGreaterThanOrEqual(4);
    for (const example of erpGovernedExamples) {
      expect(example.imitationOnly).toBe(true);
      expect(example.importsFrom).toBe("@afenda/design-system");
      expect(example.source).toContain('from "@afenda/design-system"');
      expect(example.source).not.toMatch(SEMANTIC_CLASS_PATTERN);
    }
    expect(driftPreventionChecklist.length).toBeGreaterThanOrEqual(7);
  });

  // ── Export surface ────────────────────────────────────────────────────────

  it("keeps public imports on the stable root export surface", () => {
    expect(publicExportContract.deepImportsAllowed).toBe(false);
    expect(publicExportContract.publicEntrypoints).toEqual([
      ".",
      "./css/tokens.css",
    ]);
    expect(publicExportContract.stableExports).toEqual(
      Object.keys(publicRuntimeExports).sort()
    );
    expect(isPublicDesignSystemImport("@afenda/design-system")).toBe(true);
    expect(
      isPublicDesignSystemImport("@afenda/design-system/css/tokens.css")
    ).toBe(true);
    expect(isPublicDesignSystemImport("@afenda/design-system/tokens")).toBe(
      false
    );
    expect(isPublicDesignSystemImport("@afenda/design-system/registries")).toBe(
      false
    );
  });

  // ── Runtime constants ─────────────────────────────────────────────────────

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
    for (const variant of AFENDA_VARIANT_REGISTRY.variants) {
      expect(
        governedOptions.has(variant.option),
        `Variant axis="${variant.axis}" option="${variant.option}" is not a governed value`
      ).toBe(true);
    }
  });

  it("restricts variant allowedTokenCategories to real token categories", () => {
    const governed = new Set<string>(TOKEN_CATEGORIES);
    for (const variant of AFENDA_VARIANT_REGISTRY.variants) {
      for (const category of variant.allowedTokenCategories) {
        expect(
          governed.has(category),
          `Variant axis="${variant.axis}" option="${variant.option}" lists unknown token category "${category}"`
        ).toBe(true);
      }
    }
  });

  // ── TIP-004A policy files ─────────────────────────────────────────────────

  it("exports tokenNamePolicy with correct format rules", () => {
    expect(tokenNamePolicy.prefix).toBe("afenda.");
    expect(tokenNamePolicy.format).toContain("afenda.");
    expect(tokenNamePolicy.rules.length).toBeGreaterThan(0);
  });

  it("exports cssVariablePolicy with correct prefix rule", () => {
    expect(cssVariablePolicy.prefix).toBe("--afenda-");
    expect(cssVariablePolicy.format).toContain("--afenda-");
  });

  it("exports AI_GENERATION_RULES with all rule sections", () => {
    expect(AI_GENERATION_RULES.tokenRules.forbidden).toContain(
      "Use unprefixed token names (e.g. color.surface.canvas)"
    );
    expect(AI_GENERATION_RULES.importRules.forbidden).toContain(
      "Deep import from @afenda/design-system/tokens, /variants, /recipes, etc."
    );
  });

  it("AFENDA_ACCESSIBILITY_REGISTRY references afenda.* tokens", () => {
    expect(AFENDA_ACCESSIBILITY_REGISTRY.focusRingToken).toBe(
      "afenda.color.focus.ring"
    );
    expect(AFENDA_ACCESSIBILITY_REGISTRY.minTouchTargetToken).toBe(
      "afenda.layout.touch-target.minimum"
    );
  });

  it("AFENDA_MOTION_REGISTRY entries use afenda.* token names", () => {
    for (const entry of AFENDA_MOTION_REGISTRY) {
      expect(entry.durationToken).toMatch(AFENDA_MOTION_DURATION_TOKEN_PATTERN);
      expect(entry.easingToken).toMatch(AFENDA_MOTION_EASING_TOKEN_PATTERN);
    }
  });
});
