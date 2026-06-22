import { isUnauthenticatedError } from "@afenda/auth";

import type { ApiErrorCode } from "../contracts/api-error.contract";
import { getApiErrorDefinition } from "../contracts/api-error.contract";
import { isApiRouteError } from "./api-validation";

export function mapUnknownErrorToApiCode(error: unknown): ApiErrorCode {
  if (isApiRouteError(error)) {
    return error.code;
  }

  if (isUnauthenticatedError(error)) {
    return "unauthenticated";
  }

  return "internal_error";
}

export function resolvePublicErrorMessage(
  code: ApiErrorCode,
  error: unknown
): string {
  if (isApiRouteError(error)) {
    return error.message;
  }

  return getApiErrorDefinition(code).publicMessage;
}

export function resolveErrorDetails(error: unknown): unknown {
  if (isApiRouteError(error) && error.details !== undefined) {
    return error.details;
  }

  return undefined;
}

export function resolveErrorLogLevel(code: ApiErrorCode) {
  return getApiErrorDefinition(code).logLevel;
}
