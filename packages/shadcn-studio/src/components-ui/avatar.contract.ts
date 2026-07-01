/** Gold reference (v1.2.0) — Root → Image → Fallback; composition Badge, Group, GroupCount slots. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

/** Stable id for metadata binding / diagnostics registries. */
export const AVATAR_PRIMITIVE_ID = "shadcn-studio.ui.avatar" as const;
export type AvatarPrimitiveId = typeof AVATAR_PRIMITIVE_ID;

export const AVATAR_SLOTS = {
  root: "avatar",
  image: "avatar-image",
  fallback: "avatar-fallback",
  badge: "avatar-badge",
  group: "avatar-group",
  groupCount: "avatar-group-count",
} as const;

export type AvatarSlotMap = typeof AVATAR_SLOTS;
export type AvatarSlot = AvatarSlotMap[keyof AvatarSlotMap];

export const avatarRootClassName =
  "group/avatar relative flex size-8 shrink-0 select-none rounded-full after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=profile]:size-20 data-[size=sm]:size-6 dark:after:mix-blend-lighten" as const;

export const avatarImageClassName =
  "aspect-square size-full rounded-full object-cover" as const;

export const avatarFallbackClassName =
  "flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm group-data-[size=profile]/avatar:text-xl group-data-[size=sm]/avatar:text-xs" as const;

export const avatarBadgeClassName =
  "absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2" as const;

export const avatarGroupClassName =
  "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background" as const;

export const avatarGroupCountClassName =
  "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3" as const;

/** JSON-serializable metadata payload for binding registries. */
export function avatarPrimitiveMetadata() {
  return {
    id: AVATAR_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: AVATAR_SLOTS,
  } as const;
}
