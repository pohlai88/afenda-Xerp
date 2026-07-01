export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const CARD_PRIMITIVE_ID = "shadcn-studio.ui.card" as const;
export type CardPrimitiveId = typeof CARD_PRIMITIVE_ID;

export const CARD_SLOTS = {
  root: "card",
  header: "card-header",
  title: "card-title",
  description: "card-description",
  action: "card-action",
  content: "card-content",
  footer: "card-footer",
} as const;

export type CardSlotMap = typeof CARD_SLOTS;
export type CardSlot = CardSlotMap[keyof CardSlotMap];

export const cardRootClassName =
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-card-foreground text-sm shadow-xs ring-1 ring-foreground/10 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl" as const;

export const cardHeaderClassName =
  "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)" as const;

export const cardTitleClassName =
  "font-heading font-medium text-base leading-normal group-data-[size=sm]/card:text-sm" as const;

export const cardDescriptionClassName =
  "text-muted-foreground text-sm" as const;

export const cardActionClassName =
  "col-start-2 row-span-2 row-start-1 self-start justify-self-end" as const;

export const cardContentClassName = "px-(--card-spacing)" as const;

export const cardFooterClassName =
  "flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)" as const;

export function cardPrimitiveMetadata() {
  return {
    id: CARD_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: CARD_SLOTS,
  } as const;
}
