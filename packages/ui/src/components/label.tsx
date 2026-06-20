"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@afenda/ui/lib/utils";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Label",
    slot: "root",
    className,
  });

  return (
    <LabelPrimitive.Root
      {...governed.dataAttributes}
      className={cn(governed.className)}
      {...props}
    />
  );
}

export { Label };
