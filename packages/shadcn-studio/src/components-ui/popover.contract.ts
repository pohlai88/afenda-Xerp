export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const POPOVER_PRIMITIVE_ID = "shadcn-studio.ui.popover" as const;
export type PopoverPrimitiveId = typeof POPOVER_PRIMITIVE_ID;

export const POPOVER_SLOTS = {
  root: "popover",
  trigger: "popover-trigger",
  portal: "popover-portal",
  positioner: "popover-positioner",
  content: "popover-content",
  header: "popover-header",
  title: "popover-title",
  description: "popover-description",
} as const;

export type PopoverSlotMap = typeof POPOVER_SLOTS;
export type PopoverSlot = PopoverSlotMap[keyof PopoverSlotMap];

export const popoverPositionerClassName = "isolate z-50" as const;

export const popoverContentClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-md bg-popover p-4 text-popover-foreground text-sm shadow-md outline-hidden ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in" as const;

export const popoverHeaderClassName = "flex flex-col gap-1 text-sm" as const;

export const popoverTitleClassName = "font-medium" as const;

export const popoverDescriptionClassName = "text-muted-foreground" as const;

export function popoverPrimitiveMetadata() {
  return {
    id: POPOVER_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: POPOVER_SLOTS,
  } as const;
}
