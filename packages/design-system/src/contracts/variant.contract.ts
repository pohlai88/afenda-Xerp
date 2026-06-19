import type {
  Density,
  GovernedRadius,
  GovernedShadow,
  GovernedSize,
  StatusTone,
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

export type VariantAxis = (typeof VARIANT_AXES)[number];
export type VariantIntent = "primary" | "secondary" | "quiet" | "destructive";
export type VariantEmphasis = "solid" | "soft" | "outline" | "ghost";

export interface VariantDefinition {
  readonly allowedTokenCategories: readonly string[];
  readonly axis: VariantAxis;
  readonly meaning: string;
  readonly option: string;
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
