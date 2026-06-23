"use client";

import type {
  GovernedHoverCardProps,
  GovernedSurfaceProps,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import * as React from "react";

const HOVER_CARD_RECIPE_NAME = "surface" as const;

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

HoverCard.displayName = "HoverCard";

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

HoverCardTrigger.displayName = "HoverCardTrigger";

function HoverCardPortal({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Portal>) {
  return <HoverCardPrimitive.Portal data-slot="hover-card-portal" {...props} />;
}

HoverCardPortal.displayName = "HoverCardPortal";

export interface HoverCardContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>,
      "className"
    >,
    GovernedSurfaceProps,
    GovernedHoverCardProps {
  readonly className?: string;
}

const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      density = "standard",
      radius = "md",
      shadow = "overlay",
      state,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "HoverCard",
      recipeName: HOVER_CARD_RECIPE_NAME,
      variant: { density, radius, shadow },
      state,
      slot: "root",
      className,
    });

    return (
      <HoverCardPortal>
        <HoverCardPrimitive.Content
          ref={ref}
          {...applyGovernedPresentation(
            { ...props, align, sideOffset },
            governed
          )}
        />
      </HoverCardPortal>
    );
  }
);

HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger };
