import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

/** Serializable tenant authority slice — SaaS isolation boundary only. */
export interface TenantContext {
  readonly displayName: string;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: string;
}
