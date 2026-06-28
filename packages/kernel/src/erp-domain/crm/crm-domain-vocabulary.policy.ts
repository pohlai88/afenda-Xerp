export const CRM_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "crm-sync-service",
  "lead-scoring-engine",
  "crm-database-runtime",
] as const;

export type CrmDomainProhibitedRuntimeSurface =
  (typeof CRM_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const CRM_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B91" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe CRM words. It must not execute marketing automation runtime." as const,
  prohibitedRuntimeSurfaces: CRM_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "CustomerId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
