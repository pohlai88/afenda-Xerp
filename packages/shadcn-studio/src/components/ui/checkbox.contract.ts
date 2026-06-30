/** Gold reference (v1.2.0) — Root → Indicator; icon in adapter; form toggle T2. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const CHECKBOX_PRIMITIVE_ID = "shadcn-studio.ui.checkbox" as const;
export type CheckboxPrimitiveId = typeof CHECKBOX_PRIMITIVE_ID;

export const CHECKBOX_SLOTS = {
  root: "checkbox",
  indicator: "checkbox-indicator",
} as const;

export type CheckboxSlotMap = typeof CHECKBOX_SLOTS;
export type CheckboxSlot = CheckboxSlotMap[keyof CheckboxSlotMap];

export const checkboxRootClassName =
  "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:bg-input/30 dark:data-checked:bg-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40" as const;

export const checkboxIndicatorClassName =
  "grid place-content-center text-current transition-none [&>svg]:size-3.5" as const;

export function checkboxPrimitiveMetadata() {
  return {
    id: CHECKBOX_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: CHECKBOX_SLOTS,
  } as const;
}
