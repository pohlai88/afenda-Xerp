export const TOKEN_CATEGORIES = [
  "color",
  "statusTone",
  "spacing",
  "radius",
  "shadow",
  "typography",
  "motion",
  "density",
] as const;

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
export const RADII = ["none", "sm", "md", "lg"] as const;
export const SHADOWS = ["none", "raised", "overlay"] as const;

export const tokenContract = {
  acceptanceRules: [
    "Every design value must be represented by an approved token before use",
    "Token names must remain stable once consumed by variants, recipes, or components",
    "Raw CSS values must not appear in variants, recipes, examples, AppShell, Metadata UI, or business modules",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent raw color, spacing, radius, shadow, typography, density, or motion values",
      "Create token lookalikes outside @afenda/design-system",
      "Infer token names from visual screenshots or neighboring code",
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
  owner: "TIP-004 token contract",
  prohibitedResponsibility: [
    "Define visual meaning",
    "Compose styling recipes",
    "Define component behavior",
    "Define slot structure",
    "Define UI state semantics",
    "Define business logic",
  ],
  purpose:
    "Own the only approved raw and semantic design values for Afenda UI surfaces.",
  version: "0.1.0",
} as const;

export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];
export type StatusTone = (typeof STATUS_TONES)[number];
export type Density = (typeof DENSITIES)[number];
export type GovernedSize = (typeof SIZES)[number];
export type GovernedRadius = (typeof RADII)[number];
export type GovernedShadow = (typeof SHADOWS)[number];

/**
 * A valid governed token name.
 *
 * The first arm covers every category except statusTone (e.g. `color.surface.canvas`,
 * `spacing.4`, `radius.md`).  The second arm enforces that statusTone names must
 * include a recognized tone segment (e.g. `statusTone.danger.surface`), preventing
 * loose `statusTone.anything.anything` drift.
 */
export type TokenName =
  | `${Exclude<TokenCategory, "statusTone">}.${string}`
  | `statusTone.${StatusTone}.${string}`;

export interface TokenDefinition {
  readonly category: TokenCategory;
  readonly description: string;
  readonly name: TokenName;
  readonly stable: boolean;
  readonly value: string;
}

export interface TokenRegistry {
  readonly categories: readonly TokenCategory[];
  readonly densities: readonly Density[];
  readonly radii: readonly GovernedRadius[];
  readonly shadows: readonly GovernedShadow[];
  readonly sizes: readonly GovernedSize[];
  readonly statusTones: readonly StatusTone[];
  readonly tokens: readonly TokenDefinition[];
}
