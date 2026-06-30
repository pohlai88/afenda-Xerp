import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import { INPUT_SLOTS, inputRootClassName } from "./input.contract.js";

type InputProps = WithoutGovernedDataSlot<
  React.ComponentProps<"input"> & InputPrimitive.Props
>;

function Input({ className, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      {...props}
      className={cn(inputRootClassName, className)}
      data-slot={INPUT_SLOTS.root}
      type={type}
    />
  );
}

export type { InputSlot } from "./input.contract.js";
export type { InputProps };
export { Input };
