"use client";

import type {
  GovernedFormControlProps,
  GovernedSize,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";

const SWITCH_RECIPE_NAME = "form-control" as const;

export interface SwitchProps
  extends Omit<
      React.ComponentProps<typeof SwitchPrimitive.Root>,
      "className" | "size"
    >,
    GovernedFormControlProps {
  readonly className?: string;
  readonly size?: Extract<GovernedSize, "sm" | "md">;
}

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, state, size = "md", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Switch",
    recipeName: SWITCH_RECIPE_NAME,
    variant: { size },
    state,
    slot: "root",
    className,
  });

  const thumb = resolvePrimitiveGovernance({
    componentName: "Switch",
    recipeName: SWITCH_RECIPE_NAME,
    slotKey: "thumb",
  });

  return (
    <SwitchPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-size": size === "sm" ? "sm" : "default",
      })}
    >
      <SwitchPrimitive.Thumb {...applyGovernedPresentation({}, thumb)} />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = "Switch";

export { Switch };
