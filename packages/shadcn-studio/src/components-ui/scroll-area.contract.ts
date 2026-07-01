export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SCROLL_AREA_PRIMITIVE_ID = "shadcn-studio.ui.scroll-area" as const;
export type ScrollAreaPrimitiveId = typeof SCROLL_AREA_PRIMITIVE_ID;

export const SCROLL_AREA_SLOTS = {
  root: "scroll-area",
  viewport: "scroll-area-viewport",
  scrollbar: "scroll-area-scrollbar",
  thumb: "scroll-area-thumb",
  corner: "scroll-area-corner",
} as const;

export type ScrollAreaSlotMap = typeof SCROLL_AREA_SLOTS;
export type ScrollAreaSlot = ScrollAreaSlotMap[keyof ScrollAreaSlotMap];

export const scrollAreaRootClassName = "relative" as const;

export const scrollAreaViewportClassName =
  "size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50" as const;

export const scrollAreaScrollbarClassName =
  "flex touch-none select-none p-px transition-colors data-horizontal:h-2.5 data-vertical:h-full data-vertical:w-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:border-l data-vertical:border-l-transparent" as const;

export const scrollAreaThumbClassName =
  "relative flex-1 rounded-full bg-border" as const;

export function scrollAreaPrimitiveMetadata() {
  return {
    id: SCROLL_AREA_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SCROLL_AREA_SLOTS,
  } as const;
}
