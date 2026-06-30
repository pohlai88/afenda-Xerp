import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const MARKER_PRIMITIVE_ID = "shadcn-studio.ui.marker" as const;
export type MarkerPrimitiveId = typeof MARKER_PRIMITIVE_ID;

export const MARKER_SLOTS = {
  root: "marker",
  icon: "marker-icon",
  content: "marker-content",
} as const;

export type MarkerSlotMap = typeof MARKER_SLOTS;
export type MarkerSlot = MarkerSlotMap[keyof MarkerSlotMap];

export const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-muted-foreground text-sm [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        border: "border-border border-b pb-2",
      },
    },
  }
);

export type MarkerVariantProps = VariantProps<typeof markerVariants>;

export const markerIconClassName =
  "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4" as const;

export const markerContentClassName =
  "wrap-break-word min-w-0 group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground" as const;

export function markerPrimitiveMetadata() {
  return {
    id: MARKER_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: MARKER_SLOTS,
  } as const;
}
