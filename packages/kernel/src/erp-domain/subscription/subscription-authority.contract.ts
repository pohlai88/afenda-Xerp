/**
 * PAS-001B B93 — Subscription domain authority (kernel contracts-only lifecycle).
 */

export const SUBSCRIPTION_AUTHORITY_PAS = "PAS-001B" as const;

export const SUBSCRIPTION_REGISTRY_ID =
  "PKGR01B_SUBSCRIPTION_VOCABULARY" as const;

export const SUBSCRIPTION_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/subscription" as const;

export const SUBSCRIPTION_AUTHORITY_FINGERPRINT =
  "SUBSCRIPTION-AUTHORITY-2026-06-28-v1" as const;

export const SUBSCRIPTION_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type SubscriptionPackageLifecyclePhase =
  (typeof SUBSCRIPTION_PACKAGE_LIFECYCLE_PHASES)[number];

export const SUBSCRIPTION_PACKAGE_LIFECYCLE: SubscriptionPackageLifecyclePhase =
  "contracts-only";

export function isSubscriptionPackageLifecyclePhase(
  value: string
): value is SubscriptionPackageLifecyclePhase {
  return (SUBSCRIPTION_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
