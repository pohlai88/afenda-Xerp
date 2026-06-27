import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

/**
 * PAS-001 §4.4 — execution team **operating-context shape** (serializable slice).
 *
 * Kernel owns the wire fields on `OperatingContext.team` — not team persistence,
 * membership, or resolver logic (those live in `@afenda/database` + `apps/erp`).
 *
 * Storage note: teams may be backed by `organizations` rows with `type = "team"`.
 */
export interface TeamContext {
  readonly companyId: string | null;
  readonly displayName: string;
  readonly organizationUnitId: string | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly teamId: string;
  readonly tenantId: string;
}
