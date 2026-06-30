"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  SWITCH_SLOTS,
  switchRootClassName,
  switchThumbClassName,
} from "./switch.contract.js";

type SwitchProps = WithoutGovernedDataSlot<SwitchPrimitive.Root.Props> & {
  size?: "sm" | "default";
};

function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      {...props}
      className={cn(switchRootClassName, className)}
      data-size={size}
      data-slot={SWITCH_SLOTS.root}
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
