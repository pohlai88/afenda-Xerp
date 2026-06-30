export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const DIRECTION_PRIMITIVE_ID = "shadcn-studio.ui.direction" as const;
export type DirectionPrimitiveId = typeof DIRECTION_PRIMITIVE_ID;

export const DIRECTION_SLOTS = {
  provider: "direction-provider",
} as const;

export type DirectionSlotMap = typeof DIRECTION_SLOTS;
export type DirectionSlot = DirectionSlotMap[keyof DirectionSlotMap];

export function directionPrimitiveMetadata() {
  return {
    id: DIRECTION_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: DIRECTION_SLOTS,
  } as const;
}
