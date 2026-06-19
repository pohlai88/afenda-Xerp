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
