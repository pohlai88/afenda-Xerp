// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "default" | "lg" | "sm";

export interface ToggleProps
  extends ComponentProps<typeof TogglePrimitive.Root> {
  readonly size?: ToggleSize;
  readonly variant?: ToggleVariant;
}

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

export function Toggle({
  className,
  size = "default",
  variant = "default",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive.Root
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        typeof className === "string" ? className : undefined
      )}
      data-slot="toggle"
    />
  );
}
