"use client";

import type { GovernedTooltipProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

const TOOLTIP_RECIPE_NAME = "surface" as const;

const TOOLTIP_SLOT_ROLES = {
  root: "root",
} as const satisfies Record<string, SlotRole>;

export type TooltipProviderProps = React.ComponentProps<
  typeof TooltipPrimitive.Provider
>;

function TooltipProvider({
  delayDuration = 0,
  ...props
}: TooltipProviderProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tooltip",
    recipeName: TOOLTIP_RECIPE_NAME,
    slotKey: "provider",
  });

  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      {...applyGovernedPresentation(props, governed)}
    />
  );
}

TooltipProvider.displayName = "TooltipProvider";

export interface TooltipProps
  extends Omit<React.ComponentProps<typeof TooltipPrimitive.Root>, "className">,
    GovernedTooltipProps {
  readonly className?: string;
}

function Tooltip({ className, state, ...props }: TooltipProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tooltip",
    recipeName: TOOLTIP_RECIPE_NAME,
    slotKey: "menu-root",
    state,
    className,
  });

  return (
    <TooltipPrimitive.Root {...applyGovernedPresentation(props, governed)} />
  );
}

Tooltip.displayName = "Tooltip";

export interface TooltipTriggerProps
  extends Omit<
    React.ComponentProps<typeof TooltipPrimitive.Trigger>,
    "className"
  > {
  readonly asChild?: boolean;
  readonly className?: string;
}

const TooltipTrigger = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Trigger>,
  TooltipTriggerProps
>(({ className, asChild = false, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tooltip",
    recipeName: TOOLTIP_RECIPE_NAME,
    slotKey: "trigger",
    className: asChild ? undefined : className,
  });

  if (asChild) {
    return (
      <TooltipPrimitive.Trigger
        asChild
        className={undefined}
        ref={ref}
        {...props}
        {...governed.dataAttributes}
      />
    );
  }

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

TooltipTrigger.displayName = "TooltipTrigger";

export interface TooltipContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
      "className"
    >,
    GovernedTooltipProps {
  readonly className?: string;
}

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, state, sideOffset = 0, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tooltip",
    recipeName: TOOLTIP_RECIPE_NAME,
    state,
    slot: TOOLTIP_SLOT_ROLES.root,
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
        <TooltipPrimitive.Arrow {...applyGovernedPresentation({}, arrow)} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
