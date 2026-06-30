import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const RATING_PRIMITIVE_ID = "shadcn-studio.ui.rating" as const;
export type RatingPrimitiveId = typeof RATING_PRIMITIVE_ID;

export const RATING_SLOTS = {
  root: "rating",
  star: "rating-star",
  item: "rating-item",
  input: "rating-input",
} as const;

export type RatingSlotMap = typeof RATING_SLOTS;
export type RatingSlot = RatingSlotMap[keyof RatingSlotMap];

export const RATING_DEFAULTS = {
  precision: 1,
  maxStars: 5,
  size: 20,
  variant: "default" as const,
} as const;

export const ratingVariants = cva("transition-colors", {
  variants: {
    variant: {
      default: "fill-current text-foreground",
      destructive: "fill-current text-destructive",
      outline: "fill-transparent stroke-current text-muted-foreground",
      secondary: "fill-current text-muted-foreground",
      yellow: "fill-current text-amber-600 dark:text-amber-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type RatingVariantProps = VariantProps<typeof ratingVariants>;

export const ratingRootClassName =
  "flex gap-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2" as const;

export const ratingRootDisabledClassName = "opacity-50" as const;

export const ratingStarClassName = "relative" as const;

export const ratingStarInteractiveClassName =
  "transition-transform hover:scale-110" as const;

export const ratingStarDisabledClassName = "cursor-not-allowed" as const;

export const ratingItemBaseClassName = "[&_svg]:pointer-events-none" as const;

export const ratingItemPartialClassName =
  "pointer-events-none absolute top-0 left-0 overflow-hidden" as const;

export const ratingItemInteractiveClassName =
  "cursor-pointer hover:scale-105" as const;

export const ratingItemDisabledClassName =
  "cursor-not-allowed opacity-50" as const;

export const ratingEmptyIconClassName =
  "fill-muted-foreground/20 stroke-muted-foreground/10 text-muted-foreground/10" as const;

export const ratingEmptyIconYellowClassName =
  "fill-amber-600/30 stroke-amber-600/10 text-amber-600/10 dark:fill-amber-400/30 dark:stroke-amber-400/10" as const;

export const ratingInputClassName = "sr-only" as const;

export function ratingPrimitiveMetadata() {
  return {
    id: RATING_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: RATING_SLOTS,
  } as const;
}
