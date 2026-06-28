export const ASSETS_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "depreciation-posting-service",
  "asset-valuation-engine",
  "assets-database-runtime",
] as const;

export type AssetsDomainProhibitedRuntimeSurface =
  (typeof ASSETS_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const ASSETS_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B102" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe fixed asset words. It must not execute depreciation posting runtime." as const,
  prohibitedRuntimeSurfaces: ASSETS_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "AssetLocationId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
