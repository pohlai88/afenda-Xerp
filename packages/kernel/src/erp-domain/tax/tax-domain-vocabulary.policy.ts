export const TAX_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "tax-filing-service",
  "tax-database-runtime",
  "withholding-posting-engine",
] as const;

export type TaxDomainProhibitedRuntimeSurface =
  (typeof TAX_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const TAX_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B83" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe tax words. It must not execute tax filing or determination runtime." as const,
  prohibitedRuntimeSurfaces: TAX_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "TaxJurisdictionId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
