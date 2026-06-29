/** Entity/org platform slot lifecycle — not tenant SaaS lifecycle (see `tenant-saas-lifecycle.contract.ts`). */

export const PLATFORM_LIFECYCLE_STATUSES = [
  "active",
  "suspended",
  "archived",
] as const;

export type PlatformLifecycleStatus =
  (typeof PLATFORM_LIFECYCLE_STATUSES)[number];
