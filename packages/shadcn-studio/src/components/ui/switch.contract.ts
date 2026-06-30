export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SWITCH_PRIMITIVE_ID = "shadcn-studio.ui.switch" as const;
export type SwitchPrimitiveId = typeof SWITCH_PRIMITIVE_ID;

export const SWITCH_SLOTS = {
  root: "switch",
  thumb: "switch-thumb",
} as const;

export type SwitchSlotMap = typeof SWITCH_SLOTS;
export type SwitchSlot = SwitchSlotMap[keyof SwitchSlotMap];

export const switchRootClassName =
  "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=sm]:h-[14px] data-[size=default]:w-[32px] data-[size=sm]:w-[24px] data-disabled:cursor-not-allowed data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-50 dark:data-unchecked:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40" as const;

export const switchThumbClassName =
  "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground" as const;

export function switchPrimitiveMetadata() {
  return {
    id: SWITCH_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SWITCH_SLOTS,
  } as const;
}
