import type { StatusTone, VariantSelection } from "./design-system";
import { STATUS_TONES } from "./design-system";
import {
  APP_SHELL_RECIPE_SLOTS,
  APP_SHELL_SLOT_CLASS_NAMES,
  METADATA_UI_RECIPE_SLOTS,
  METADATA_UI_SLOT_CLASS_NAMES,
  type AppShellRecipeSlot,
  type MetadataUiRecipeSlot,
} from "./authority-recipe-maps";
import type { GovernedRecipeName } from "./types";

export type AuthorityRecipeName = Extract<
  GovernedRecipeName,
  "app-shell" | "metadata-ui"
>;

export {
  APP_SHELL_RECIPE_SLOTS,
  APP_SHELL_SLOT_CLASS_NAMES,
  METADATA_UI_RECIPE_SLOTS,
  METADATA_UI_SLOT_CLASS_NAMES,
  type AppShellRecipeSlot,
  type MetadataUiRecipeSlot,
};

function isAppShellSlot(value: string): value is AppShellRecipeSlot {
  return (APP_SHELL_RECIPE_SLOTS as readonly string[]).includes(value);
}

function isMetadataUiSlot(value: string): value is MetadataUiRecipeSlot {
  return (METADATA_UI_RECIPE_SLOTS as readonly string[]).includes(value);
}

function normalizeAuthorityRecipeSelection(
  selection: VariantSelection
): VariantSelection {
  const density = selection.density ?? "standard";
  const tone = selection.tone ?? "neutral";

  if (!(STATUS_TONES as readonly string[]).includes(tone)) {
    throw new Error(
      `TIP-004 authority recipe violation. Unsupported tone "${tone}".`
    );
  }

  return {
    density,
    tone: tone as StatusTone,
  };
}

export function resolveAppShellVariant(
  selection: VariantSelection
): VariantSelection {
  return normalizeAuthorityRecipeSelection(selection);
}

export function resolveMetadataUiVariant(
  selection: VariantSelection
): VariantSelection {
  return normalizeAuthorityRecipeSelection(selection);
}

export function resolveAppShellSlotClassName(
  slot: AppShellRecipeSlot,
  _selection: VariantSelection = {}
): string {
  return APP_SHELL_SLOT_CLASS_NAMES[slot];
}

export function resolveMetadataUiSlotClassName(
  slot: MetadataUiRecipeSlot,
  _selection: VariantSelection = {}
): string {
  return METADATA_UI_SLOT_CLASS_NAMES[slot];
}

export function resolveAuthorityRecipeSlotClassName(
  recipeName: AuthorityRecipeName,
  slotName: string,
  selection: VariantSelection = {}
): string {
  switch (recipeName) {
    case "app-shell": {
      if (!isAppShellSlot(slotName)) {
        throw new Error(
          `TIP-004 app-shell recipe violation. Unknown slot "${slotName}".`
        );
      }
      return resolveAppShellSlotClassName(slotName, selection);
    }
    case "metadata-ui": {
      if (!isMetadataUiSlot(slotName)) {
        throw new Error(
          `TIP-004 metadata-ui recipe violation. Unknown slot "${slotName}".`
        );
      }
      return resolveMetadataUiSlotClassName(slotName, selection);
    }
    default: {
      const exhaustive: never = recipeName;
      throw new Error(`Unhandled authority recipe "${exhaustive}".`);
    }
  }
}

export function resolveAppShellClassName(
  selection: VariantSelection = {}
): string {
  return resolveAppShellSlotClassName("root", selection);
}

export function resolveMetadataUiClassName(
  selection: VariantSelection = {}
): string {
  return resolveMetadataUiSlotClassName("container", selection);
}

export function isAuthorityRecipeName(
  value: string
): value is AuthorityRecipeName {
  return value === "app-shell" || value === "metadata-ui";
}

export function isAppShellRecipeSlot(value: string): value is AppShellRecipeSlot {
  return isAppShellSlot(value);
}

export function isMetadataUiRecipeSlot(
  value: string
): value is MetadataUiRecipeSlot {
  return isMetadataUiSlot(value);
}
