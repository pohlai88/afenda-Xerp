import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";

const SKELETON_RECIPE_NAME = "form-control" as const;

export interface SkeletonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedFormControlProps {
  readonly className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Skeleton",
      recipeName: SKELETON_RECIPE_NAME,
      state,
      slot: "root",
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
