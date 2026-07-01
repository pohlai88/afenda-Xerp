export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const CIRCULAR_PROGRESS_PRIMITIVE_ID =
  "shadcn-studio.ui.circular-progress" as const;
export type CircularProgressPrimitiveId = typeof CIRCULAR_PROGRESS_PRIMITIVE_ID;

export const CIRCULAR_PROGRESS_SLOTS = {
  root: "circular-progress",
  label: "circular-progress-label",
} as const;

export type CircularProgressSlotMap = typeof CIRCULAR_PROGRESS_SLOTS;
export type CircularProgressSlot =
  CircularProgressSlotMap[keyof CircularProgressSlotMap];

export const circularProgressRootClassName =
  "relative flex shrink-0 items-center justify-center" as const;

export const circularProgressSvgClassNameAnimated =
  "size-full overflow-visible" as const;

export const circularProgressSvgClassNameDefault =
  "size-full -rotate-90 overflow-visible" as const;

export const circularProgressTrackClassNameAnimated =
  "text-primary/10 transition-all duration-1000 ease-in-out" as const;

export const circularProgressBarClassNameAnimated =
  "transition-all duration-1000 ease-in-out" as const;

export const circularProgressTrackClassNameDefault = "text-primary/20" as const;

export const circularProgressBarClassNameDefault =
  "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" as const;

export const circularProgressLabelClassNameAnimated =
  "absolute inset-0 flex items-center justify-center font-medium text-lg" as const;

export const circularProgressLabelClassNameDefault =
  "absolute inset-0 flex items-center justify-center font-medium text-base" as const;

export function circularProgressPrimitiveMetadata() {
  return {
    id: CIRCULAR_PROGRESS_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: CIRCULAR_PROGRESS_SLOTS,
  } as const;
}
