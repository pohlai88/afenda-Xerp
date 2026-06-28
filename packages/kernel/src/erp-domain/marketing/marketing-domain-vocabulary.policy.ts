export const MARKETING_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "campaign-delivery-service",
  "attribution-engine",
  "marketing-database-runtime",
] as const;

export type MarketingDomainProhibitedRuntimeSurface =
  (typeof MARKETING_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const MARKETING_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B98" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe marketing words. It must not execute campaign delivery runtime." as const,
  prohibitedRuntimeSurfaces: MARKETING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "CustomerId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
