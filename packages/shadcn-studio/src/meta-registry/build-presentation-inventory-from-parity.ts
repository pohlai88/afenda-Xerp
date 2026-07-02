/**
 * PAS-006B — derive relational inventory rows from parity + theme presets.
 */

import { PRESENTATION_LAB_PRESET_REGISTRY } from "../styles/presentation-lab-presets.registry.js";
import { NAMED_THEME_PRESET_SLUGS } from "../theme/theme-preset.contract.js";
import { themePresets } from "../theme/theme-presets.js";
import type { PresentationInventoryEntry } from "./presentation-inventory.registry.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "./studio-block-parity.registry.js";

const THEME_PRESET_SOURCE_PATH =
  "packages/shadcn-studio/src/theme/theme-presets.ts" as const;

export function buildPresentationInventoryFromParity(): readonly PresentationInventoryEntry[] {
  const themePresetEntries = NAMED_THEME_PRESET_SLUGS.map(
    (slug) =>
      ({
        entryId: `theme-preset:${slug}`,
        layerKind: "theme-preset",
        label: themePresets[slug].label,
        sourcePath: THEME_PRESET_SOURCE_PATH,
        themePresetSlug: slug,
      }) satisfies PresentationInventoryEntry
  );

  const blockEntries = SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.map(
    (parity) =>
      ({
        entryId: `presentation-block:${parity.mcpBlockId}`,
        layerKind: "presentation-block",
        label: parity.mcpBlockId,
        lifecycleState: "imported",
        mcpBlockId: parity.mcpBlockId,
        parityStatus: parity.status,
        sourcePath: parity.mcpPath,
      }) satisfies PresentationInventoryEntry
  );

  const editorialLabPresetEntries = PRESENTATION_LAB_PRESET_REGISTRY.map(
    (preset) =>
      ({
        entryId: `editorial-lab-preset:${preset.presetId}`,
        layerKind: "editorial-lab-preset",
        label: preset.label,
        presetId: preset.presetId,
        status: preset.status,
        className: preset.className,
        presetSourcePath: preset.presetSourcePath,
        cssMirrorPath: preset.cssMirrorPath,
        specPath: preset.specPath,
        editorialVocab: preset.editorialVocab,
      }) satisfies PresentationInventoryEntry
  );

  return [...themePresetEntries, ...editorialLabPresetEntries, ...blockEntries];
}
