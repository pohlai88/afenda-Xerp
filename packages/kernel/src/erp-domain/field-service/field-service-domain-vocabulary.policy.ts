export const FIELD_SERVICE_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "dispatch-routing-service",
  "technician-tracking-engine",
  "field-service-database-runtime",
] as const;

export type FieldServiceDomainProhibitedRuntimeSurface =
  (typeof FIELD_SERVICE_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const FIELD_SERVICE_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B97" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe field service words. It must not execute technician dispatch runtime." as const,
  prohibitedRuntimeSurfaces: FIELD_SERVICE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "EmployeeId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
