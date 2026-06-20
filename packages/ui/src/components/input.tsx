import * as React from "react";

import { cn } from "#/lib/utils";
import type { GovernedFormControlProps } from "@/governance";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "size">,
    GovernedFormControlProps {
  readonly className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, density = "standard", size = "md", type, ...props }, ref) => {
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
        ref={ref}
        {...props}
        type={type}
        data-density={density}
        data-size={size}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
