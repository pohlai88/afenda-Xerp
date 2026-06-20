import type {
  Density,
  GovernedRadius,
  GovernedShadow,
  GovernedSize,
  StatusTone,
  TokenCategory,
} from "./token.contract";

export const VARIANT_AXES = [
  "intent",
  "tone",
  "density",
  "size",
  "radius",
  "shadow",
  "emphasis",
] as const;

/**
 * All valid intent option values.
 *
 * Derived from an `as const` array so that adding a new intent here
 * automatically widens `VariantIntent` without a separate manual edit.
 */
export const VARIANT_INTENTS = [
  "primary",
  "secondary",
  "quiet",
  "destructive",
] as const;

/**
 * All valid emphasis option values.
 *
 * Derived from an `as const` array — same single-source-of-truth guarantee
 * as `VARIANT_INTENTS`.
 */
export const VARIANT_EMPHASES = ["solid", "soft", "outline", "ghost"] as const;

export const variantContract = {
  acceptanceRules: [
    "Every visual meaning must map to approved variant vocabulary",
    "Variant options must reference governed token categories only",
    "Variants must never contain raw CSS values",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent variant axes or options",
      "Attach raw CSS values to a variant",
      "Use variant names to create behavior or data rules",
    ],
    allowed: [
      "Select approved variant axes and options",
      "Map product intent to existing variant meaning",
      "Request a contract extension when a visual meaning is missing",
    ],
  },
  allowedResponsibility: [
    "Define visual meaning",
    "Define governed variant axes",
    "Define approved variant options",
  ],
  contractId: "afenda.design-system.variant",
  downstreamConsumers: [
    "recipe.contract.ts",
    "component.contract.ts",
    "example.contract.ts",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "meaning",
  owner: "TIP-004 variant contract",
  prohibitedResponsibility: [
    "Define raw CSS values",
    "Define component behavior",
    "Define slot structure",
    "Define business logic",
    "Override token ownership",
  ],
  purpose:
    "Own the visual meaning vocabulary that recipes and components consume.",
  version: "0.1.0",
} as const;

export type VariantAxis = (typeof VARIANT_AXES)[number];
export type VariantIntent = (typeof VARIANT_INTENTS)[number];
export type VariantEmphasis = (typeof VARIANT_EMPHASES)[number];

/**
 * A single governed variant entry.
 *
 * `option` is constrained to the union of all governed option types so that
 * invalid values (e.g. `option: "foobar"`) are caught at compile time.
 * `allowedTokenCategories` is `readonly TokenCategory[]` to prevent listing
 * categories that don't exist in the token contract.
 */
export interface VariantDefinition {
  readonly allowedTokenCategories: readonly TokenCategory[];
  readonly axis: VariantAxis;
  readonly meaning: string;
  readonly option:
    | VariantIntent
    | VariantEmphasis
    | StatusTone
    | Density
    | GovernedSize
    | GovernedRadius
    | GovernedShadow;
}

export interface VariantSelection {
  readonly density?: Density;
  readonly emphasis?: VariantEmphasis;
  readonly intent?: VariantIntent;
  readonly radius?: GovernedRadius;
  readonly shadow?: GovernedShadow;
  readonly size?: GovernedSize;
  readonly tone?: StatusTone;
}

export interface VariantRegistry {
  readonly axes: readonly VariantAxis[];
  readonly variants: readonly VariantDefinition[];
}
