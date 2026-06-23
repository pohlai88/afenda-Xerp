export const PROJECT_LIFECYCLE_STATUSES = [
  "draft",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

export type ProjectLifecycleStatus =
  (typeof PROJECT_LIFECYCLE_STATUSES)[number];

/** Project authority stub (TIP-030) — no `projects` table in this slice. */
export interface ProjectContext {
  readonly companyId: string | null;
  readonly displayName: string;
  readonly organizationUnitId: string | null;
  readonly projectId: string;
  readonly slug: string;
  readonly status: ProjectLifecycleStatus;
  readonly tenantId: string;
}
