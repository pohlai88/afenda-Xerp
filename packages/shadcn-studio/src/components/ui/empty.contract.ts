import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const EMPTY_PRIMITIVE_ID = "shadcn-studio.ui.empty" as const;
export type EmptyPrimitiveId = typeof EMPTY_PRIMITIVE_ID;

export const EMPTY_SLOTS = {
  root: "empty",
  header: "empty-header",
  media: "empty-icon",
  title: "empty-title",
  description: "empty-description",
  content: "empty-content",
} as const;

export type EmptySlotMap = typeof EMPTY_SLOTS;
export type EmptySlot = EmptySlotMap[keyof EmptySlotMap];

export const emptyRootClassName =
  "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 text-balance rounded-lg border-dashed p-12 text-center" as const;

export const emptyHeaderClassName =
  "flex max-w-sm flex-col items-center gap-2" as const;

export const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type EmptyMediaVariantProps = VariantProps<typeof emptyMediaVariants>;

export const emptyTitleClassName =
  "font-heading font-medium text-lg tracking-tight" as const;

export const emptyDescriptionClassName =
  "text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4" as const;

export const emptyContentClassName =
  "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm" as const;

export function emptyPrimitiveMetadata() {
  return {
    id: EMPTY_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: EMPTY_SLOTS,
  } as const;
}
