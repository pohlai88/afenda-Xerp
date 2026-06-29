/**
 * PAS-001 amendment — tenant SaaS lifecycle vocabulary (Kernel NS §8.3 · E11).
 *
 * Distinct from `PlatformLifecycleStatus` on entity/org context slots (`lifecycle.contract.ts`).
 * Provisioning and offboarding execution live outside kernel — words only.
 */

export const TENANT_SAAS_LIFECYCLE_PHASES = [
  "provisioned",
  "active",
  "suspended",
  "offboarded",
] as const;

export type TenantSaasLifecyclePhase =
  (typeof TENANT_SAAS_LIFECYCLE_PHASES)[number];

export interface TenantSaasLifecycleVocabulary {
  readonly phase: TenantSaasLifecyclePhase;
}

/** JSON/wire format — parse via `tenant-saas-lifecycle.parser.ts` at ingress. */
export interface WireTenantSaasLifecycleVocabulary {
  readonly phase: string;
}

export function isTenantSaasLifecyclePhase(
  value: string
): value is TenantSaasLifecyclePhase {
  return (TENANT_SAAS_LIFECYCLE_PHASES as readonly string[]).includes(value);
}
