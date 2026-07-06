"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { type ToggleSize, type ToggleVariant, toggleClassName } from "./toggle";

export interface ToggleGroupProps
  extends Omit<ComponentProps<typeof ToggleGroupPrimitive>, "className"> {
  readonly className?: string | undefined;
}

export interface ToggleGroupItemProps
  extends Omit<ComponentProps<typeof TogglePrimitive>, "className"> {
  readonly className?: string | undefined;
  readonly size?: ToggleSize;
  readonly variant?: ToggleVariant;
}

export function ToggleGroup({ className, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      {...props}
      className={cn("inline-flex items-center justify-center gap-1", className)}
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
    <TogglePrimitive
      {...props}
      className={toggleClassName({ className, size, variant })}
      data-slot="toggle-group-item"
    />
  );
}
