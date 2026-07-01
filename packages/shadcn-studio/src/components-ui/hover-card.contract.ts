export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const HOVER_CARD_PRIMITIVE_ID = "shadcn-studio.ui.hover-card" as const;
export type HoverCardPrimitiveId = typeof HOVER_CARD_PRIMITIVE_ID;

export const HOVER_CARD_SLOTS = {
  root: "hover-card",
  trigger: "hover-card-trigger",
  portal: "hover-card-portal",
  positioner: "hover-card-positioner",
  content: "hover-card-content",
} as const;

export type HoverCardSlotMap = typeof HOVER_CARD_SLOTS;
export type HoverCardSlot = HoverCardSlotMap[keyof HoverCardSlotMap];

export const hoverCardPositionerClassName = "isolate z-50" as const;

export const hoverCardContentClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-4 text-popover-foreground text-sm shadow-md outline-hidden ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in" as const;

export function hoverCardPrimitiveMetadata() {
  return {
    id: HOVER_CARD_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: HOVER_CARD_SLOTS,
  } as const;
}
