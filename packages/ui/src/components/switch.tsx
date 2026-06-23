"use client";

import type { GovernedSwitchProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import type { SlotRole } from "@afenda/ui/governance/primitive-contract";
import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";

const SWITCH_RECIPE_NAME = "form-control" as const;

const SWITCH_SLOT_ROLES = {
  root: "root",
} as const satisfies Record<string, SlotRole>;

const SWITCH_THUMB_SLOT_KEY = "thumb" as const;

export interface SwitchProps
  extends Omit<
      React.ComponentProps<typeof SwitchPrimitive.Root>,
      "className" | "size"
    >,
    GovernedSwitchProps {
  readonly className?: string;
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
    slot: SWITCH_SLOT_ROLES.root,
    className,
  });

  const thumb = resolvePrimitiveGovernance({
    componentName: "Switch",
    recipeName: SWITCH_RECIPE_NAME,
    slotKey: SWITCH_THUMB_SLOT_KEY,
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
