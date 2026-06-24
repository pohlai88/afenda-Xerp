import type { TenantStatus } from "@afenda/database";

export {
  getTenantAccessBlockReason,
  isTenantOperational,
} from "@afenda/database";

/** @deprecated Use `TenantStatus` from `@afenda/database` — alias retained for consumers. */
export type PlatformTenantStatus = TenantStatus;

/** Hard platform isolation boundary for authorization. */
export interface TenantContract {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly status: PlatformTenantStatus;
}
