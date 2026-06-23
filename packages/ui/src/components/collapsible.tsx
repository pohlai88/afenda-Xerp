"use client";

import type { GovernedCollapsibleProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import * as React from "react";

const COLLAPSIBLE_RECIPE_NAME = "surface" as const;

const COLLAPSIBLE_SLOT_ROLES = {
  root: "root",
  control: "control",
  content: "content",
} as const satisfies Record<string, SlotRole>;

export interface CollapsibleProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>,
      "className"
    >,
    GovernedCollapsibleProps {
  readonly className?: string;
}

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  CollapsibleProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Collapsible",
    recipeName: COLLAPSIBLE_RECIPE_NAME,
    state,
    slot: COLLAPSIBLE_SLOT_ROLES.root,
    className,
  });

  return (
    <CollapsiblePrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<
      typeof CollapsiblePrimitive.CollapsibleTrigger
    >,
    "className"
  > {
  readonly className?: string;
}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  CollapsibleTriggerProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Collapsible",
    recipeName: COLLAPSIBLE_RECIPE_NAME,
    slot: COLLAPSIBLE_SLOT_ROLES.control,
    className,
  });

  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<
      typeof CollapsiblePrimitive.CollapsibleContent
    >,
    "className"
  > {
  readonly className?: string;
}

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  CollapsibleContentProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Collapsible",
    recipeName: COLLAPSIBLE_RECIPE_NAME,
    slot: COLLAPSIBLE_SLOT_ROLES.content,
    className,
  });

  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
