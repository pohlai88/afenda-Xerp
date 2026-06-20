// ─── Token categories ─────────────────────────────────────────────────────────

/**
 * Canonical token categories for the TypeScript registry type system.
 * Uses camelCase for JS-identifier safety. The `statusTone` value maps
 * to `status-tone` in the Afenda token name format (see AFENDA_TOKEN_CATEGORIES).
 */
export const TOKEN_CATEGORIES = [
  "color",
  "statusTone",
  "spacing",
  "radius",
  "shadow",
  "typography",
  "motion",
  "density",
  "layout",
  "font",
  "chart",
  "opacity",
  "z-index",
  "breakpoint",
] as const;

/**
 * Afenda-prefixed token categories exactly as they appear in token names.
 * `status-tone` uses a hyphen (kebab-case) which is the canonical format
 * for the `afenda.<category>.*` naming convention.
 */
export const AFENDA_TOKEN_CATEGORIES = [
  "color",
  "status-tone",
  "spacing",
  "radius",
  "shadow",
  "typography",
  "motion",
  "density",
  "layout",
  "font",
  "chart",
  "opacity",
  "z-index",
  "breakpoint",
] as const;

// ─── Governed value sets ──────────────────────────────────────────────────────

export const STATUS_TONES = [
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
  "forbidden",
  "invalid",
] as const;

export const DENSITIES = ["compact", "standard", "comfortable"] as const;
export const SIZES = ["xs", "sm", "md", "lg"] as const;
export const RADII = ["none", "sm", "md", "lg", "full", "base"] as const;
export const SHADOWS = [
  "none", "raised", "overlay", "focus",
  "2xs", "xs", "sm", "base", "md", "lg", "xl", "2xl",
] as const;

// ─── Token name & CSS variable types ─────────────────────────────────────────

/**
 * A valid Afenda-governed token name.
 * All token names must start with `afenda.` followed by a category segment.
 *
 * Examples:
 *   afenda.color.surface.canvas
 *   afenda.status-tone.danger.surface
 *   afenda.motion.duration.fast
 *   afenda.radius.md
 */
export type AfendaTokenName = `afenda.${string}`;

/**
 * The governing token name type. Aliases AfendaTokenName so all downstream
 * contracts reference the same canonical type.
 */
export type TokenName = AfendaTokenName;

/**
 * A valid Afenda CSS custom property.
 * All generated CSS variables must start with `--afenda-`.
 *
 * Examples:
 *   --afenda-color-surface-canvas
 *   --afenda-status-tone-danger-surface
 *   --afenda-radius-md
 */
export type AfendaCssVariableName = `--afenda-${string}`;

// ─── Type guards & assertion helpers ─────────────────────────────────────────

/**
 * Narrows `value` to `AfendaTokenName` if it starts with `"afenda."`.
 */
export function isAfendaTokenName(value: string): value is AfendaTokenName {
  return value.startsWith("afenda.");
}

/**
 * Asserts that `value` is an `AfendaTokenName`; throws if not.
 * Use in registry constructors and validation scripts.
 */
export function assertAfendaTokenName(
  value: string
): asserts value is AfendaTokenName {
  if (!isAfendaTokenName(value)) {
    throw new Error(
      `Invalid token name "${value}": must start with "afenda." (e.g. afenda.color.surface.canvas)`
    );
  }
}

/**
 * Converts a dot-namespaced Afenda token name to its CSS custom property.
 *
 * Algorithm: replace every `.` with `-`, then prepend `--`.
 *
 *   afenda.color.surface.canvas       → --afenda-color-surface-canvas
 *   afenda.status-tone.danger.surface → --afenda-status-tone-danger-surface
 *   afenda.radius.md                  → --afenda-radius-md
 */
export function tokenNameToCssVariable(
  name: AfendaTokenName
): AfendaCssVariableName {
  return `--${name.replaceAll(".", "-")}` as AfendaCssVariableName;
}

// ─── Token definition & registry types ───────────────────────────────────────

