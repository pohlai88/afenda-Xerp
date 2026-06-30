"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  HOVER_CARD_SLOTS,
  hoverCardContentClassName,
  hoverCardPositionerClassName,
} from "./hover-card.contract.js";

type HoverCardProps = WithoutGovernedDataSlot<PreviewCardPrimitive.Root.Props>;
type HoverCardTriggerProps =
  WithoutGovernedDataSlot<PreviewCardPrimitive.Trigger.Props>;
type HoverCardContentProps = WithoutGovernedDataSlot<
  PreviewCardPrimitive.Popup.Props &
    Pick<
      PreviewCardPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset"
    >
>;

function HoverCard({ ...props }: HoverCardProps) {
  return (
    <PreviewCardPrimitive.Root {...props} data-slot={HOVER_CARD_SLOTS.root} />
  );
}

function HoverCardTrigger({ ...props }: HoverCardTriggerProps) {
  return (
    <PreviewCardPrimitive.Trigger
      {...props}
      data-slot={HOVER_CARD_SLOTS.trigger}
    />
  );
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: HoverCardContentProps) {
  return (
    <PreviewCardPrimitive.Portal data-slot={HOVER_CARD_SLOTS.portal}>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className={hoverCardPositionerClassName}
        data-slot={HOVER_CARD_SLOTS.positioner}
        side={side}
        sideOffset={sideOffset}
      >
        <PreviewCardPrimitive.Popup
          {...props}
          className={cn(hoverCardContentClassName, className)}
          data-slot={HOVER_CARD_SLOTS.content}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export type { HoverCardSlot } from "./hover-card.contract.js";
export type { HoverCardContentProps, HoverCardProps, HoverCardTriggerProps };
export { HoverCard, HoverCardContent, HoverCardTrigger };
