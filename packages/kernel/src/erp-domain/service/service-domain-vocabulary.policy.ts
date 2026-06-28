export const SERVICE_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "service-dispatch-service",
  "sla-engine",
  "service-database-runtime",
] as const;

export type ServiceDomainProhibitedRuntimeSurface =
  (typeof SERVICE_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const SERVICE_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B96" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe service case words. It must not execute field dispatch runtime." as const,
  prohibitedRuntimeSurfaces: SERVICE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "CustomerId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
