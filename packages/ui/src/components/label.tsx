"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import type { GovernedFormControlProps } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const LABEL_RECIPE_NAME = "form-control" as const;

export interface LabelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, "className">,
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
