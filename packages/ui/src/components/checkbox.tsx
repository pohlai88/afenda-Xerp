"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";

import { cn } from "@afenda/ui/lib/utils";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

function Checkbox({
  className,
  state,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  readonly state?: string;
}) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Checkbox",
    state,
    slot: "root",
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "Checkbox",
    slotKey: "indicator",
  });

  return (
    <CheckboxPrimitive.Root
      {...governed.dataAttributes}
      className={cn(governed.className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        {...indicator.dataAttributes}
        className={cn(indicator.className)}
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
