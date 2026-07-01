export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const BACKGROUND_RIPPLE_PRIMITIVE_ID =
  "shadcn-studio.ui.background-ripple" as const;
export type BackgroundRipplePrimitiveId = typeof BACKGROUND_RIPPLE_PRIMITIVE_ID;

export const BACKGROUND_RIPPLE_SLOTS = {
  root: "background-ripple",
  inner: "background-ripple-inner",
  overlay: "background-ripple-overlay",
  grid: "background-ripple-grid",
  cell: "background-ripple-cell",
} as const;

export type BackgroundRippleSlotMap = typeof BACKGROUND_RIPPLE_SLOTS;
export type BackgroundRippleSlot =
  BackgroundRippleSlotMap[keyof BackgroundRippleSlotMap];

export const backgroundRippleRootClassName =
  "absolute inset-0 h-full w-full object-center [--cell-border-color:color-mix(in_oklab,var(--accent),black_10%)] [--cell-fill-color:var(--accent)] [--cell-shadow-color:color-mix(in_oklab,var(--accent),black_43%)] dark:[--cell-border-color:color-mix(in_oklab,var(--accent),white_14%)] dark:[--cell-fill-color:color-mix(in_oklab,var(--accent),white_14%)] dark:[--cell-shadow-color:var(--accent)]" as const;

export const backgroundRippleInnerClassName =
  "relative flex h-auto w-auto justify-center overflow-hidden" as const;

export const backgroundRippleOverlayClassName =
  "pointer-events-none absolute inset-0 z-2 h-full w-full overflow-hidden" as const;

export const backgroundRippleGridClassName =
  "relative z-3 mask-radial-from-20% mask-radial-at-top opacity-600" as const;

export const backgroundRippleCellClassName =
  "cell pointer-events-none relative border-[0.5px] opacity-40 transition-[transform,opacity,filter] duration-2500 ease-in-out will-change-transform dark:shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset]" as const;

export function backgroundRipplePrimitiveMetadata() {
  return {
    id: BACKGROUND_RIPPLE_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: BACKGROUND_RIPPLE_SLOTS,
  } as const;
}
