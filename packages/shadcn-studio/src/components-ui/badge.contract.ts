import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const BADGE_PRIMITIVE_ID = "shadcn-studio.ui.badge" as const;
export type BadgePrimitiveId = typeof BADGE_PRIMITIVE_ID;

export const BADGE_SLOTS = {
  root: "badge",
} as const;

export type BadgeSlotMap = typeof BADGE_SLOTS;
export type BadgeSlot = BadgeSlotMap[keyof BadgeSlotMap];

export const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-4xl border border-transparent px-2 py-0.5 font-medium text-xs transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

/** Solid semantic surface on dark card/table — no new token; uses existing `--destructive`. */
export const badgeSolidDestructiveClassName =
  "border border-transparent bg-destructive text-white" as const;

/** Outline semantic surface — switch-06 analogue for non-critical emphasis on dark. */
export const badgeOutlineDestructiveClassName =
  "border-destructive bg-transparent text-destructive dark:border-destructive dark:text-destructive" as const;

export function badgePrimitiveMetadata() {
  return {
    id: BADGE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: BADGE_SLOTS,
  } as const;
}
