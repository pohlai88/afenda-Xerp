export const POS_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "pos-tender-service",
  "drawer-reconciliation-engine",
  "pos-database-runtime",
] as const;

export type PosDomainProhibitedRuntimeSurface =
  (typeof POS_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const POS_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B95" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe POS words. It must not execute tender capture runtime." as const,
  prohibitedRuntimeSurfaces: POS_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "ProductId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
