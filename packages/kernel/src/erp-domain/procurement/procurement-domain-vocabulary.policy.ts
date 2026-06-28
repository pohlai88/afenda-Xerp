/**
 * PAS-001B B80 — prohibited procurement runtime surfaces (contracts-only lifecycle).
 */

export const PROCUREMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "purchase-order-posting-service",
  "goods-receipt-matching-engine",
  "procurement-database-runtime",
  "procurement-package-scaffold",
  "three-way-match-engine",
  "supplier-onboarding-service",
  "blanket-agreement-release-engine",
  "rfq-award-automation",
] as const;

export type ProcurementDomainProhibitedRuntimeSurface =
  (typeof PROCUREMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const PROCUREMENT_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B80" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe procurement words. It must not execute PO posting or GR/IR matching." as const,
  prohibitedRuntimeSurfaces: PROCUREMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "SupplierId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:procurement-domain-contracts" as const,
} as const;
