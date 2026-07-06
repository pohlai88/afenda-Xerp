"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface ProgressProps
  extends Omit<ComponentProps<typeof ProgressPrimitive.Root>, "className"> {
  readonly className?: string | undefined;
}
export interface ProgressTrackProps
  extends Omit<ComponentProps<typeof ProgressPrimitive.Track>, "className"> {
  readonly className?: string | undefined;
}
export interface ProgressIndicatorProps
  extends Omit<
    ComponentProps<typeof ProgressPrimitive.Indicator>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface ProgressValueProps
  extends Omit<ComponentProps<typeof ProgressPrimitive.Value>, "className"> {
  readonly className?: string | undefined;
}

const PROGRESS_BASE_CLASS = "relative w-full";
const PROGRESS_TRACK_CLASS =
  "relative h-2 w-full overflow-hidden rounded-full bg-secondary";
const PROGRESS_INDICATOR_CLASS =
  "h-full w-full flex-1 bg-primary transition-all";
const PROGRESS_VALUE_CLASS = "text-muted-foreground text-xs tabular-nums";

export function progressClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(PROGRESS_BASE_CLASS, className);
}

export function progressTrackClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(PROGRESS_TRACK_CLASS, className);
}

export function progressIndicatorClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(PROGRESS_INDICATOR_CLASS, className);
}

export function progressValueClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(PROGRESS_VALUE_CLASS, className);
}

export function Progress({ className, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      {...props}
      className={progressClassName({ className })}
      data-slot="progress"
    />
  );
}

export function ProgressTrack({ className, ...props }: ProgressTrackProps) {
  return (
    <ProgressPrimitive.Track
      {...props}
      className={progressTrackClassName({ className })}
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
      className={progressIndicatorClassName({ className })}
      data-slot="progress-indicator"
    />
  );
}

export function ProgressValue({ className, ...props }: ProgressValueProps) {
  return (
    <ProgressPrimitive.Value
      {...props}
      className={progressValueClassName({ className })}
      data-slot="progress-value"
    />
  );
}
