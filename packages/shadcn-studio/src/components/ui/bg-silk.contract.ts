export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const BG_SILK_PRIMITIVE_ID = "shadcn-studio.ui.bg-silk" as const;
export type BgSilkPrimitiveId = typeof BG_SILK_PRIMITIVE_ID;

export const BG_SILK_SLOTS = {
  root: "bg-silk",
} as const;

export type BgSilkSlotMap = typeof BG_SILK_SLOTS;
export type BgSilkSlot = BgSilkSlotMap[keyof BgSilkSlotMap];

export const bgSilkRootClassName = "" as const;

export function bgSilkPrimitiveMetadata() {
  return {
    id: BG_SILK_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: BG_SILK_SLOTS,
  } as const;
}
