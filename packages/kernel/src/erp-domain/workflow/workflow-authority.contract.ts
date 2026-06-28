/**
 * PAS-001B B104 — Workflow domain authority (kernel contracts-only lifecycle).
 */

export const WORKFLOW_AUTHORITY_PAS = "PAS-001B" as const;

export const WORKFLOW_REGISTRY_ID = "PKGR01B_WORKFLOW_VOCABULARY" as const;

export const WORKFLOW_CONTRACTS_OWNER =
  "packages/kernel/src/erp-domain/workflow" as const;

export const WORKFLOW_AUTHORITY_FINGERPRINT =
  "WORKFLOW-AUTHORITY-2026-06-28-v1" as const;

export const WORKFLOW_PACKAGE_LIFECYCLE_PHASES = [
  "contracts-only",
  "runtime",
] as const;

export type WorkflowPackageLifecyclePhase =
  (typeof WORKFLOW_PACKAGE_LIFECYCLE_PHASES)[number];

export const WORKFLOW_PACKAGE_LIFECYCLE: WorkflowPackageLifecyclePhase =
  "contracts-only";

export function isWorkflowPackageLifecyclePhase(
  value: string
): value is WorkflowPackageLifecyclePhase {
  return (WORKFLOW_PACKAGE_LIFECYCLE_PHASES as readonly string[]).includes(
    value
  );
}
