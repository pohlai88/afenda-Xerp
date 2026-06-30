import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const TOGGLE_PRIMITIVE_ID = "shadcn-studio.ui.toggle" as const;
export type TogglePrimitiveId = typeof TOGGLE_PRIMITIVE_ID;

export const TOGGLE_SLOTS = {
  root: "toggle",
} as const;

export type ToggleSlotMap = typeof TOGGLE_SLOTS;
export type ToggleSlot = ToggleSlotMap[keyof ToggleSlotMap];

export const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-muted aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-muted",
      },
      size: {
        default:
          "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 min-w-10 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ToggleVariantProps = VariantProps<typeof toggleVariants>;

export function togglePrimitiveMetadata() {
  return {
    id: TOGGLE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: TOGGLE_SLOTS,
  } as const;
}
