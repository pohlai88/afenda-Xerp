"use client";

import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";

const CHECKBOX_RECIPE_NAME = "form-control" as const;

export interface CheckboxProps
  extends Omit<
      React.ComponentProps<typeof CheckboxPrimitive.Root>,
      "className"
    >,
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
        {...applyGovernedPresentation({}, indicator)}
      >
        <CheckIcon aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
