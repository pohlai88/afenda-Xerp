"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  RADIO_GROUP_SLOTS,
  radioGroupIndicatorClassName,
  radioGroupIndicatorDotClassName,
  radioGroupItemClassName,
  radioGroupRootClassName,
} from "./radio-group.contract.js";

type RadioGroupProps = WithoutGovernedDataSlot<RadioGroupPrimitive.Props>;
type RadioGroupItemProps = WithoutGovernedDataSlot<RadioPrimitive.Root.Props>;

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      {...props}
      className={cn(radioGroupRootClassName, className)}
      data-slot={RADIO_GROUP_SLOTS.root}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      {...props}
      className={cn(radioGroupItemClassName, className)}
      data-slot={RADIO_GROUP_SLOTS.item}
    >
      <RadioPrimitive.Indicator
        className={radioGroupIndicatorClassName}
        data-slot={RADIO_GROUP_SLOTS.indicator}
      >
        <span className={radioGroupIndicatorDotClassName} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export type { RadioGroupSlot } from "./radio-group.contract.js";
export type { RadioGroupItemProps, RadioGroupProps };
export { RadioGroup, RadioGroupItem };
