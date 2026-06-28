/**
 * PAS-001B B89 — SupplyChain domain authority (kernel contracts-only lifecycle).
 */

export const SUPPLY_CHAIN_AUTHORITY_PAS = "PAS-001B" as const;

export const SUPPLY_CHAIN_REGISTRY_ID =
  "PKGR01B_SUPPLY_CHAIN_VOCABULARY" as const;

export const SUPPLY_CHAIN_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/supply-chain" as const;

export const SUPPLY_CHAIN_AUTHORITY_FINGERPRINT =
  "SUPPLY_CHAIN-AUTHORITY-2026-06-28-v1" as const;

export const SUPPLY_CHAIN_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type SupplyChainPackageLifecyclePhase =
  (typeof SUPPLY_CHAIN_PACKAGE_LIFECYCLE_PHASES)[number];

export const SUPPLY_CHAIN_PACKAGE_LIFECYCLE: SupplyChainPackageLifecyclePhase =
  "contracts-only";

export function isSupplyChainPackageLifecyclePhase(
  value: string
): value is SupplyChainPackageLifecyclePhase {
  return (SUPPLY_CHAIN_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
