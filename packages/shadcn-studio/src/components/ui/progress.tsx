"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  PROGRESS_SLOTS,
  progressIndicatorClassName,
  progressLabelClassName,
  progressRootClassName,
  progressTrackClassName,
  progressValueClassName,
} from "./progress.contract.js";

type ProgressProps = WithoutGovernedDataSlot<ProgressPrimitive.Root.Props>;
type ProgressTrackProps =
  WithoutGovernedDataSlot<ProgressPrimitive.Track.Props>;
type ProgressIndicatorProps =
  WithoutGovernedDataSlot<ProgressPrimitive.Indicator.Props>;
type ProgressLabelProps =
  WithoutGovernedDataSlot<ProgressPrimitive.Label.Props>;
type ProgressValueProps =
  WithoutGovernedDataSlot<ProgressPrimitive.Value.Props>;

function Progress({ className, children, value, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      {...props}
      className={cn(progressRootClassName, className)}
      data-slot={PROGRESS_SLOTS.root}
      value={value}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
}

function ProgressTrack({ className, ...props }: ProgressTrackProps) {
  return (
    <ProgressPrimitive.Track
      {...props}
      className={cn(progressTrackClassName, className)}
      data-slot={PROGRESS_SLOTS.track}
    />
  );
}

function ProgressIndicator({ className, ...props }: ProgressIndicatorProps) {
  return (
    <ProgressPrimitive.Indicator
      {...props}
      className={cn(progressIndicatorClassName, className)}
      data-slot={PROGRESS_SLOTS.indicator}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressLabelProps) {
  return (
    <ProgressPrimitive.Label
      {...props}
      className={cn(progressLabelClassName, className)}
      data-slot={PROGRESS_SLOTS.label}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressValueProps) {
  return (
    <ProgressPrimitive.Value
      {...props}
      className={cn(progressValueClassName, className)}
      data-slot={PROGRESS_SLOTS.value}
    />
  );
}

export type { ProgressSlot } from "./progress.contract.js";
export type {
  ProgressIndicatorProps,
  ProgressLabelProps,
  ProgressProps,
  ProgressTrackProps,
  ProgressValueProps,
};
export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
};
