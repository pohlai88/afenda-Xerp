/** Shared lifecycle vocabulary for serializable operating-context contracts. */

export const PLATFORM_LIFECYCLE_STATUSES = [
  "active",
  "suspended",
  "archived",
] as const;

export type PlatformLifecycleStatus =
  (typeof PLATFORM_LIFECYCLE_STATUSES)[number];
