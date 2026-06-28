export const CONSOLIDATION_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "consolidation-posting-service",
  "group-reporting-engine",
  "consolidation-database-runtime",
] as const;

export type ConsolidationDomainProhibitedRuntimeSurface =
  (typeof CONSOLIDATION_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const CONSOLIDATION_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B84" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe consolidation words. It must not execute group reporting runtime." as const,
  prohibitedRuntimeSurfaces: CONSOLIDATION_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "LegalEntityId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
