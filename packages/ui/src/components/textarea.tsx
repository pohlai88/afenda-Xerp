import type { GovernedFormControlProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";

const TEXTAREA_RECIPE_NAME = "form-control" as const;

const TEXTAREA_SLOT_ROLES = {
  root: "root",
} as const satisfies Record<string, SlotRole>;

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">,
    GovernedFormControlProps {
  readonly className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, density = "standard", size = "md", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Textarea",
      recipeName: TEXTAREA_RECIPE_NAME,
      variant: {
        density,
        size,
      },
      state,
      slot: TEXTAREA_SLOT_ROLES.root,
      className,
    });

    return (
      <textarea
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-density": density,
          "data-size": size,
        })}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
