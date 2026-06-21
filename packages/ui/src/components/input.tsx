import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import * as React from "react";

export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "className" | "size"
    >,
    GovernedFormControlProps {
  readonly className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, state, density = "standard", size = "md", type, ...props },
    ref
  ) => {
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
        data-density={density}
        data-size={size}
        type={type}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
