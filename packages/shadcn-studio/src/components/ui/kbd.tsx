import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  KBD_SLOTS,
  kbdGroupClassName,
  kbdRootClassName,
} from "./kbd.contract.js";

type KbdProps = WithoutGovernedDataSlot<React.ComponentProps<"kbd">>;

function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(kbdRootClassName, className)}
      data-slot={KBD_SLOTS.root}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      {...props}
      className={cn(kbdGroupClassName, className)}
      data-slot={KBD_SLOTS.group}
    />
  );
}

export type { KbdSlot } from "./kbd.contract.js";
export type { KbdProps };
export { Kbd, KbdGroup };
