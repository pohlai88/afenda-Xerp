import type {
  AppShellRecipeSlot,
  Density,
  VariantSelection,
} from "@afenda/ui/governance";
import {
  densityToAttribute,
  resolveAppShellSlotClassName,
} from "@afenda/ui/governance";

type DensityAttribute = ReturnType<typeof densityToAttribute>;

export function joinAppShellGovernedClassName(
  structuralClassName: string | undefined,
  slot: AppShellRecipeSlot,
  selection: VariantSelection = {}
): string {
  return [structuralClassName, resolveAppShellSlotClassName(slot, selection)]
    .filter(Boolean)
    .join(" ");
}

export function resolveAppShellDensityAttribute(
  density: Density = "standard"
): DensityAttribute {
  return densityToAttribute(density);
}
