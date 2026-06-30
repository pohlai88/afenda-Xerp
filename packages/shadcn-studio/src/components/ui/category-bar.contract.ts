/** Custom visualization boundary (Gold v1.2.0): Tremor-style category bar — adapter owns segment math and Tooltip composition; not Base UI. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const CATEGORY_BAR_PRIMITIVE_ID =
  "shadcn-studio.ui.category-bar" as const;
export type CategoryBarPrimitiveId = typeof CATEGORY_BAR_PRIMITIVE_ID;

export const CATEGORY_BAR_SLOTS = {
  root: "category-bar",
  labels: "category-bar-labels",
  track: "category-bar-track",
  segment: "category-bar-segment",
  marker: "category-bar-marker",
} as const;

export type CategoryBarSlotMap = typeof CATEGORY_BAR_SLOTS;
export type CategoryBarSlot = CategoryBarSlotMap[keyof CategoryBarSlotMap];

export const categoryBarRootClassName = "w-full" as const;

export const categoryBarDefaultBarColor = "bg-muted" as const;

export const categoryBarLabelsClassName =
  "relative mb-2 flex h-5 w-full font-medium text-sm text-muted-foreground" as const;

export const categoryBarLabelsStartClassName =
  "absolute bottom-0 left-0 flex items-center" as const;

export const categoryBarLabelsEndClassName =
  "absolute right-0 bottom-0 flex items-center" as const;

export const categoryBarLabelSegmentClassName =
  "flex items-center justify-end pr-0.5" as const;

export const categoryBarLabelValueClassName =
  "block translate-x-1/2 text-sm tabular-nums" as const;

export const categoryBarTrackRowClassName =
  "relative flex h-2 w-full items-center" as const;

export const categoryBarTrackClassName =
  "flex h-full flex-1 items-center overflow-hidden rounded-full" as const;

export const categoryBarTrackWithLabelsClassName = "gap-0.5" as const;

export const categoryBarSegmentClassName = "h-full" as const;

export const categoryBarSegmentHiddenClassName = "hidden" as const;

export const categoryBarMarkerClassName =
  "absolute w-2 -translate-x-1/2" as const;

export const categoryBarMarkerAnimatedClassName =
  "transform-gpu transition-all duration-300 ease-in-out" as const;

export const categoryBarMarkerIndicatorClassName =
  "relative mx-auto h-4 w-1 rounded-full ring-2 ring-background" as const;

export const categoryBarMarkerIndicatorHitAreaClassName =
  "absolute size-7 -translate-x-[45%] -translate-y-[15%]" as const;

export const categoryBarMarkerIndicatorStaticClassName =
  "mx-auto h-4 w-1 rounded-full ring-2 ring-background" as const;

export function categoryBarPrimitiveMetadata() {
  return {
    id: CATEGORY_BAR_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: CATEGORY_BAR_SLOTS,
  } as const;
}
