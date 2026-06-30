"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  CHECKBOX_SLOTS,
  checkboxIndicatorClassName,
  checkboxRootClassName,
} from "./checkbox.contract.js";

type CheckboxProps = WithoutGovernedDataSlot<CheckboxPrimitive.Root.Props>;

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      className={cn(checkboxRootClassName, className)}
      data-slot={CHECKBOX_SLOTS.root}
    >
      <CheckboxPrimitive.Indicator
        className={checkboxIndicatorClassName}
        data-slot={CHECKBOX_SLOTS.indicator}
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export type { CheckboxSlot } from "./checkbox.contract.js";
export type { CheckboxProps };
export { Checkbox };
