export const HCM_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "hcm-posting-service",
  "payroll-bridge",
  "hcm-database-runtime",
] as const;

export type HcmDomainProhibitedRuntimeSurface =
  (typeof HCM_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const HCM_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B99" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe HCM words. It must not execute payroll or HR runtime." as const,
  prohibitedRuntimeSurfaces: HCM_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "EmployeeId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
