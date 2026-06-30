export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SPINNER_PRIMITIVE_ID = "shadcn-studio.ui.spinner" as const;
export type SpinnerPrimitiveId = typeof SPINNER_PRIMITIVE_ID;

export const SPINNER_SLOTS = {
  root: "spinner",
} as const;

export type SpinnerSlotMap = typeof SPINNER_SLOTS;
export type SpinnerSlot = SpinnerSlotMap[keyof SpinnerSlotMap];

export const spinnerRootClassName = "size-4 animate-spin" as const;

export function spinnerPrimitiveMetadata() {
  return {
    id: SPINNER_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SPINNER_SLOTS,
  } as const;
}
