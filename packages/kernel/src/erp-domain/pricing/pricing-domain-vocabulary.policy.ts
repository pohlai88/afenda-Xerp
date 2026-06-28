export const PRICING_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "pricing-engine",
  "dynamic-pricing-service",
  "pricing-database-runtime",
] as const;

export type PricingDomainProhibitedRuntimeSurface =
  (typeof PRICING_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const PRICING_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B92" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe pricing words. It must not execute price calculation runtime." as const,
  prohibitedRuntimeSurfaces: PRICING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "ProductId and CustomerId remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
