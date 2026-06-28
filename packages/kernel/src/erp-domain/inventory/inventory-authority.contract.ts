/**
 * ADR-0020 — Inventory domain authority (kernel contracts-only lifecycle).
 * Serializable surface only; no stock posting, valuation engines, or persistence.
 */

export const INVENTORY_AUTHORITY_ADR = "ADR-0020" as const;

export const INVENTORY_REGISTRY_ID = "PKGR02_INVENTORY" as const;

export const INVENTORY_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/inventory" as const;

export const INVENTORY_AUTHORITY_FINGERPRINT =
  "INVENTORY-AUTHORITY-2026-06-28-v1" as const;

export const INVENTORY_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type InventoryPackageLifecyclePhase =
  (typeof INVENTORY_PACKAGE_LIFECYCLE_PHASES)[number];

/** Current PKGR02 vocabulary phase — stock runtime remains in @afenda/database ADR scope. */
export const INVENTORY_PACKAGE_LIFECYCLE: InventoryPackageLifecyclePhase =
  "contracts-only";

export function isInventoryPackageLifecyclePhase(
  value: string
): value is InventoryPackageLifecyclePhase {
  return (INVENTORY_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
