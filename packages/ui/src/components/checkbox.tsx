"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";

import { cn } from "#/lib/utils";
import type { GovernedFormControlProps } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const CHECKBOX_RECIPE_NAME = "form-control" as const;

export interface CheckboxProps
  extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "className">,
    GovernedFormControlProps {
  readonly className?: string;
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Checkbox",
    recipeName: CHECKBOX_RECIPE_NAME,
    state,
    slot: "root",
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "Checkbox",
    recipeName: CHECKBOX_RECIPE_NAME,
    slotKey: "indicator",
  });

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <CheckboxPrimitive.Indicator
        {...indicator.dataAttributes}
        className={cn(indicator.className)}
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
