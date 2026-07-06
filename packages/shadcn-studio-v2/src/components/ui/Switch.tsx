"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface SwitchProps
  extends Omit<ComponentProps<typeof SwitchPrimitive.Root>, "className"> {
  readonly className?: string | undefined;
}

const SWITCH_BASE_CLASS =
  "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-input shadow-xs transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary";

export function switchClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(SWITCH_BASE_CLASS, className);
}

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      {...props}
      className={switchClassName({ className })}
      data-slot="switch"
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform data-[checked]:translate-x-4 data-[unchecked]:translate-x-0"
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}
