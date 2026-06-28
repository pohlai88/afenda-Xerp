export const SUPPLY_CHAIN_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "fulfillment-posting-service",
  "tms-routing-engine",
  "supply-chain-database-runtime",
] as const;

export type SupplyChainDomainProhibitedRuntimeSurface =
  (typeof SUPPLY_CHAIN_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const SUPPLY_CHAIN_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B89" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe supply-chain orchestration words. It must not subsume inventory or procurement runtime." as const,
  prohibitedRuntimeSurfaces: SUPPLY_CHAIN_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "WarehouseId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
