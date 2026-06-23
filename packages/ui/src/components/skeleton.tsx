import type { GovernedSkeletonProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";

const SKELETON_RECIPE_NAME = "form-control" as const;

const SKELETON_SLOT_ROLES = {
  root: "root",
} as const satisfies Record<"root", SlotRole>;

export interface SkeletonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedSkeletonProps {
  readonly className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Skeleton",
      recipeName: SKELETON_RECIPE_NAME,
      state,
      slot: SKELETON_SLOT_ROLES.root,
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
