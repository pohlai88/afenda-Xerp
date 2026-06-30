import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const ITEM_PRIMITIVE_ID = "shadcn-studio.ui.item" as const;
export type ItemPrimitiveId = typeof ITEM_PRIMITIVE_ID;

export const ITEM_SLOTS = {
  group: "item-group",
  separator: "item-separator",
  root: "item",
  media: "item-media",
  content: "item-content",
  title: "item-title",
  description: "item-description",
  actions: "item-actions",
  header: "item-header",
  footer: "item-footer",
} as const;

export type ItemSlotMap = typeof ITEM_SLOTS;
export type ItemSlot = ItemSlotMap[keyof ItemSlotMap];

export const itemGroupClassName =
  "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2" as const;

export const itemSeparatorClassName = "my-2" as const;

export const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-md border text-sm outline-none transition-colors duration-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
      },
      size: {
        default: "gap-3.5 px-4 py-3.5",
        sm: "gap-2.5 px-3 py-2.5",
        xs: "gap-2 in-data-[slot=dropdown-menu-content]:p-0 px-2.5 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ItemVariantProps = VariantProps<typeof itemVariants>;

export const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type ItemMediaVariantProps = VariantProps<typeof itemMediaVariants>;

export const itemContentClassName =
  "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none" as const;

export const itemTitleClassName =
  "line-clamp-1 flex w-fit items-center gap-2 font-medium text-sm leading-snug underline-offset-4" as const;

export const itemDescriptionClassName =
  "line-clamp-2 text-left font-normal text-muted-foreground text-sm leading-normal group-data-[size=xs]/item:text-xs [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4" as const;

export const itemActionsClassName = "flex items-center gap-2" as const;

export const itemHeaderClassName =
  "flex basis-full items-center justify-between gap-2" as const;

export const itemFooterClassName =
  "flex basis-full items-center justify-between gap-2" as const;

export function itemPrimitiveMetadata() {
  return {
    id: ITEM_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: ITEM_SLOTS,
  } as const;
}
