// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface ProgressProps
  extends ComponentProps<typeof ProgressPrimitive.Root> {}
export interface ProgressTrackProps
  extends ComponentProps<typeof ProgressPrimitive.Track> {}
export interface ProgressIndicatorProps
  extends ComponentProps<typeof ProgressPrimitive.Indicator> {}
export interface ProgressValueProps
  extends ComponentProps<typeof ProgressPrimitive.Value> {}

export function Progress({ className, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      {...props}
      className={cn(
        "relative w-full",
        typeof className === "string" ? className : undefined
      )}
      data-slot="progress"
    />
  );
}

export function ProgressTrack({ className, ...props }: ProgressTrackProps) {
  return (
    <ProgressPrimitive.Track
      {...props}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        typeof className === "string" ? className : undefined
      )}
      data-slot="progress-track"
    />
  );
}

export function ProgressIndicator({
  className,
  ...props
}: ProgressIndicatorProps) {
  return (
    <ProgressPrimitive.Indicator
      {...props}
      className={cn(
        "h-full w-full flex-1 bg-primary transition-all",
        typeof className === "string" ? className : undefined
      )}
      data-slot="progress-indicator"
    />
  );
}

export function ProgressValue({ className, ...props }: ProgressValueProps) {
  return (
    <ProgressPrimitive.Value
      {...props}
      className={cn(
        "text-muted-foreground text-xs tabular-nums",
        typeof className === "string" ? className : undefined
      )}
      data-slot="progress-value"
    />
  );
}
