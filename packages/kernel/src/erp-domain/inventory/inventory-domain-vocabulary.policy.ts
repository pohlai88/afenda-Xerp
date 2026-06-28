/**
 * PAS-001B — prohibited inventory runtime surfaces (contracts-only lifecycle).
 */

export const INVENTORY_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "stock-posting-service",
  "inventory-valuation-engine",
  "warehouse-allocation-service",
  "inventory-database-runtime",
  "inventory-package-recreation",
  "lot-expiry-calculation",
  "reorder-point-optimizer",
  "physical-count-posting",
] as const;

export type InventoryDomainProhibitedRuntimeSurface =
  (typeof INVENTORY_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const INVENTORY_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B79" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe inventory words. It must not execute stock posting or valuation." as const,
  prohibitedRuntimeSurfaces: INVENTORY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "ProductId, WarehouseId, and SupplierId remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:inventory-domain-contracts" as const,
} as const;
