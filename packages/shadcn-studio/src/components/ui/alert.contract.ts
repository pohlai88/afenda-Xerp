import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const ALERT_PRIMITIVE_ID = "shadcn-studio.ui.alert" as const;
export type AlertPrimitiveId = typeof ALERT_PRIMITIVE_ID;

export const ALERT_SLOTS = {
  root: "alert",
  title: "alert-title",
  description: "alert-description",
  action: "alert-action",
} as const;

export type AlertSlotMap = typeof ALERT_SLOTS;
export type AlertSlot = AlertSlotMap[keyof AlertSlotMap];

export const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 has-data-[slot=alert-action]:pr-18 *:[svg:not([class*='size-'])]:size-4 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type AlertVariantProps = VariantProps<typeof alertVariants>;

export const alertTitleClassName =
  "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground" as const;

export const alertDescriptionClassName =
  "text-balance text-muted-foreground text-sm md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4" as const;

export const alertActionClassName = "absolute top-2.5 right-3" as const;

export function alertPrimitiveMetadata() {
  return {
    id: ALERT_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: ALERT_SLOTS,
  } as const;
}
