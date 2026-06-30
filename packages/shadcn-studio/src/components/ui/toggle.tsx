"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  TOGGLE_SLOTS,
  type ToggleVariantProps,
  toggleVariants,
} from "./toggle.contract.js";

type ToggleProps = WithoutGovernedDataSlot<
  TogglePrimitive.Props & ToggleVariantProps
>;

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      {...props}
      className={cn(toggleVariants({ variant, size, className }))}
      data-slot={TOGGLE_SLOTS.root}
    />
  );
}

export type { ToggleSlot } from "./toggle.contract.js";
export type { ToggleProps, ToggleVariantProps };
export { Toggle, toggleVariants };
