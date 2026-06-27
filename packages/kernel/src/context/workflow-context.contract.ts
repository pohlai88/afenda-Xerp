import type { SurfaceId } from "./surface-context.contract.js";

/**
 * Runtime workflow execution scope — not a database entity in this slice.
 * Used for task routing, approvals, and workflow metadata resolution.
 *
 * Parse/normalize helpers live in apps/erp (`workflow-context.resolution.server.ts`).
 */
export type WorkflowId = string;

export interface WorkflowContext {
  readonly surfaceId: SurfaceId | null;
  readonly workflowId: WorkflowId;
}
