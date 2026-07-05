/**
 * PAS-006B — derive relational inventory rows from parity + theme presets.
 */

import { NAMED_THEME_PRESET_SLUGS } from "../theme-config/config.preset.contract.js";
import { themePresets } from "../theme-config/config.presets.js";
import type { PresentationInventoryEntry } from "./presentation-inventory.registry.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "./studio-block-parity.registry.js";

const THEME_PRESET_SOURCE_PATH =
  "packages/shadcn-studio/src/theme-config/config.presets.ts" as const;

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

  return [...themePresetEntries, ...blockEntries];
}
