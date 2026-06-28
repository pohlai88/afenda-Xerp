export const WORKFLOW_DOMAIN_PROHIBITED_RUNTIME_SURFACES = [
  "bpm-engine",
  "workflow-database-runtime",
  "approval-routing-service",
] as const;

export type WorkflowDomainProhibitedRuntimeSurface =
  (typeof WORKFLOW_DOMAIN_PROHIBITED_RUNTIME_SURFACES)[number];

export const WORKFLOW_DOMAIN_VOCABULARY_POLICY = {
  pasSection: "4.8" as const,
  pas001bSlice: "B104" as const,
  lifecycle: "contracts-only" as const,
  rule: "Kernel may describe workflow words. It must not execute BPM engine runtime." as const,
  prohibitedRuntimeSurfaces: WORKFLOW_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  businessReferenceNote:
    "UserId remains on kernel identity authority (PAS-001B Rule 2)." as const,
  enforcementGate: "pnpm check:erp-domain-delivered-vocabulary" as const,
} as const;
