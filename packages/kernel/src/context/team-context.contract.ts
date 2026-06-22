import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

/**
 * Execution team authority (TIP-030 dedicated table planned).
 *
 * Storage: `organizations` row with `type = "team"` — see
 * `@afenda/database` `TEAM_ORGANIZATION_UNIT_TYPE` and `findTeamById()`.
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
