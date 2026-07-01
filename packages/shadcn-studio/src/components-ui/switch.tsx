"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  SWITCH_SLOTS,
  type SwitchVariant,
  switchOutline06PrimaryClassName,
  switchRootClassName,
  switchThumbClassName,
} from "./switch.contract.js";

type SwitchProps = WithoutGovernedDataSlot<SwitchPrimitive.Root.Props> & {
  size?: "sm" | "default";
  /**
   * `outline` merges shadcn/studio switch-06 classes on the root (via `[&_span]`)
   * on top of the default base-vega switch — same as registry SwitchOutlineDemo.
   */
  variant?: SwitchVariant;
};

function Switch({
  className,
  size = "default",
  variant = "default",
  ...props
}: SwitchProps) {
  const isOutline = variant === "outline";

  return (
    <SwitchPrimitive.Root
      {...props}
      className={cn(
        switchRootClassName,
        isOutline && switchOutline06PrimaryClassName,
        className
      )}
      data-size={size}
      data-slot={SWITCH_SLOTS.root}
      data-variant={variant}
    >
      <SwitchPrimitive.Thumb
        className={switchThumbClassName}
        data-slot={SWITCH_SLOTS.thumb}
      />
    </SwitchPrimitive.Root>
  );
}

export type { SwitchSlot } from "./switch.contract.js";
export type { SwitchProps };
export { Switch };
