export const TREASURY_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "payment-posting-service",
  "treasury-database-runtime",
  "hedge-valuation-engine",
] as const;

export type TreasuryDomainProhibitedRuntimeSurface =
  (typeof TREASURY_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const TREASURY_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B82" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe treasury words. It must not execute payment or cash management runtime." as const,
  prohibitedRuntimeSurfaces: TREASURY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "BankAccountId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
