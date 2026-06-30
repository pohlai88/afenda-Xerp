"use client";

import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import { LABEL_SLOTS, labelRootClassName } from "./label.contract.js";

type LabelProps = WithoutGovernedDataSlot<React.ComponentProps<"label">>;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      {...props}
      className={cn(labelRootClassName, className)}
      data-slot={LABEL_SLOTS.root}
    />
  );
}

export type { LabelSlot } from "./label.contract.js";
export type { LabelProps };
export { Label };
