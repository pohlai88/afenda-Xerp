export const API_ERROR_CODES = [
  "bad_request",
  "unauthenticated",
  "forbidden",
  "not_found",
  "conflict",
  "validation_failed",
  "rate_limited",
  "internal_error",
  "service_unavailable",
  "method_not_allowed",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export interface ApiErrorDefinition {
  readonly code: ApiErrorCode;
  readonly httpStatus: number;
  readonly logLevel: "debug" | "error" | "info" | "warn";
  readonly publicMessage: string;
}

export const API_ERROR_DEFINITIONS = {
  bad_request: {
    code: "bad_request",
    httpStatus: 400,
    logLevel: "warn",
    publicMessage: "The request could not be processed.",
  },
  unauthenticated: {
    code: "unauthenticated",
    httpStatus: 401,
    logLevel: "info",
    publicMessage: "Authentication is required.",
  },
  forbidden: {
    code: "forbidden",
    httpStatus: 403,
    logLevel: "warn",
    publicMessage: "You do not have permission to perform this action.",
  },
  not_found: {
    code: "not_found",
    httpStatus: 404,
    logLevel: "info",
    publicMessage: "The requested resource was not found.",
  },
  conflict: {
    code: "conflict",
    httpStatus: 409,
    logLevel: "warn",
    publicMessage: "The request conflicts with the current state.",
  },
  validation_failed: {
    code: "validation_failed",
    httpStatus: 400,
    logLevel: "warn",
    publicMessage: "Request validation failed.",
  },
  rate_limited: {
    code: "rate_limited",
    httpStatus: 429,
    logLevel: "warn",
    publicMessage: "Too many requests. Try again later.",
  },
  internal_error: {
    code: "internal_error",
    httpStatus: 500,
    logLevel: "error",
    publicMessage: "An unexpected error occurred.",
  },
  service_unavailable: {
    code: "service_unavailable",
    httpStatus: 503,
    logLevel: "error",
    publicMessage: "The service is temporarily unavailable.",
  },
  method_not_allowed: {
    code: "method_not_allowed",
    httpStatus: 405,
    logLevel: "info",
    publicMessage: "HTTP method is not allowed for this route.",
  },
} as const satisfies Record<ApiErrorCode, ApiErrorDefinition>;

export function getApiErrorDefinition(code: ApiErrorCode): ApiErrorDefinition {
  return API_ERROR_DEFINITIONS[code];
}
