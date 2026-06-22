/**
 * Project authority stub (TIP-030) — no `projects` table in this slice.
 * Aligns with `@afenda/kernel` `ProjectContext` for future persistence.
 */
export const PROJECT_DOMAIN_STATUS = "planned" as const;

export type ProjectDomainStatus = typeof PROJECT_DOMAIN_STATUS;

export const PROJECT_LIFECYCLE_STATUSES = [
  "draft",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

export type ProjectLifecycleStatus =
  (typeof PROJECT_LIFECYCLE_STATUSES)[number];

/** Serializable authority record shape for future `projects` table (TIP-030). */
export interface ProjectAuthorityRecord {
  readonly companyId: string | null;
  readonly displayName: string;
  readonly organizationUnitId: string | null;
  readonly projectId: string;
  readonly slug: string;
  readonly status: ProjectLifecycleStatus;
  readonly tenantId: string;
}
