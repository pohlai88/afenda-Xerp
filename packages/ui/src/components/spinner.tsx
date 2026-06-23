import type { GovernedSpinnerProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import type { SlotRole } from "@afenda/ui/governance/primitive-contract";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

const SPINNER_RECIPE_NAME = "form-control" as const;

const SPINNER_SLOT_ROLES = {
  root: "root",
} as const satisfies Record<string, SlotRole>;

export interface SpinnerProps
  extends Omit<React.ComponentProps<typeof Loader2Icon>, "className">,
    GovernedSpinnerProps {
  readonly className?: string;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  (
    {
      className,
      state,
      size = "sm",
      role = "status",
      "aria-label": ariaLabel = "Loading",
      "aria-busy": ariaBusy = true,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Spinner",
      recipeName: SPINNER_RECIPE_NAME,
      variant: { size },
      state,
      slot: SPINNER_SLOT_ROLES.root,
      className,
    });

    return (
      <Loader2Icon
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          role,
          "aria-label": ariaLabel,
          "aria-busy": ariaBusy,
          "data-size": size,
        })}
      />
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
