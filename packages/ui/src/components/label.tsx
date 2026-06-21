"use client";

import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Label as LabelPrimitive } from "radix-ui";
import * as React from "react";

const LABEL_RECIPE_NAME = "form-control" as const;

export interface LabelProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
      "className"
    >,
    GovernedFormControlProps {
  readonly className?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Label",
    recipeName: LABEL_RECIPE_NAME,
    state,
    slot: "root",
    className,
  });

  return (
    <LabelPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

Label.displayName = "Label";

export { Label };
