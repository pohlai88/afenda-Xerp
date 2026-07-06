"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "default" | "lg" | "sm";

export interface ToggleProps
  extends Omit<ComponentProps<typeof TogglePrimitive>, "className"> {
  readonly className?: string | undefined;
  readonly size?: ToggleSize;
  readonly variant?: ToggleVariant;
}

const TOGGLE_BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors outline-none hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-accent data-[pressed]:text-accent-foreground";

const VARIANT_CLASSES = {
  default: "bg-transparent",
  outline:
    "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
} satisfies Record<ToggleVariant, string>;

const SIZE_CLASSES = {
  default: "h-10 px-3 min-w-10",
  lg: "h-11 px-5 min-w-11",
  sm: "h-9 px-2.5 min-w-9",
} satisfies Record<ToggleSize, string>;

export function toggleClassName({
  className,
  size = "default",
  variant = "default",
}: {
  readonly className?: string | undefined;
  readonly size?: ToggleSize;
  readonly variant?: ToggleVariant;
} = {}): string {
  return cn(
    TOGGLE_BASE_CLASS,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );
}

export function Toggle({
  className,
  size = "default",
  variant = "default",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      {...props}
      className={toggleClassName({ className, size, variant })}
      data-slot="toggle"
    />
  );
}
