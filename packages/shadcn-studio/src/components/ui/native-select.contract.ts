export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const NATIVE_SELECT_PRIMITIVE_ID =
  "shadcn-studio.ui.native-select" as const;
export type NativeSelectPrimitiveId = typeof NATIVE_SELECT_PRIMITIVE_ID;

export const NATIVE_SELECT_SLOTS = {
  wrapper: "native-select-wrapper",
  select: "native-select",
  icon: "native-select-icon",
  option: "native-select-option",
  optGroup: "native-select-optgroup",
} as const;

export type NativeSelectSlotMap = typeof NATIVE_SELECT_SLOTS;
export type NativeSelectSlot = NativeSelectSlotMap[keyof NativeSelectSlotMap];

export const nativeSelectWrapperClassName =
  "group/native-select relative w-fit has-[select:disabled]:opacity-50" as const;

export const nativeSelectClassName =
  "h-9 w-full min-w-0 select-none appearance-none rounded-md border border-input bg-transparent py-1 pr-8 pl-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-8 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50" as const;

export const nativeSelectIconClassName =
  "pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 select-none text-muted-foreground" as const;

export const nativeSelectOptionClassName =
  "bg-[Canvas] text-[CanvasText]" as const;

export function nativeSelectPrimitiveMetadata() {
  return {
    id: NATIVE_SELECT_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: NATIVE_SELECT_SLOTS,
  } as const;
}
