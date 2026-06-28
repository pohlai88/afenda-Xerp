export const DOCUMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "document-storage-service",
  "cms-bridge",
  "document-database-runtime",
] as const;

export type DocumentDomainProhibitedRuntimeSurface =
  (typeof DOCUMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const DOCUMENT_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B103" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe ERP business document words. Not platform CMS or storage runtime." as const,
  prohibitedRuntimeSurfaces: DOCUMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "Business partner IDs remain on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
