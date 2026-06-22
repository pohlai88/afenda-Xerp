"use client";

import type { GovernedAspectRatioProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import * as React from "react";

const ASPECT_RATIO_RECIPE_NAME = "surface" as const;

export interface AspectRatioProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>,
      "className"
    >,
    GovernedAspectRatioProps {
  readonly className?: string;
}

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "AspectRatio",
    recipeName: ASPECT_RATIO_RECIPE_NAME,
    state,
    slot: "root",
    className,
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
