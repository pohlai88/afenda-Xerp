"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@afenda/ui/lib/utils";
import type { GovernedSize } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

export interface SwitchProps
  extends Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "className"> {
  readonly className?: string;
  readonly state?: string;
  readonly size?: Extract<GovernedSize, "sm" | "md">;
}

function Switch({
  className,
  state,
  size = "md",
  ...props
}: SwitchProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Switch",
    recipeName: "form-control",
    variant: { size },
    state,
    slot: "root",
    className,
  });

  const thumb = resolvePrimitiveGovernance({
    componentName: "Switch",
    slotKey: "thumb",
  });

  return (
    <SwitchPrimitive.Root
      {...governed.dataAttributes}
      data-size={size === "sm" ? "sm" : "default"}
      className={cn(governed.className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        {...thumb.dataAttributes}
        className={cn(thumb.className)}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
