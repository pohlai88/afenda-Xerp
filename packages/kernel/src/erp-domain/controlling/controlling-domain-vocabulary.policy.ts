export const CONTROLLING_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "cost-posting-service",
  "allocation-engine",
  "controlling-database-runtime",
] as const;

export type ControllingDomainProhibitedRuntimeSurface =
  (typeof CONTROLLING_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const CONTROLLING_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B81" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe controlling words. It must not execute cost posting or allocation runtime." as const,
  prohibitedRuntimeSurfaces: CONTROLLING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "CostCenterId and ProductId remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
