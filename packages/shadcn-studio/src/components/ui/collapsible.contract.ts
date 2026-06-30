export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const COLLAPSIBLE_PRIMITIVE_ID = "shadcn-studio.ui.collapsible" as const;
export type CollapsiblePrimitiveId = typeof COLLAPSIBLE_PRIMITIVE_ID;

export const COLLAPSIBLE_SLOTS = {
  root: "collapsible",
  trigger: "collapsible-trigger",
  content: "collapsible-content",
} as const;

export type CollapsibleSlotMap = typeof COLLAPSIBLE_SLOTS;
export type CollapsibleSlot = CollapsibleSlotMap[keyof CollapsibleSlotMap];

export function collapsiblePrimitiveMetadata() {
  return {
    id: COLLAPSIBLE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: COLLAPSIBLE_SLOTS,
  } as const;
}
