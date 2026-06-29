import type { TenantId } from "../identity/index.js";
import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";
import type { TenantSaasLifecyclePhase } from "./tenant-saas-lifecycle.contract.js";

/**
 * PAS-001 §4.4 — tenant operating-context shape (serializable slice). SaaS isolation boundary only.
 *
 * Wire ingress uses `TenantWireContext` + `tenant-context.{assert,parser}.ts`.
 * ERP resolver maps database `enterpriseId` → branded `TenantId` at the trust boundary.
 *
 * `status` — entity/platform slot lifecycle (`PlatformLifecycleStatus`).
 * `saasLifecyclePhase` — tenant SaaS lifecycle words (Kernel NS §8.3); optional until ERP maps it.
 */
export interface TenantContext {
  readonly displayName: string;
  readonly saasLifecyclePhase?: TenantSaasLifecyclePhase;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: TenantId;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface TenantWireContext {
  readonly displayName: string;
  readonly saasLifecyclePhase?: string;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: string;
}
