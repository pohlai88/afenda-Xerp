export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const SKELETON_PRIMITIVE_ID = "shadcn-studio.ui.skeleton" as const;
export type SkeletonPrimitiveId = typeof SKELETON_PRIMITIVE_ID;

export const SKELETON_SLOTS = {
  root: "skeleton",
} as const;

export type SkeletonSlotMap = typeof SKELETON_SLOTS;
export type SkeletonSlot = SkeletonSlotMap[keyof SkeletonSlotMap];

export const skeletonRootClassName =
  "animate-pulse rounded-md bg-muted" as const;

export function skeletonPrimitiveMetadata() {
  return {
    id: SKELETON_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: SKELETON_SLOTS,
  } as const;
}
