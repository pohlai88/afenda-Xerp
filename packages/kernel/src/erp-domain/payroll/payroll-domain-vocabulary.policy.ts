export const PAYROLL_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "payroll-calculation-service",
  "tax-withholding-engine",
  "payroll-database-runtime",
] as const;

export type PayrollDomainProhibitedRuntimeSurface =
  (typeof PAYROLL_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const PAYROLL_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B100" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe payroll words. It must not execute pay calculation runtime." as const,
  prohibitedRuntimeSurfaces: PAYROLL_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "EmployeeId remains on kernel business-reference authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
