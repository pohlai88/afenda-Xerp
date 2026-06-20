"use client";

import * as React from "react";
import { AspectRatio as AspectRatioPrimitive } from "radix-ui";

import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

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
