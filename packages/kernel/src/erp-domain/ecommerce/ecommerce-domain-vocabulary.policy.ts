/**
 * PAS-001B B94 — prohibited ecommerce runtime surfaces (contracts-only lifecycle).
 */

export const ECOMMERCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "checkout-execution-service",
  "payment-capture-engine",
  "ecommerce-database-runtime",
  "ecommerce-package-scaffold",
  "cart-merge-orchestrator",
  "marketplace-sync-connector",
  "abandoned-cart-recovery-engine",
  "web-order-fulfillment-bridge",
] as const;

export type EcommerceDomainProhibitedRuntimeSurface =
  (typeof ECOMMERCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const ECOMMERCE_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B94" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe ecommerce words. It must not execute checkout or payment capture." as const,
  prohibitedRuntimeSurfaces: ECOMMERCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "CustomerId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
