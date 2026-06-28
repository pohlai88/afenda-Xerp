/**
 * PAS-001B B90 — prohibited sales runtime surfaces (contracts-only lifecycle).
 */

export const SALES_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "sales-order-posting-service",
  "order-fulfillment-engine",
  "sales-database-runtime",
  "sales-package-scaffold",
  "delivery-scheduling-engine",
  "quote-to-cash-automation",
  "returns-processing-service",
  "pricing-determination-engine",
] as const;

export type SalesDomainProhibitedRuntimeSurface =
  (typeof SALES_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const SALES_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B90" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe sales words. It must not execute order posting or fulfillment." as const,
  prohibitedRuntimeSurfaces: SALES_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "CustomerId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
