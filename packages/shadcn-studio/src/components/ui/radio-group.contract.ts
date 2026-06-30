export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const RADIO_GROUP_PRIMITIVE_ID = "shadcn-studio.ui.radio-group" as const;
export type RadioGroupPrimitiveId = typeof RADIO_GROUP_PRIMITIVE_ID;

export const RADIO_GROUP_SLOTS = {
  root: "radio-group",
  item: "radio-group-item",
  indicator: "radio-group-indicator",
} as const;

export type RadioGroupSlotMap = typeof RADIO_GROUP_SLOTS;
export type RadioGroupSlot = RadioGroupSlotMap[keyof RadioGroupSlotMap];

export const radioGroupRootClassName = "grid w-full gap-3" as const;

export const radioGroupItemClassName =
  "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:bg-input/30 dark:data-checked:bg-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40" as const;

export const radioGroupIndicatorClassName =
  "flex size-4 items-center justify-center" as const;

export const radioGroupIndicatorDotClassName =
  "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" as const;

export function radioGroupPrimitiveMetadata() {
  return {
    id: RADIO_GROUP_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: RADIO_GROUP_SLOTS,
  } as const;
}
