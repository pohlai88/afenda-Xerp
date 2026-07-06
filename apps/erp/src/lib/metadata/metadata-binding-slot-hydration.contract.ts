import type { MetadataUiBindingProjectionWire } from "./metadata-ui-binding.projection";

/** DOM attribute name for PAS-006 block slot markers (canonical governance marker). */
export const AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE = "data-afenda-slot" as const;

/** ERP metadata bridge alias — same value as {@link AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE}. */
export const METADATA_BINDING_SLOT_DOM_ATTRIBUTE =
  AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE;

/** Suffix for help-text slot targets paired with field `slotId` (PAS-006D §2 help text ref). */
export const METADATA_BINDING_HELP_SLOT_SUFFIX = ".help" as const;

export interface MetadataBindingSlotHydrationTargetWire {
  readonly domAttribute: typeof METADATA_BINDING_SLOT_DOM_ATTRIBUTE;
  readonly fieldKey?: string;
  readonly presentationKind?: string;
  readonly slotId: string;
  readonly value: string;
}

export interface MetadataBindingSlotHydrationWire {
  readonly blockId: string;
  readonly metadataBindingId: string;
  readonly projection: MetadataUiBindingProjectionWire;
  readonly slotTargets: readonly MetadataBindingSlotHydrationTargetWire[];
}
