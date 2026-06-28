export const MANUFACTURING_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "production-posting-service",
  "mrp-engine",
  "manufacturing-database-runtime",
] as const;

export type ManufacturingDomainProhibitedRuntimeSurface =
  (typeof MANUFACTURING_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const MANUFACTURING_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B86" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe manufacturing words. It must not execute production posting runtime." as const,
  prohibitedRuntimeSurfaces: MANUFACTURING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "ProductId and WarehouseId remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
