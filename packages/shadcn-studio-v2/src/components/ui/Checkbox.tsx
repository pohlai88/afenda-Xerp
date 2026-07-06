// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface CheckboxProps
  extends ComponentProps<typeof CheckboxPrimitive.Root> {}

const CHECKBOX_BASE_CLASS =
  "peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-primary shadow-xs transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[checked]:text-primary-foreground";

export function checkboxClassName({
  className,
}: {
  readonly className?: string;
} = {}): string {
  return cn(CHECKBOX_BASE_CLASS, className);
}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      className={checkboxClassName({ className })}
      data-slot="checkbox"
    >
      <CheckboxPrimitive.Indicator
        className="flex items-center justify-center text-current transition-none"
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
