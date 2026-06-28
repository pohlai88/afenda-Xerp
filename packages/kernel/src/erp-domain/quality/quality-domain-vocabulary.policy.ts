export const QUALITY_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "quality-posting-service",
  "inspection-engine",
  "quality-database-runtime",
] as const;

export type QualityDomainProhibitedRuntimeSurface =
  (typeof QUALITY_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const QUALITY_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B87" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe quality words. It must not execute inspection posting runtime." as const,
  prohibitedRuntimeSurfaces: QUALITY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "ProductId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
