/** Vendor boundary: embla-carousel-react — adapter owns styling; do not fork vendor internals. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const CAROUSEL_PRIMITIVE_ID = "shadcn-studio.ui.carousel" as const;
export type CarouselPrimitiveId = typeof CAROUSEL_PRIMITIVE_ID;

export const CAROUSEL_SLOTS = {
  root: "carousel",
  content: "carousel-content",
  item: "carousel-item",
  previous: "carousel-previous",
  next: "carousel-next",
} as const;

export type CarouselSlotMap = typeof CAROUSEL_SLOTS;
export type CarouselSlot = CarouselSlotMap[keyof CarouselSlotMap];

export const carouselRootClassName = "relative" as const;

export const carouselContentWrapperClassName = "overflow-hidden" as const;

export const carouselContentInnerClassNameHorizontal = "flex -ml-4" as const;

export const carouselContentInnerClassNameVertical =
  "-mt-4 flex-col flex" as const;

export const carouselContentInnerClassNameBase = "flex" as const;

export const carouselItemClassNameBase =
  "min-w-0 shrink-0 grow-0 basis-full" as const;

export const carouselItemClassNameHorizontal = "pl-4" as const;

export const carouselItemClassNameVertical = "pt-4" as const;

export const carouselControlClassNameBase =
  "absolute touch-manipulation rounded-full" as const;

export const carouselPreviousClassNameHorizontal =
  "inset-y-0 -left-12 my-auto" as const;

export const carouselPreviousClassNameVertical =
  "-top-12 left-1/2 -translate-x-1/2 rotate-90" as const;

export const carouselNextClassNameHorizontal =
  "inset-y-0 -right-12 my-auto" as const;

export const carouselNextClassNameVertical =
  "-bottom-12 left-1/2 -translate-x-1/2 rotate-90" as const;

export const carouselPreviousSrOnlyClassName = "sr-only" as const;

export const carouselNextSrOnlyClassName = "sr-only" as const;

export function carouselPrimitiveMetadata() {
  return {
    id: CAROUSEL_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: CAROUSEL_SLOTS,
  } as const;
}
