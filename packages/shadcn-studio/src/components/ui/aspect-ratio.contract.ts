export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const ASPECT_RATIO_PRIMITIVE_ID =
  "shadcn-studio.ui.aspect-ratio" as const;
export type AspectRatioPrimitiveId = typeof ASPECT_RATIO_PRIMITIVE_ID;

export const ASPECT_RATIO_SLOTS = {
  root: "aspect-ratio",
} as const;

export type AspectRatioSlotMap = typeof ASPECT_RATIO_SLOTS;
export type AspectRatioSlot = AspectRatioSlotMap[keyof AspectRatioSlotMap];

export const aspectRatioRootClassName = "relative aspect-(--ratio)" as const;

export function aspectRatioPrimitiveMetadata() {
  return {
    id: ASPECT_RATIO_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: ASPECT_RATIO_SLOTS,
  } as const;
}
