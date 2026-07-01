export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const BORDER_BEAM_PRIMITIVE_ID = "shadcn-studio.ui.border-beam" as const;
export type BorderBeamPrimitiveId = typeof BORDER_BEAM_PRIMITIVE_ID;

export const BORDER_BEAM_SLOTS = {
  root: "border-beam",
  beam: "border-beam-beam",
} as const;

export type BorderBeamSlotMap = typeof BORDER_BEAM_SLOTS;
export type BorderBeamSlot = BorderBeamSlotMap[keyof BorderBeamSlotMap];

export const borderBeamRootClassName =
  "border-(length:--border-beam-width) mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect pointer-events-none absolute inset-0 rounded-[inherit] border-transparent [mask-clip:padding-box,border-box]" as const;

export const borderBeamBeamClassName =
  "absolute aspect-square rounded-full bg-linear-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent" as const;

export function borderBeamPrimitiveMetadata() {
  return {
    id: BORDER_BEAM_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: BORDER_BEAM_SLOTS,
  } as const;
}
