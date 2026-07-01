import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  ASPECT_RATIO_SLOTS,
  aspectRatioRootClassName,
} from "./aspect-ratio.contract.js";

type AspectRatioProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div"> & { ratio: number }
>;

function AspectRatio({ ratio, className, ...props }: AspectRatioProps) {
  return (
    <div
      {...props}
      className={cn(aspectRatioRootClassName, className)}
      data-slot={ASPECT_RATIO_SLOTS.root}
      style={
        {
          "--ratio": ratio,
        } as React.CSSProperties
      }
    />
  );
}

export type { AspectRatioSlot } from "./aspect-ratio.contract.js";
export type { AspectRatioProps };
export { AspectRatio };
