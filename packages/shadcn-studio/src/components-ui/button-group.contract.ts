import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const BUTTON_GROUP_PRIMITIVE_ID =
  "shadcn-studio.ui.button-group" as const;
export type ButtonGroupPrimitiveId = typeof BUTTON_GROUP_PRIMITIVE_ID;

export const BUTTON_GROUP_SLOTS = {
  root: "button-group",
  text: "button-group-text",
  separator: "button-group-separator",
} as const;

export type ButtonGroupSlotMap = typeof BUTTON_GROUP_SLOTS;
export type ButtonGroupSlot = ButtonGroupSlotMap[keyof ButtonGroupSlotMap];

export const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-md! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0",
        vertical:
          "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

export type ButtonGroupVariantProps = VariantProps<typeof buttonGroupVariants>;

export const buttonGroupTextClassName =
  "flex items-center gap-2 rounded-md border bg-muted px-2.5 font-medium text-sm shadow-xs [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none" as const;

export const buttonGroupSeparatorClassName =
  "relative self-stretch bg-input data-horizontal:mx-px data-vertical:my-px data-vertical:h-auto data-horizontal:w-auto" as const;

export function buttonGroupPrimitiveMetadata() {
  return {
    id: BUTTON_GROUP_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: BUTTON_GROUP_SLOTS,
  } as const;
}
