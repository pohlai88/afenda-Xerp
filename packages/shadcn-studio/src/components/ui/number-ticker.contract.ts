export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const NUMBER_TICKER_PRIMITIVE_ID =
  "shadcn-studio.ui.number-ticker" as const;
export type NumberTickerPrimitiveId = typeof NUMBER_TICKER_PRIMITIVE_ID;

export const NUMBER_TICKER_SLOTS = {
  root: "number-ticker",
} as const;

export type NumberTickerSlotMap = typeof NUMBER_TICKER_SLOTS;
export type NumberTickerSlot = NumberTickerSlotMap[keyof NumberTickerSlotMap];

export const numberTickerRootClassName = "inline-block tabular-nums" as const;

export function numberTickerPrimitiveMetadata() {
  return {
    id: NUMBER_TICKER_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: NUMBER_TICKER_SLOTS,
    vendorNotes: "motion/react",
  } as const;
}
