"use client";

import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";

import type { GovernedToggleProps } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const TOGGLE_RECIPE_NAME = "form-control" as const;

export interface ToggleProps
  extends Omit<React.ComponentProps<typeof TogglePrimitive.Root>, "className">,
    GovernedToggleProps {
  readonly className?: string;
}

const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant = "default", size = "default", state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Toggle",
    recipeName: TOGGLE_RECIPE_NAME,
    state,
    slot: "root",
    toggleVariant: variant,
    toggleSize: size,
    className,
  });

  return (
    <TogglePrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-variant": variant,
        "data-size": size,
      })}
    />
  );
});

Toggle.displayName = "Toggle";

export { Toggle };
