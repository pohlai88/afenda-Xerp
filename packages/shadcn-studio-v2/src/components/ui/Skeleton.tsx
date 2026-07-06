import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface SkeletonProps extends ComponentProps<"div"> {}

export function Skeleton({
  className,
  "aria-busy": ariaBusy,
  "aria-hidden": ariaHidden,
  ...props
}: SkeletonProps) {
  const isDecorative = ariaHidden === true || ariaHidden === "true";

  return (
    <div
      {...props}
      aria-busy={ariaBusy ?? (isDecorative ? undefined : true)}
      aria-hidden={ariaHidden}
      className={cn("animate-pulse rounded-md bg-muted", className)}
      data-slot="skeleton"
    />
  );
}
