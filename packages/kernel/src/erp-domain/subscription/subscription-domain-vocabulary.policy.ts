export const SUBSCRIPTION_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "subscription-billing-service",
  "renewal-engine",
  "subscription-database-runtime",
] as const;

export type SubscriptionDomainProhibitedRuntimeSurface =
  (typeof SUBSCRIPTION_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const SUBSCRIPTION_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B93" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe subscription words. It must not execute billing runtime." as const,
  prohibitedRuntimeSurfaces: SUBSCRIPTION_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "CustomerId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
