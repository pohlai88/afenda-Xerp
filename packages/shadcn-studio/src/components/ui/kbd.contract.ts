export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const KBD_PRIMITIVE_ID = "shadcn-studio.ui.kbd" as const;
export type KbdPrimitiveId = typeof KBD_PRIMITIVE_ID;

export const KBD_SLOTS = {
  root: "kbd",
  group: "kbd-group",
} as const;

export type KbdSlotMap = typeof KBD_SLOTS;
export type KbdSlot = KbdSlotMap[keyof KbdSlotMap];

export const kbdRootClassName =
  "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted in-data-[slot=tooltip-content]:bg-background/20 px-1 font-medium font-sans in-data-[slot=tooltip-content]:text-background text-muted-foreground text-xs dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3" as const;

export const kbdGroupClassName = "inline-flex items-center gap-1" as const;

export function kbdPrimitiveMetadata() {
  return {
    id: KBD_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: KBD_SLOTS,
  } as const;
}
