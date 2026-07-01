export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SLIDER_PRIMITIVE_ID = "shadcn-studio.ui.slider" as const;
export type SliderPrimitiveId = typeof SLIDER_PRIMITIVE_ID;

export const SLIDER_SLOTS = {
  root: "slider",
  control: "slider-control",
  track: "slider-track",
  range: "slider-range",
  thumb: "slider-thumb",
} as const;

export type SliderSlotMap = typeof SLIDER_SLOTS;
export type SliderSlot = SliderSlotMap[keyof SliderSlotMap];

export const sliderRootClassName =
  "data-vertical:h-full data-horizontal:w-full" as const;

export const sliderControlClassName =
  "relative flex w-full touch-none select-none items-center data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50" as const;

export const sliderTrackClassName =
  "relative grow select-none overflow-hidden rounded-full bg-muted data-horizontal:h-1.5 data-vertical:h-full data-horizontal:w-full data-vertical:w-1.5" as const;

export const sliderRangeClassName =
  "select-none bg-primary data-horizontal:h-full data-vertical:w-full" as const;

export const sliderThumbClassName =
  "block size-4 shrink-0 select-none rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:outline-hidden focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50" as const;

export function sliderPrimitiveMetadata() {
  return {
    id: SLIDER_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SLIDER_SLOTS,
  } as const;
}
