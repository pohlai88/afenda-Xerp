import {
  normalizeRuntimeModulePath,
  type RuntimeModulePath,
} from "./runtime-module-path.js";
import { parseSurfaceId, type SurfaceId } from "./surface-context.contract.js";

/**
 * Runtime workflow execution scope — not a database entity in this slice.
 * Used for task routing, approvals, and workflow metadata resolution.
 */
export type WorkflowId = RuntimeModulePath;

export interface WorkflowContext {
  readonly surfaceId: SurfaceId | null;
  readonly workflowId: WorkflowId;
}

export function parseWorkflowId(
  value: string | null | undefined
): WorkflowId | null {
  return normalizeRuntimeModulePath(value);
}

export function toWorkflowContext(input: {
  readonly surfaceId?: string | null;
  readonly workflowId: WorkflowId | null | undefined;
}): WorkflowContext | null {
  const workflowId = parseWorkflowId(input.workflowId);
  if (!workflowId) {
    return null;
  }

  const surfaceId = input.surfaceId ? parseSurfaceId(input.surfaceId) : null;

  return {
    workflowId,
    surfaceId,
  };
}
