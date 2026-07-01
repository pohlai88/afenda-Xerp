export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const TEXTAREA_PRIMITIVE_ID = "shadcn-studio.ui.textarea" as const;
export type TextareaPrimitiveId = typeof TEXTAREA_PRIMITIVE_ID;

export const TEXTAREA_SLOTS = {
  root: "textarea",
} as const;

export type TextareaSlotMap = typeof TEXTAREA_SLOTS;
export type TextareaSlot = TextareaSlotMap[keyof TextareaSlotMap];

export const textareaRootClassName =
  "field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40" as const;

export function textareaPrimitiveMetadata() {
  return {
    id: TEXTAREA_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: TEXTAREA_SLOTS,
  } as const;
}
