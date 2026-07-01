export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const LABEL_PRIMITIVE_ID = "shadcn-studio.ui.label" as const;
export type LabelPrimitiveId = typeof LABEL_PRIMITIVE_ID;

export const LABEL_SLOTS = {
  root: "label",
} as const;

export type LabelSlotMap = typeof LABEL_SLOTS;
export type LabelSlot = LabelSlotMap[keyof LabelSlotMap];

export const labelRootClassName =
  "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50" as const;

export function labelPrimitiveMetadata() {
  return {
    id: LABEL_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: LABEL_SLOTS,
  } as const;
}
