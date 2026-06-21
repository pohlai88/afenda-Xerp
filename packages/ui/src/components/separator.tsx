"use client";

import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Separator as SeparatorPrimitive } from "radix-ui";
import * as React from "react";

const SEPARATOR_RECIPE_NAME = "form-control" as const;

export interface SeparatorProps
  extends Omit<
      React.ComponentProps<typeof SeparatorPrimitive.Root>,
      "className"
    >,
    GovernedFormControlProps {
  readonly className?: string;
}

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      state,
      orientation = "horizontal",
      decorative = true,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Separator",
      recipeName: SEPARATOR_RECIPE_NAME,
      state,
      slot: "root",
      className,
    });

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        {...applyGovernedPresentation(
          { ...props, decorative, orientation },
          governed
        )}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };
