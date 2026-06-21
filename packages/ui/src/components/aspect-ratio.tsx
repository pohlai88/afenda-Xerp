"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import * as React from "react";

const ASPECT_RATIO_RECIPE_NAME = "surface" as const;

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>((props, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "AspectRatio",
    recipeName: ASPECT_RATIO_RECIPE_NAME,
    slot: "root",
  });

  return (
    <AspectRatioPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
