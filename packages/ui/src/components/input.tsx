import * as React from "react";

import { cn } from "@afenda/ui/lib/utils";
import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "className" | "size">,
    GovernedFormControlProps {
  readonly className?: string;
  readonly state?: string;
}

function Input({
  className,
  state,
  density = "standard",
  size = "md",
  type,
  ...props
}: InputProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Input",
    recipeName: "form-control",
    variant: {
      density,
      size,
    },
    state,
    slot: "root",
    className,
  });

  return (
    <input
      type={type}
      {...governed.dataAttributes}
      className={cn(governed.className)}
      {...props}
    />
  );
}

export { Input };
