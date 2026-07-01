/**
 * PAS-006D P06-008-R1 — explicit metadata binding waivers (NO path).
 */

import type { MetadataBindingWaiverWire } from "../meta-contracts/metadata-binding-waiver.contract.js";

export const METADATA_BINDING_WAIVER_REGISTRY = [
  {
    blockId: "dropdown-language",
    notes: "Chrome navigation menu — no metadata-driven field rendering.",
    reason: "chrome-navigation",
    waiverId: "metadata-binding-waiver.dropdown-language",
  },
  {
    blockId: "dropdown-notification",
    notes: "Chrome notification menu — no metadata-driven field rendering.",
    reason: "chrome-navigation",
    waiverId: "metadata-binding-waiver.dropdown-notification",
  },
  {
    blockId: "dropdown-profile",
    notes: "Chrome profile menu — no metadata-driven field rendering.",
    reason: "chrome-navigation",
    waiverId: "metadata-binding-waiver.dropdown-profile",
  },
  {
    blockId: "menu-trigger",
    notes: "Layout navigation trigger — no metadata field binding.",
    reason: "layout-trigger-only",
    waiverId: "metadata-binding-waiver.menu-trigger",
  },
  {
    blockId: "sidebar-user-dropdown",
    notes: "Sidebar user chrome trigger — no metadata field binding.",
    reason: "layout-trigger-only",
    waiverId: "metadata-binding-waiver.sidebar-user-dropdown",
  },
  {
    blockId: "dialog-activity",
    notes:
      "Dialog shell chrome — metadata binding deferred to surface template slice.",
    reason: "dialog-shell-only",
    waiverId: "metadata-binding-waiver.dialog-activity",
  },
  {
    blockId: "dialog-search",
    notes:
      "Search dialog shell — metadata binding deferred to surface template slice.",
    reason: "dialog-shell-only",
    waiverId: "metadata-binding-waiver.dialog-search",
  },
] as const satisfies readonly MetadataBindingWaiverWire[];

const WAIVER_BLOCK_ID_SET = new Set<string>(
  METADATA_BINDING_WAIVER_REGISTRY.map((entry) => entry.blockId)
);

export function isMetadataBindingWaivedBlockId(blockId: string): boolean {
  return WAIVER_BLOCK_ID_SET.has(blockId);
}

export function getMetadataBindingWaiverByBlockId(
  blockId: string,
  registry: readonly MetadataBindingWaiverWire[] = METADATA_BINDING_WAIVER_REGISTRY
): MetadataBindingWaiverWire | undefined {
  return registry.find((entry) => entry.blockId === blockId);
}
