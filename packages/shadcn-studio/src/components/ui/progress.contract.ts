export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const PROGRESS_PRIMITIVE_ID = "shadcn-studio.ui.progress" as const;
export type ProgressPrimitiveId = typeof PROGRESS_PRIMITIVE_ID;

export const PROGRESS_SLOTS = {
  root: "progress",
  track: "progress-track",
  indicator: "progress-indicator",
  label: "progress-label",
  value: "progress-value",
} as const;

export type ProgressSlotMap = typeof PROGRESS_SLOTS;
export type ProgressSlot = ProgressSlotMap[keyof ProgressSlotMap];

export const progressRootClassName = "flex flex-wrap gap-3" as const;

export const progressTrackClassName =
  "relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full bg-muted" as const;

export const progressIndicatorClassName =
  "h-full bg-primary transition-all" as const;

export const progressLabelClassName = "font-medium text-sm" as const;

export const progressValueClassName =
  "ml-auto text-muted-foreground text-sm tabular-nums" as const;

export function progressPrimitiveMetadata() {
  return {
    id: PROGRESS_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: PROGRESS_SLOTS,
  } as const;
}
