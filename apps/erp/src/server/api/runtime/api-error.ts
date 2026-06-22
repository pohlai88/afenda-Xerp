import { isUnauthenticatedError } from "@afenda/auth";
import {
  isAuthorizationDeniedError,
  isMissingAuthorizationContextError,
} from "@afenda/permissions";

import type { ApiErrorCode } from "../contracts/api-error.contract";
import { getApiErrorDefinition } from "../contracts/api-error.contract";
import { isApiRouteError } from "./api-validation";
import {
  mapAuthorizationDenialToApiErrorCode,
  resolveSafeAuthorizationMessage,
} from "@/lib/api/api-error-response";

export function mapUnknownErrorToApiCode(error: unknown): ApiErrorCode {
  if (isApiRouteError(error)) {
    return error.code;
  }

  if (isUnauthenticatedError(error)) {
    return "unauthenticated";
  }

  if (isMissingAuthorizationContextError(error)) {
    return "forbidden";
  }

  if (isAuthorizationDeniedError(error)) {
    return mapAuthorizationDenialToApiErrorCode(error.code);
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

  if (isAuthorizationDeniedError(error)) {
    return resolveSafeAuthorizationMessage(error.code, error.message);
  }

  if (isMissingAuthorizationContextError(error)) {
    return "A valid workspace context is required.";
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
