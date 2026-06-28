import type { CompanyId, EntityGroupId, TenantId } from "../identity/index.js";
import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

/**
 * Corporate group authority (TIP-008).
 *
 * Kernel owns wire ingress triad and branded fields on `OperatingContext.entityGroup`.
 * Persistence and resolver logic live in `@afenda/database` + `apps/erp`.
 */
export interface EntityGroupContext {
  readonly displayName: string;
  readonly entityGroupId: EntityGroupId;
  readonly parentLegalEntityId: CompanyId | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: TenantId;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface EntityGroupWireContext {
  readonly displayName: string;
  readonly entityGroupId: string;
  readonly parentLegalEntityId: string | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: string;
}
