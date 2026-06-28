export const PROJECT_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "project-billing-service",
  "timesheet-posting-engine",
  "project-database-runtime",
] as const;

export type ProjectDomainProhibitedRuntimeSurface =
  (typeof PROJECT_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const PROJECT_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B101" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe project words. It must not execute billing or timesheet posting runtime." as const,
  prohibitedRuntimeSurfaces: PROJECT_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "ProjectId here is the ERP domain-scoped project entity ID — not kernel platform ProjectId from operating-context (PAS-001B Rule 2). EmployeeId remains on business-reference authority." as const,
  platformProjectIdDisambiguation:
    "ProjectId in project-id.contract.ts is domain-scoped ERP project entity identity — distinct from kernel context ProjectId / createProjectId platform floor." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
