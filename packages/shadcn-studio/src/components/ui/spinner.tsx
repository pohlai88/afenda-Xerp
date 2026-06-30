import { Loader2Icon } from "lucide-react";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import { SPINNER_SLOTS, spinnerRootClassName } from "./spinner.contract.js";

type SpinnerProps = WithoutGovernedDataSlot<React.ComponentProps<"svg">>;

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      {...props}
      aria-label="Loading"
      className={cn(spinnerRootClassName, className)}
      data-slot={SPINNER_SLOTS.root}
      role="status"
    />
  );
}

export type { SpinnerSlot } from "./spinner.contract.js";
export type { SpinnerProps };
export { Spinner };
