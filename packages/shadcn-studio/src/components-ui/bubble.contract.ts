import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const BUBBLE_PRIMITIVE_ID = "shadcn-studio.ui.bubble" as const;
export type BubblePrimitiveId = typeof BUBBLE_PRIMITIVE_ID;

export const BUBBLE_SLOTS = {
  group: "bubble-group",
  root: "bubble",
  content: "bubble-content",
  reactions: "bubble-reactions",
} as const;

export type BubbleSlotMap = typeof BUBBLE_SLOTS;
export type BubbleSlot = BubbleSlotMap[keyof BubbleSlotMap];

export const bubbleGroupClassName = "flex min-w-0 flex-col gap-2" as const;

export const bubbleVariants = cva(
  "group/bubble relative flex w-fit min-w-0 max-w-[80%] flex-col gap-1 data-[variant=ghost]:max-w-full data-[align=end]:self-end group-data-[align=end]/message:self-end",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary:
          "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        muted:
          "*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted:
          "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline:
          "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
        destructive:
          "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BubbleVariantProps = VariantProps<typeof bubbleVariants>;

export const bubbleContentClassName =
  "wrap-break-word w-fit min-w-0 max-w-full overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed group-data-[align=end]/bubble:self-end [button,a]:outline-none [button,a]:transition-colors [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/50 [button]:text-left" as const;

export const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
);

export function bubblePrimitiveMetadata() {
  return {
    id: BUBBLE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: BUBBLE_SLOTS,
  } as const;
}