export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];
export type AfendaTokenCategory = (typeof AFENDA_TOKEN_CATEGORIES)[number];
export type StatusTone = (typeof STATUS_TONES)[number];
export type Density = (typeof DENSITIES)[number];
export type GovernedSize = (typeof SIZES)[number];
export type GovernedRadius = (typeof RADII)[number];
export type GovernedShadow = (typeof SHADOWS)[number];

export interface TokenDefinition {
  /** Afenda-prefixed token name (e.g. `afenda.color.surface.canvas`). */
  readonly name: AfendaTokenName;
  /** Generated CSS custom property (e.g. `--afenda-color-surface-canvas`). */
  readonly cssVariable: AfendaCssVariableName;
  /** Registry-level category for tooling and validation. */
  readonly category: TokenCategory;
  /** Raw design value (HSL, OKLCH, rem, px, ms, etc.) — the light-mode default. */
  readonly value: string;
  /**
   * Dark-mode override value. When present, `generate-tokens-css` emits this
   * into the `.dark { }` block. Omit entirely for tokens that are mode-agnostic
   * (spacing, radius, motion, density, layout, font stacks).
   */
  readonly darkValue?: string;
  /** Human-readable purpose description. */
  readonly description: string;
  /** Whether this token is stable and safe for downstream consumption. */
  readonly stable: boolean;
  /** Whether this token is part of the public API surface. */
  readonly public: boolean;
}

export interface TokenRegistry {
  readonly categories: readonly TokenCategory[];
  readonly statusTones: readonly StatusTone[];
  readonly densities: readonly Density[];
  readonly sizes: readonly GovernedSize[];
  readonly radii: readonly GovernedRadius[];
  readonly shadows: readonly GovernedShadow[];
  readonly tokens: readonly TokenDefinition[];
}

// ─── Token governance contract ────────────────────────────────────────────────

export const tokenContract = {
  acceptanceRules: [
    "Every design value must be represented by an approved token before use",
    "Token names must start with afenda. and use the canonical afenda.<category>.<domain>.<name> format",
    "CSS variables must start with --afenda- and be derived from the token name",
    "Token names must remain stable once consumed by variants, recipes, or components",
    "Raw CSS values must not appear in variants, recipes, examples, AppShell, Metadata UI, or business modules",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent raw color, spacing, radius, shadow, typography, density, or motion values",
      "Create token lookalikes outside @afenda/design-system",
      "Infer token names from visual screenshots or neighboring code",
      "Use unprefixed token names (e.g. color.surface.canvas instead of afenda.color.surface.canvas)",
      "Use unprefixed CSS variables (e.g. --token-color instead of --afenda-color)",
    ],
    allowed: [
      "Select existing exported tokens",
      "Reference token categories and token names from this contract",
      "Request a contract extension when a required value does not exist",
    ],
  },
  allowedResponsibility: [
    "Define raw design values",
    "Define semantic design values",
    "Define token categories and stable token names",
    "Define CSS variable naming policy",
  ],
  contractId: "afenda.design-system.token",
  downstreamConsumers: [
    "variant.contract.ts",
    "recipe.contract.ts",
    "component.contract.ts",
    "motion.contract.ts",
    "state.contract.ts",
    "accessibility.contract.ts",
    "class-name-policy.contract.ts",
    "examples",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "value",
  owner: "TIP-004A token contract",
  prohibitedResponsibility: [
    "Define visual meaning",
    "Compose styling recipes",
    "Define component behavior",
    "Define slot structure",
    "Define UI state semantics",
    "Define business logic",
  ],
  purpose:
    "Own the only approved raw and semantic design values for Afenda UI surfaces, namespaced under the afenda. prefix.",
  tokenNamingPolicy: {
    format: "afenda.<category>.<domain>.<name>",
    cssVariableFormat: "--afenda-<category>-<domain>-<name>",
    rule: "Token names must never be raw Tailwind classes, unprefixed, or abbreviated",
  },
  version: "0.2.0",
} as const;
