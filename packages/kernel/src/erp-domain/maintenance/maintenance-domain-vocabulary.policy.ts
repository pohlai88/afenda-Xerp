export const MAINTENANCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "maintenance-posting-service",
  "pm-scheduling-engine",
  "maintenance-database-runtime",
] as const;

export type MaintenanceDomainProhibitedRuntimeSurface =
  (typeof MAINTENANCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const MAINTENANCE_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B88" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe maintenance words. It must not execute work order posting runtime." as const,
  prohibitedRuntimeSurfaces: MAINTENANCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "EquipmentId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
