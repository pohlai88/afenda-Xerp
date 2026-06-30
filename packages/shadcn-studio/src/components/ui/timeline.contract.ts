import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const TIMELINE_PRIMITIVE_ID = "shadcn-studio.ui.timeline" as const;
export type TimelinePrimitiveId = typeof TIMELINE_PRIMITIVE_ID;

export const TIMELINE_SLOTS = {
  root: "timeline",
  item: "timeline-item",
  dot: "timeline-dot",
  tag: "timeline-tag",
  content: "timeline-content",
  heading: "timeline-heading",
  line: "timeline-line",
} as const;

export type TimelineSlotMap = typeof TIMELINE_SLOTS;
export type TimelineSlot = TimelineSlotMap[keyof TimelineSlotMap];

export const timelineVariants = cva("grid", {
  variants: {
    positions: {
      left: "[&>li]:grid-cols-[0_min-content_1fr]",
      right: "[&>li]:grid-cols-[1fr_min-content]",
      center: "[&>li]:grid-cols-[1fr_min-content_1fr]",
    },
  },
  defaultVariants: {
    positions: "left",
  },
});

export type TimelineVariantProps = VariantProps<typeof timelineVariants>;

export const timelineItemVariants = cva("grid items-center gap-x-2", {
  variants: {
    status: {
      done: "text-primary",
      default: "text-muted-foreground",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

export type TimelineItemVariantProps = VariantProps<
  typeof timelineItemVariants
>;

export const timelineDotVariants = cva(
  "col-start-2 col-end-3 row-start-1 row-end-1 flex items-center justify-center rounded-full border border-current",
  {
    variants: {
      status: {
        default: "size-4 [&>*]:hidden",
        current:
          "size-4 [&>*:not(.timeline-icon-circle)]:hidden [&>.timeline-icon-circle>svg]:fill-current [&>.timeline-icon-circle>svg]:text-current",
        done: "size-4 bg-primary [&>*:not(.timeline-icon-check)]:hidden [&>.timeline-icon-check>svg]:text-background",
        error:
          "size-4 border-destructive bg-destructive [&>*:not(.timeline-icon-x)]:hidden [&>.timeline-icon-x>svg]:text-background",
        custom:
          "border-none [&>*:not(:nth-child(4))]:hidden [&>*:nth-child(4)]:block",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

export type TimelineDotVariantProps = VariantProps<typeof timelineDotVariants>;

export const timelineDotMarkerClassName = "timeline-dot" as const;

export const timelineIconCircleClassName =
  "timeline-icon-circle flex items-center justify-center" as const;

export const timelineIconCheckClassName =
  "timeline-icon-check flex items-center justify-center" as const;

export const timelineIconXClassName =
  "timeline-icon-x flex items-center justify-center" as const;

export const timelineTagVariants = cva(
  "row-start-1 row-end-1 flex items-center",
  {
    variants: {
      side: {
        left: "col-start-1 col-end-2 justify-end whitespace-nowrap",
        right: "col-start-3 col-end-4 justify-start",
      },
    },
    defaultVariants: {
      side: "left",
    },
  }
);

export type TimelineTagVariantProps = VariantProps<typeof timelineTagVariants>;

export const timelineContentVariants = cva(
  "row-start-2 row-end-2 pb-8 text-card-foreground",
  {
    variants: {
      side: {
        right: "col-start-3 col-end-4 mr-auto text-left",
        left: "col-start-1 col-end-2 ml-auto text-right",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export type TimelineContentVariantProps = VariantProps<
  typeof timelineContentVariants
>;

export const timelineHeadingVariants = cva(
  "row-start-1 row-end-1 line-clamp-1 max-w-full truncate",
  {
    variants: {
      side: {
        right: "col-start-3 col-end-4 mr-auto text-left",
        left: "col-start-1 col-end-2 ml-auto text-right",
      },
      variant: {
        primary: "font-medium text-base text-primary",
        secondary: "font-light text-muted-foreground text-sm",
      },
    },
    defaultVariants: {
      side: "right",
      variant: "primary",
    },
  }
);

export type TimelineHeadingVariantProps = VariantProps<
  typeof timelineHeadingVariants
>;

export const timelineLineBaseClassName =
  "col-start-2 col-end-3 row-start-2 row-end-2 mx-auto flex h-full min-h-16 w-0.5 justify-center rounded-full" as const;

export const timelineLineDoneClassName = "bg-primary" as const;

export const timelineLinePendingClassName = "bg-muted" as const;

export function timelinePrimitiveMetadata() {
  return {
    id: TIMELINE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: TIMELINE_SLOTS,
  } as const;
}
