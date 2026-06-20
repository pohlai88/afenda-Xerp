import * as React from "react";
import { Loader2Icon } from "lucide-react";

import type { GovernedState } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const SPINNER_RECIPE_NAME = "form-control" as const;

export interface SpinnerProps
  extends Omit<React.ComponentProps<typeof Loader2Icon>, "className" | "size"> {
  readonly className?: string;
  readonly state?: GovernedState;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Spinner",
      recipeName: SPINNER_RECIPE_NAME,
      state,
      slot: "root",
      className,
    });

    return (
      <Loader2Icon
        ref={ref}
        {...applyGovernedPresentation(
          { role: "status", "aria-label": "Loading", ...props },
          governed
        )}
      />
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
