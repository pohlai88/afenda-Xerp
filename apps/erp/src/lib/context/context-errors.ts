import {
  err,
  type OperatingContextError,
  type OperatingContextErrorCode,
  type OperatingContextResult,
} from "@afenda/kernel";

import { logOperatingContextResolution } from "./log-operating-context-resolution.server";

export const COMPANY_ACCESS_BLOCK_REASON: Record<string, string> = {
  suspended: "Legal entity is suspended and workspace access is blocked.",
  archived: "Legal entity is archived and workspace access is blocked.",
};

export const ORGANIZATION_ACCESS_BLOCK_REASON: Record<string, string> = {
  suspended: "Organization unit is suspended and workspace access is blocked.",
  archived: "Organization unit is archived and workspace access is blocked.",
};

export const PROJECT_ACCESS_BLOCK_REASON: Record<string, string> = {
  draft: "Project is still in draft and workspace access is blocked.",
  on_hold: "Project is on hold and workspace access is blocked.",
  completed: "Project is completed and workspace access is blocked.",
  cancelled: "Project is cancelled and workspace access is blocked.",
};

export const ENTITY_GROUP_ACCESS_BLOCK_REASON: Record<string, string> = {
  suspended: "Corporate group is suspended and workspace access is blocked.",
  archived: "Corporate group is archived and workspace access is blocked.",
};

export function tenantSlugMissingError(): OperatingContextError {
  return {
    code: "TENANT_NOT_FOUND",
    userMessage: "Workspace tenant could not be resolved from the request.",
  };
}

const OPERATING_CONTEXT_CONTEXT_REQUIRED_ERROR_CODES =
  new Set<OperatingContextErrorCode>([
    "TENANT_NOT_FOUND",
    "MISSING_LEGAL_ENTITY_SELECTION",
  ]);

/** True when operating context resolution failed because workspace selection is incomplete. */
export function isOperatingContextContextRequiredError(
  error: OperatingContextError
): boolean {
  return OPERATING_CONTEXT_CONTEXT_REQUIRED_ERROR_CODES.has(error.code);
}

/** Fail-closed operating context denial with safe audit logging. */
export function denyOperatingContext(input: {
  readonly correlationId: string;
  readonly error: OperatingContextError;
  readonly tenantSlug: string;
}): OperatingContextResult {
  logOperatingContextResolution({
    correlationId: input.correlationId,
    errorCode: input.error.code,
    outcome: "denied",
    tenantSlug: input.tenantSlug,
  });

  return err(input.error);
}
