import type {
  Density,
  MetadataUiRecipeSlot,
  VariantSelection,
} from "@afenda/ui/governance";
import {
  densityToAttribute,
  resolveMetadataUiSlotClassName,
} from "@afenda/ui/governance";
import type { MetadataDensityMode } from "@afenda/ui-composition";

import { joinClassNames } from "../rendering/join-class-names.js";

type DensityAttribute = ReturnType<typeof densityToAttribute>;

const METADATA_TO_GOVERNED_DENSITY = {
  compact: "compact",
  default: "standard",
  comfortable: "comfortable",
} as const satisfies Record<MetadataDensityMode, Density>;

export function metadataRuntimeDensityToGovernedDensity(
  density: MetadataDensityMode
): Density {
  return METADATA_TO_GOVERNED_DENSITY[density];
}

export function resolveMetadataUiDensityAttribute(
  density: MetadataDensityMode
): DensityAttribute {
  return densityToAttribute(metadataRuntimeDensityToGovernedDensity(density));
}

export function resolveMetadataUiGovernedClassName(
  slot: MetadataUiRecipeSlot,
  options: {
    readonly structuralClassNames?: readonly (string | undefined)[];
    readonly density?: MetadataDensityMode;
    readonly tone?: VariantSelection["tone"];
  } = {}
): string {
  const selection: VariantSelection = {
    ...(options.density
      ? { density: metadataRuntimeDensityToGovernedDensity(options.density) }
      : {}),
    ...(options.tone ? { tone: options.tone } : {}),
  };

  return (
    joinClassNames(
      ...(options.structuralClassNames ?? []),
      resolveMetadataUiSlotClassName(slot, selection)
    ) ?? ""
  );
}
