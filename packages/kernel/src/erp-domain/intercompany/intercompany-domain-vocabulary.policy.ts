/**
 * PAS-001B B85 — prohibited intercompany runtime surfaces (contracts-only lifecycle).
 */

export const INTERCOMPANY_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "ic-matching-engine",
  "ic-settlement-posting-service",
  "ic-billing-automation",
  "intercompany-database-runtime",
  "intercompany-package-scaffold",
  "ic-reconciliation-engine",
  "central-treasury-netting-engine",
  "ic-transfer-pricing-calculator",
] as const;

export type IntercompanyDomainProhibitedRuntimeSurface =
  (typeof INTERCOMPANY_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const INTERCOMPANY_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B85" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe intercompany words. It must not execute IC matching or settlement posting." as const,
  prohibitedRuntimeSurfaces: INTERCOMPANY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "CustomerId, ProductId, and SupplierId remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
