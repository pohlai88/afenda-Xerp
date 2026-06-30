export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SEPARATOR_PRIMITIVE_ID = "shadcn-studio.ui.separator" as const;
export type SeparatorPrimitiveId = typeof SEPARATOR_PRIMITIVE_ID;

export const SEPARATOR_SLOTS = {
  root: "separator",
} as const;

export type SeparatorSlotMap = typeof SEPARATOR_SLOTS;
export type SeparatorSlot = SeparatorSlotMap[keyof SeparatorSlotMap];

export const separatorRootClassName =
  "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch" as const;

export function separatorPrimitiveMetadata() {
  return {
    id: SEPARATOR_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SEPARATOR_SLOTS,
  } as const;
}
