export const LIFECYCLE_STATES = [
  "planned",
  "experimental",
  "active",
  "deprecated",
  "retired",
] as const;

/** Package registry extends lifecycle states with `active-exempt` (tooling/docs). */
export const PACKAGE_REGISTRY_LIFECYCLE_EXTENSIONS = ["active-exempt"] as const;

export type LifecycleState = (typeof LIFECYCLE_STATES)[number];

export const FORBIDDEN_PACKAGE_NAME_PATTERNS = [
  /-v\d+$/u,
  /-new$/u,
  /-temp$/u,
  /-modern$/u,
  /-refactor$/u,
  /-rewrite$/u,
  /-next$/u,
] as const;

export interface LifecycleContract {
  readonly experimentalMaxDays: number;
  readonly maxDeprecationMonths: number;
}
