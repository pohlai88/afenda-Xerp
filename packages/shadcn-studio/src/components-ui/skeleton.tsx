import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import { SKELETON_SLOTS, skeletonRootClassName } from "./skeleton.contract.js";

type SkeletonProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      className={cn(skeletonRootClassName, className)}
      data-slot={SKELETON_SLOTS.root}
    />
  );
}

export type { SkeletonSlot } from "./skeleton.contract.js";
export type { SkeletonProps };
export { Skeleton };
