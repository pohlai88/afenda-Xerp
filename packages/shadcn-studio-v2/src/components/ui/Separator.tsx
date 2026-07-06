"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface SeparatorProps
  extends Omit<ComponentProps<typeof SeparatorPrimitive>, "className"> {
  readonly className?: string | undefined;
}

const SEPARATOR_BASE_CLASS = "shrink-0 bg-border";

export function separatorClassName({
  className,
  orientation = "horizontal",
}: {
  readonly className?: string | undefined;
  readonly orientation?: SeparatorProps["orientation"];
} = {}): string {
  return cn(
    SEPARATOR_BASE_CLASS,
    orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
    className
  );
}

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      {...props}
      className={separatorClassName({ className, orientation })}
      data-orientation={orientation}
      data-slot="separator"
      orientation={orientation}
    />
  );
}
