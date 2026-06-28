import type { Density, DensityAttribute } from "./token.contract";
import { DENSITIES, DENSITY_ATTRIBUTES } from "./token.contract";

/**
 * TS/API density (`standard`) maps to the DOM hook value `default`.
 * CSS selectors use `[data-afenda-density="…"]`; token names use `afenda.density.<mode>.*`.
 */
const DENSITY_TO_ATTRIBUTE = {
  compact: "compact",
  standard: "default",
  comfortable: "comfortable",
} as const satisfies Record<Density, DensityAttribute>;

const ATTRIBUTE_TO_DENSITY = {
  compact: "compact",
  default: "standard",
  comfortable: "comfortable",
} as const satisfies Record<DensityAttribute, Density>;

/** Maps governed TS density to the `data-afenda-density` attribute value. */
export function densityToAttribute(density: Density): DensityAttribute {
  return DENSITY_TO_ATTRIBUTE[density];
}

/** Maps a DOM density attribute back to the governed TS density vocabulary. */
export function densityFromAttribute(attribute: DensityAttribute): Density {
  return ATTRIBUTE_TO_DENSITY[attribute];
}

/** Returns a selector for scoping density token overrides on an ancestor. */
export function densityAttributeSelector(density: Density): string {
  return `[data-afenda-density="${densityToAttribute(density)}"]`;
}

export function isDensity(value: string): value is Density {
  return (DENSITIES as readonly string[]).includes(value);
}

export function isDensityAttribute(value: string): value is DensityAttribute {
  return (DENSITY_ATTRIBUTES as readonly string[]).includes(value);
}

export const densityContract = {
  attributeToDensity: ATTRIBUTE_TO_DENSITY,
  contractId: "afenda.design-system.density",
  densityToAttribute: DENSITY_TO_ATTRIBUTE,
  purpose:
    "Bridge governed TS density vocabulary (standard) to CSS data-attribute hooks (default).",
  version: "0.1.0",
} as const;
