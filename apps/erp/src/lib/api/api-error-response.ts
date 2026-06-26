import type { AuthorizationDenialCode } from "@afenda/permissions";
import type { ApiClientErrorBody } from "@/server/api/contracts/api-envelope.contract";
import type { ApiErrorCode } from "@/server/api/contracts/api-error.contract";
import { getApiErrorDefinition } from "@/server/api/contracts/api-error.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

import type { ApiRouteAuthorizationFailure } from "./authorize-api-route.contract";

export function mapAuthorizationDenialToApiErrorCode(
  code: AuthorizationDenialCode
): ApiErrorCode {
  switch (code) {
    case "missing_actor":
    case "inactive_actor":
      return "forbidden";
    case "missing_tenant":
      return "not_found";
    case "missing_context":
      return "forbidden";
    case "inactive_tenant":
    case "missing_membership":
    case "company_mismatch":
    case "tenant_mismatch":
    case "permission_denied":
    case "policy_denied":
    case "policy_gated":
      return "forbidden";
    default: {
      const exhaustive: never = code;
      return exhaustive;
    }
  }
}

export function resolveSafeAuthorizationMessage(
  code: AuthorizationDenialCode,
  fallbackMessage: string
): string {
  if (code === "permission_denied") {
    return getApiErrorDefinition("forbidden").publicMessage;
  }

  if (code === "missing_context" || code === "missing_tenant") {
    return "A valid workspace context is required.";
  }

  if (fallbackMessage.trim().length > 0) {
    return fallbackMessage;
  }

  return getApiErrorDefinition(mapAuthorizationDenialToApiErrorCode(code))
    .publicMessage;
}

export function toApiClientErrorBody(
  code: ApiErrorCode,
  message: string,
  correlationId: string,
  details?: unknown
): ApiClientErrorBody {
  const definition = getApiErrorDefinition(code);

  return {
    category: definition.category,
    code,
    correlationId,
    message,
    retryable: definition.retryable,
    ...(details === undefined ? {} : { details }),
  };
}

export function createApiRouteErrorFromAuthorizationFailure(
  failure: ApiRouteAuthorizationFailure
): ApiRouteError {
  return new ApiRouteError(failure.apiCode, failure.message, failure.details);
}

export function toApiRouteErrorFromClientBody(
  error: ApiClientErrorBody
): ApiRouteError {
  return new ApiRouteError(error.code, error.message, error.details);
}
