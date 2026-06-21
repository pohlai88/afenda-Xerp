"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import * as React from "react";

const COLLAPSIBLE_RECIPE_NAME = "surface" as const;

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>((props, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Collapsible",
    recipeName: COLLAPSIBLE_RECIPE_NAME,
    slot: "root",
  });

  return (
    <CollapsiblePrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
>((props, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Collapsible",
    recipeName: COLLAPSIBLE_RECIPE_NAME,
    slot: "control",
  });

  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>((props, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Collapsible",
    recipeName: COLLAPSIBLE_RECIPE_NAME,
    slot: "content",
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
