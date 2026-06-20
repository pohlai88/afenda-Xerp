"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "#/lib/utils";
import type { GovernedFormControlProps } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const PROGRESS_RECIPE_NAME = "form-control" as const;

export interface ProgressProps
  extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "className">,
    GovernedFormControlProps {
  readonly className?: string;
}

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, state, value, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Progress",
    recipeName: PROGRESS_RECIPE_NAME,
    state,
    slot: "root",
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "Progress",
    recipeName: PROGRESS_RECIPE_NAME,
    slot: "control",
  });

  return (
    <ProgressPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <ProgressPrimitive.Indicator
        {...indicator.dataAttributes}
        className={cn(indicator.className)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = "Progress";

export { Progress };
