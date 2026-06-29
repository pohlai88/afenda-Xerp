import type { MetadataUiBindingProjectionWire } from "./metadata-ui-binding.projection";

/** DOM attribute name for PAS-006 block slot markers (mirrors studio contract). */
export const METADATA_BINDING_SLOT_DOM_ATTRIBUTE = "data-afenda-slot" as const;

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
