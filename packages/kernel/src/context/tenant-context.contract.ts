import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

/** PAS-001 §4.4 — tenant operating-context shape (serializable slice). SaaS isolation boundary only. */
export interface TenantContext {
  readonly displayName: string;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: string;
}
