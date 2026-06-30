import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import { TEXTAREA_SLOTS, textareaRootClassName } from "./textarea.contract.js";

type TextareaProps = WithoutGovernedDataSlot<React.ComponentProps<"textarea">>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={cn(textareaRootClassName, className)}
      data-slot={TEXTAREA_SLOTS.root}
    />
  );
}

export type { TextareaSlot } from "./textarea.contract.js";
export type { TextareaProps };
export { Textarea };
