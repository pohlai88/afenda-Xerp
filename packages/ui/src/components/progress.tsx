"use client";

import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Progress as ProgressPrimitive } from "radix-ui";
import * as React from "react";

const PROGRESS_RECIPE_NAME = "form-control" as const;

export interface ProgressProps
  extends Omit<
      React.ComponentProps<typeof ProgressPrimitive.Root>,
      "className"
    >,
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
      {...applyGovernedPresentation({ ...props, value }, governed)}
    >
      <ProgressPrimitive.Indicator
        {...applyGovernedPresentation(
          {
            style: {
              "--progress-value": value ?? 0,
            } as React.CSSProperties,
          },
          indicator
        )}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = "Progress";

export { Progress };
