/**
 * Editorial lab preset barrel — review artifacts for Storybook per-story themes.
 *
 * Import runtime CSS from docs/*-noir.css in story files; use this module for
 * TS metadata, anchors, and inventory consumers.
 */

export {
  AFENDA_BRAND_PRESET_ID,
  type AfendaBrandPreset,
  afendaBrandPaletteAnchors,
  afendaBrandPreset,
  afendaBrandTokenGroups,
} from "./afenda-brand.preset.js";
export {
  AFENDA_VERDANT_PRESET_ID,
  type AfendaVerdantPreset,
  afendaVerdantEditorialAnchors,
  afendaVerdantPaletteAnchors,
  afendaVerdantPreset,
  afendaVerdantTokenGroups,
} from "./afenda-verdant.preset.js";
export {
  type EditorialLabPresetId,
  type EditorialLabPresetStatus,
  type EditorialRuntimeScope,
  type EditorialVocab,
  getPresentationLabPresetEntry,
  isEditorialLabPresetId,
  PRESENTATION_LAB_PRESET_IDS,
  PRESENTATION_LAB_PRESET_REGISTRY,
  type PresentationLabPresetRegistryEntry,
} from "./presentation-lab-presets.registry.js";

import { afendaBrandPreset } from "./afenda-brand.preset.js";
import { afendaVerdantPreset } from "./afenda-verdant.preset.js";

export const presentationLabPresetsById = {
  "afenda-brand": afendaBrandPreset,
  "afenda-verdant": afendaVerdantPreset,
} as const;
