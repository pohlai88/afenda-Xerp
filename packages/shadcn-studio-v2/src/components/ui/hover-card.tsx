"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface HoverCardProps
  extends ComponentProps<typeof PreviewCardPrimitive.Root> {}
export interface HoverCardTriggerProps
  extends ComponentProps<typeof PreviewCardPrimitive.Trigger> {}
export interface HoverCardContentProps
  extends Omit<ComponentProps<typeof PreviewCardPrimitive.Popup>, "className">,
    Pick<
      ComponentProps<typeof PreviewCardPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {
  readonly className?: string | undefined;
}

const HOVER_CARD_POSITIONER_CLASS = "z-50 outline-none";
const HOVER_CARD_CONTENT_CLASS =
  "z-50 w-64 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none";

export function hoverCardContentClassName({
  className,
}: Pick<HoverCardContentProps, "className"> = {}): string {
  return cn(HOVER_CARD_CONTENT_CLASS, className);
}

export function HoverCard({ ...props }: HoverCardProps) {
  return <PreviewCardPrimitive.Root {...props} data-slot="hover-card" />;
}

export function HoverCardTrigger({ ...props }: HoverCardTriggerProps) {
  return (
    <PreviewCardPrimitive.Trigger {...props} data-slot="hover-card-trigger" />
  );
}

export function HoverCardContent({
  align = "center",
  alignOffset = 0,
  className,
  side = "bottom",
  sideOffset = 8,
  ...props
}: HoverCardContentProps) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className={HOVER_CARD_POSITIONER_CLASS}
        data-slot="hover-card-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <PreviewCardPrimitive.Popup
          {...props}
          className={hoverCardContentClassName({ className })}
          data-slot="hover-card-content"
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}
