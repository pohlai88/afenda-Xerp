import {
  err,
  type OperatingContextError,
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
