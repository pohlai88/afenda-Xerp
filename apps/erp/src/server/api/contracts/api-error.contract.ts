export const API_ERROR_CATEGORIES = [
  "validation",
  "authentication",
  "authorization",
  "not_found",
  "conflict",
  "rate_limit",
  "internal",
] as const;

export type ApiErrorCategory = (typeof API_ERROR_CATEGORIES)[number];

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
  readonly category: ApiErrorCategory;
  readonly code: ApiErrorCode;
  readonly httpStatus: number;
  readonly logLevel: "debug" | "error" | "info" | "warn";
  readonly publicMessage: string;
  readonly retryable: boolean;
}

export const API_ERROR_DEFINITIONS = {
  bad_request: {
    category: "validation",
    code: "bad_request",
    httpStatus: 400,
    logLevel: "warn",
    publicMessage: "The request could not be processed.",
    retryable: false,
  },
  unauthenticated: {
    category: "authentication",
    code: "unauthenticated",
    httpStatus: 401,
    logLevel: "info",
    publicMessage: "Authentication is required.",
    retryable: false,
  },
  forbidden: {
    category: "authorization",
    code: "forbidden",
    httpStatus: 403,
    logLevel: "warn",
    publicMessage: "You do not have permission to perform this action.",
    retryable: false,
  },
  not_found: {
    category: "not_found",
    code: "not_found",
    httpStatus: 404,
    logLevel: "info",
    publicMessage: "The requested resource was not found.",
    retryable: false,
  },
  conflict: {
    category: "conflict",
    code: "conflict",
    httpStatus: 409,
    logLevel: "warn",
    publicMessage: "The request conflicts with the current state.",
    retryable: false,
  },
  validation_failed: {
    category: "validation",
    code: "validation_failed",
    httpStatus: 400,
    logLevel: "warn",
    publicMessage: "Request validation failed.",
    retryable: false,
  },
  rate_limited: {
    category: "rate_limit",
    code: "rate_limited",
    httpStatus: 429,
    logLevel: "warn",
    publicMessage: "Too many requests. Try again later.",
    retryable: true,
  },
  internal_error: {
    category: "internal",
    code: "internal_error",
    httpStatus: 500,
    logLevel: "error",
    publicMessage: "An unexpected error occurred.",
    retryable: true,
  },
  service_unavailable: {
    category: "internal",
    code: "service_unavailable",
    httpStatus: 503,
    logLevel: "error",
    publicMessage: "The service is temporarily unavailable.",
    retryable: true,
  },
  method_not_allowed: {
    category: "validation",
    code: "method_not_allowed",
    httpStatus: 405,
    logLevel: "info",
    publicMessage: "HTTP method is not allowed for this route.",
    retryable: false,
  },
} as const satisfies Record<ApiErrorCode, ApiErrorDefinition>;

export function getApiErrorDefinition(code: ApiErrorCode): ApiErrorDefinition {
  return API_ERROR_DEFINITIONS[code];
}

export function resolveApiErrorCategory(code: ApiErrorCode): ApiErrorCategory {
  return getApiErrorDefinition(code).category;
}

export function resolveApiErrorRetryable(code: ApiErrorCode): boolean {
  return getApiErrorDefinition(code).retryable;
}
