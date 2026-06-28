import type {
  CompanyId,
  OrganizationId,
  TeamId,
  TenantId,
} from "../identity/index.js";
import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

/**
 * Team authority id — dedicated `tea_*` rows or org-backed selection (`org_*`) until
 * operating-context resolver loads `teams` table ids exclusively (TIP-030).
 */
export type TeamAuthorityId = TeamId | OrganizationId;

/**
 * PAS-001 §4.4 — execution team **operating-context shape** (serializable slice).
 *
 * Kernel owns wire ingress triad and branded fields on `OperatingContext.team`.
 * Persistence and resolver logic live in `@afenda/database` + `apps/erp`.
 *
 * Storage note: teams may be backed by `organizations` rows with `type = "team"`.
 */
export interface TeamContext {
  readonly companyId: CompanyId | null;
  readonly displayName: string;
  readonly organizationUnitId: OrganizationId | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly teamId: TeamAuthorityId;
  readonly tenantId: TenantId;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface TeamWireContext {
  readonly companyId: string | null;
  readonly displayName: string;
  readonly organizationUnitId: string | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly teamId: string;
  readonly tenantId: string;
}
