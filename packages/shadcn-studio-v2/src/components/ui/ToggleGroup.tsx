// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import type { ToggleSize, ToggleVariant } from "./Toggle";

export interface ToggleGroupProps
  extends ComponentProps<typeof ToggleGroupPrimitive.Root> {}
export interface ToggleGroupItemProps
  extends ComponentProps<typeof ToggleGroupPrimitive.Item> {
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

export function ToggleGroup({ className, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1",
        typeof className === "string" ? className : undefined
      )}
      data-slot="toggle-group"
    />
  );
}

export function ToggleGroupItem({
  className,
  size = "default",
  variant = "default",
  ...props
}: ToggleGroupItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        typeof className === "string" ? className : undefined
      )}
      data-slot="toggle-group-item"
    />
  );
}
