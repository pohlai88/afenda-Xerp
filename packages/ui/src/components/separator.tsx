"use client";

import type { GovernedSeparatorProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Separator as SeparatorPrimitive } from "radix-ui";
import * as React from "react";

const SEPARATOR_RECIPE_NAME = "form-control" as const;

const SEPARATOR_SLOT_ROLES = {
  root: "root",
} as const satisfies Record<string, SlotRole>;

export interface SeparatorProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
      "className"
    >,
    GovernedSeparatorProps {
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
      slot: SEPARATOR_SLOT_ROLES.root,
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
