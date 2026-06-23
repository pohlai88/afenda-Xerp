"use client";

import type { GovernedFormControlProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Label as LabelPrimitive } from "radix-ui";
import * as React from "react";

const LABEL_RECIPE_NAME = "form-control" as const;

const LABEL_SLOT_ROLES = {
  root: "root",
} as const satisfies Record<"root", SlotRole>;

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
>(
  (
    {
      className,
      state,
      density = "standard",
      size = "md",
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Label",
      recipeName: LABEL_RECIPE_NAME,
      variant: { density, size },
      state,
      slot: LABEL_SLOT_ROLES.root,
      className,
    });

    return (
      <LabelPrimitive.Root
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-density": density,
          "data-size": size,
        })}
      />
    );
  }
);

Label.displayName = "Label";

export { Label };
