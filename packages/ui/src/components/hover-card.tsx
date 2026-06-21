"use client";

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

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  Omit<React.ComponentProps<typeof HoverCardPrimitive.Content>, "className"> & {
    readonly className?: string;
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "HoverCard",
    recipeName: HOVER_CARD_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        ref={ref}
        {...applyGovernedPresentation(
          { ...props, align, sideOffset },
          governed
        )}
      />
    </HoverCardPrimitive.Portal>
  );
});

HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardContent, HoverCardTrigger };
