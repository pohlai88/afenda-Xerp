import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";

const INPUT_RECIPE_NAME = "form-control" as const;

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
      recipeName: INPUT_RECIPE_NAME,
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
        type={type}
        {...applyGovernedPresentation(props, governed, {
          "data-density": density,
          "data-size": size,
        })}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
