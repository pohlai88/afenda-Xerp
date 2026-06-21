import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import * as React from "react";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">,
    GovernedFormControlProps {
  readonly className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, density = "standard", size = "md", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Textarea",
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
      <textarea
        ref={ref}
        {...props}
        data-density={density}
        data-size={size}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
