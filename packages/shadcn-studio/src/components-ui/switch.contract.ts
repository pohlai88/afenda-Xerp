export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

/** Visual variant axis — outline (switch-06) reads better on dark / brand surfaces. */
export const SWITCH_VARIANTS = ["default", "outline"] as const;
export type SwitchVariant = (typeof SWITCH_VARIANTS)[number];

export const SWITCH_PRIMITIVE_ID = "shadcn-studio.ui.switch" as const;
export type SwitchPrimitiveId = typeof SWITCH_PRIMITIVE_ID;

export const SWITCH_SLOTS = {
  root: "switch",
  thumb: "switch-thumb",
} as const;

export type SwitchSlotMap = typeof SWITCH_SLOTS;
export type SwitchSlot = SwitchSlotMap[keyof SwitchSlotMap];

const switchSharedRootClassName =
  "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=sm]:h-[14px] data-[size=default]:w-[32px] data-[size=sm]:w-[24px] data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40" as const;

/** Thumb motion + sizing only — color comes from root (default) or switch-06 `[&_span]` overrides (outline). */
export const switchThumbMotionClassName =
  "pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-unchecked:translate-x-0" as const;

/** AdminCN default — base-vega fill track + background thumb. */
export const switchRootClassName =
  `${switchSharedRootClassName} focus-visible:border-ring focus-visible:ring-ring/50 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80` as const;

export const switchThumbClassName =
  `${switchThumbMotionClassName} bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground` as const;

/**
 * shadcn/studio switch-06 — applied ON TOP of `switchRootClassName` via `cn()`.
 * Uses `[&_span]` like the registry demo (Base UI Thumb renders as span).
 * Do not add parallel thumb color classes when outline is active.
 */
export const switchOutline06PrimaryClassName =
  "focus-visible:border-primary data-checked:[&_span]:bg-primary dark:data-checked:[&_span]:bg-primary data-checked:border-primary data-checked:[&_span]:border-background data-checked:bg-transparent [&_span]:border" as const;

export const switchOutline06DestructiveClassName =
  "focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 data-checked:[&_span]:bg-destructive dark:data-checked:[&_span]:bg-destructive data-checked:border-destructive data-checked:[&_span]:border-background data-checked:bg-transparent [&_span]:border" as const;

export const switchOutline06SuccessClassName =
  "data-checked:[&_span]:border-background focus-visible:border-green-600 focus-visible:ring-green-600/20 data-checked:border-green-600 data-checked:bg-transparent dark:focus-visible:border-green-400 dark:focus-visible:ring-green-400/40 dark:data-checked:border-green-400 [&_span]:border data-checked:[&_span]:bg-green-600 dark:data-checked:[&_span]:bg-green-400" as const;

export const switchOutline06InfoClassName =
  "data-checked:[&_span]:border-background focus-visible:border-sky-600 focus-visible:ring-sky-600/20 data-checked:border-sky-600 data-checked:bg-transparent dark:focus-visible:border-sky-400 dark:focus-visible:ring-sky-400/40 dark:data-checked:border-sky-400 [&_span]:border data-checked:[&_span]:bg-sky-600 dark:data-checked:[&_span]:bg-sky-400" as const;

export const switchOutline06WarningClassName =
  "data-checked:[&_span]:border-background focus-visible:border-amber-600 focus-visible:ring-amber-600/20 data-checked:border-amber-600 data-checked:bg-transparent dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-400/40 dark:data-checked:border-amber-400 [&_span]:border data-checked:[&_span]:bg-amber-600 dark:data-checked:[&_span]:bg-amber-400" as const;

/** @deprecated Use switchOutline06PrimaryClassName — merged on root, not split root/thumb. */
export const switchOutlineRootClassName = switchOutline06PrimaryClassName;

/** @deprecated Outline color is driven by switch-06 `[&_span]` on root. */
export const switchOutlineThumbClassName = switchThumbMotionClassName;

/** @deprecated Use switchOutline06SuccessClassName / switchOutline06InfoClassName (switch-06 outline). */
export const switchSemanticSuccessClassName = switchOutline06SuccessClassName;

/** @deprecated Use switchOutline06InfoClassName. */
export const switchSemanticInfoClassName = switchOutline06InfoClassName;

export function switchPrimitiveMetadata() {
  return {
    id: SWITCH_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SWITCH_SLOTS,
    variants: SWITCH_VARIANTS,
  } as const;
}
