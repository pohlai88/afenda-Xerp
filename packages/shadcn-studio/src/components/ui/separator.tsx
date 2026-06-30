"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  SEPARATOR_SLOTS,
  separatorRootClassName,
} from "./separator.contract.js";

type SeparatorProps = WithoutGovernedDataSlot<SeparatorPrimitive.Props>;

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      {...props}
      className={cn(separatorRootClassName, className)}
      data-slot={SEPARATOR_SLOTS.root}
      orientation={orientation}
    />
  );
}

export type { SeparatorSlot } from "./separator.contract.js";
export type { SeparatorProps };
export { Separator };
