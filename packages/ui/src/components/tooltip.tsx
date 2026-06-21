"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

import { cn } from "@afenda/ui/lib/utils";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

const TOOLTIP_RECIPE_NAME = "surface" as const;

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentProps<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 0, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tooltip",
    recipeName: TOOLTIP_RECIPE_NAME,
    slot: "root",
    className,
  });

  const arrow = resolvePrimitiveGovernance({
    componentName: "Tooltip",
    recipeName: TOOLTIP_RECIPE_NAME,
    slotKey: "arrow",
  });

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        {...applyGovernedPresentation({ ...props, sideOffset }, governed)}
      >
        {children}
        <TooltipPrimitive.Arrow
          {...arrow.dataAttributes}
          className={cn(arrow.className)}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
