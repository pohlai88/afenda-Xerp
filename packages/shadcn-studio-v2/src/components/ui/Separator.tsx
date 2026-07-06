// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface SeparatorProps
  extends ComponentProps<typeof SeparatorPrimitive> {}

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      {...props}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        typeof className === "string" ? className : undefined
      )}
      data-orientation={orientation}
      data-slot="separator"
      orientation={orientation}
    />
  );
}
