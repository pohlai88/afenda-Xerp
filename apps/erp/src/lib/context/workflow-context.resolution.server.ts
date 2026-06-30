import type { WorkflowContext, WorkflowId } from "@afenda/kernel";

import { normalizeRuntimeModulePath } from "./runtime-module-path.server";
import { parseSurfaceId } from "./surface-context.resolution.server";

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
