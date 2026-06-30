export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const BG_DOT_GRID_PRIMITIVE_ID = "shadcn-studio.ui.bg-dot-grid" as const;
export type BgDotGridPrimitiveId = typeof BG_DOT_GRID_PRIMITIVE_ID;

export const BG_DOT_GRID_SLOTS = {
  root: "bg-dot-grid",
} as const;

export type BgDotGridSlotMap = typeof BG_DOT_GRID_SLOTS;
export type BgDotGridSlot = BgDotGridSlotMap[keyof BgDotGridSlotMap];

export const bgDotGridRootClassName = "absolute inset-0 h-full w-full" as const;

export function bgDotGridPrimitiveMetadata() {
  return {
    id: BG_DOT_GRID_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: BG_DOT_GRID_SLOTS,
  } as const;
}
