export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SONNER_PRIMITIVE_ID = "shadcn-studio.ui.sonner" as const;
export type SonnerPrimitiveId = typeof SONNER_PRIMITIVE_ID;

export const SONNER_SLOTS = {
  root: "toaster",
  toast: "toast",
} as const;

export type SonnerSlotMap = typeof SONNER_SLOTS;
export type SonnerSlot = SonnerSlotMap[keyof SonnerSlotMap];

export const sonnerRootClassName = "toaster group" as const;

export const sonnerToastClassName = "cn-toast" as const;

export const sonnerIconClassName = "size-4" as const;

export const sonnerLoadingIconClassName = "size-4 animate-spin" as const;

export function sonnerPrimitiveMetadata() {
  return {
    id: SONNER_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SONNER_SLOTS,
    vendorNotes: "sonner",
  } as const;
}
