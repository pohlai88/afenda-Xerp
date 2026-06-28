import type {
  CompanyId,
  OrganizationId,
  ProjectId,
  TenantId,
} from "../identity/index.js";

export const PROJECT_LIFECYCLE_STATUSES = [
  "draft",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

export type ProjectLifecycleStatus =
  (typeof PROJECT_LIFECYCLE_STATUSES)[number];

/**
 * Project authority stub (TIP-030) — kernel wire triad; persistence resolver in `@afenda/database` + `apps/erp`.
 */
export interface ProjectContext {
  readonly companyId: CompanyId | null;
  readonly displayName: string;
  readonly organizationUnitId: OrganizationId | null;
  readonly projectId: ProjectId;
  readonly slug: string;
  readonly status: ProjectLifecycleStatus;
  readonly tenantId: TenantId;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface ProjectWireContext {
  readonly companyId: string | null;
  readonly displayName: string;
  readonly organizationUnitId: string | null;
  readonly projectId: string;
  readonly slug: string;
  readonly status: ProjectLifecycleStatus;
  readonly tenantId: string;
}
