export const PROJECT_PERMISSION_DOMAINS = [
  "project",
  "task",
  "timesheet",
] as const;

export type ProjectPermissionDomain =
  (typeof PROJECT_PERMISSION_DOMAINS)[number];

export const PROJECT_PERMISSION_ACTIONS = {
  project: ["read", "create", "close"] as const,
  task: ["read", "create", "manage"] as const,
  timesheet: ["read", "submit", "approve"] as const,
} as const satisfies Record<ProjectPermissionDomain, readonly string[]>;

export type ProjectPermissionAction<
  TDomain extends ProjectPermissionDomain = ProjectPermissionDomain,
> = (typeof PROJECT_PERMISSION_ACTIONS)[TDomain][number];

export function toProjectPermissionKey(
  domain: ProjectPermissionDomain,
  action: ProjectPermissionAction
): string {
  return `project.${domain}_${action}`;
}

export const PROJECT_PERMISSION_KEY_VOCABULARY = [
  toProjectPermissionKey("project", "read"),
  toProjectPermissionKey("project", "create"),
  toProjectPermissionKey("project", "close"),
  toProjectPermissionKey("task", "read"),
  toProjectPermissionKey("task", "create"),
  toProjectPermissionKey("task", "manage"),
  toProjectPermissionKey("timesheet", "read"),
  toProjectPermissionKey("timesheet", "submit"),
  toProjectPermissionKey("timesheet", "approve"),
] as const;

export type ProjectPermissionKey =
  (typeof PROJECT_PERMISSION_KEY_VOCABULARY)[number];
