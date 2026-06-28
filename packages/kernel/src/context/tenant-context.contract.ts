import type { TenantId } from "../identity/index.js";
import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

/**
 * PAS-001 §4.4 — tenant operating-context shape (serializable slice). SaaS isolation boundary only.
 *
 * Wire ingress uses `TenantWireContext` + `tenant-context.{assert,parser}.ts`.
 * ERP resolver maps database `enterpriseId` → branded `TenantId` at the trust boundary.
 */
export interface TenantContext {
  readonly displayName: string;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: TenantId;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface TenantWireContext {
  readonly displayName: string;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: string;
}
