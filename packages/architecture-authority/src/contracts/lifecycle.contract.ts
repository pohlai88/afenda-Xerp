export const LIFECYCLE_STATES = [
  "planned",
  "experimental",
  "active",
  "deprecated",
  "retired",
] as const;

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
