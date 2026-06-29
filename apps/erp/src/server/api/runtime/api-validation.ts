export type ApiRouteErrorCode =
  | "validation_failed"
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "internal_error";

export class ApiRouteError extends Error {
  readonly code: ApiRouteErrorCode;
  readonly details: Record<string, unknown> | undefined;

  constructor(
    code: ApiRouteErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiRouteError";
    this.code = code;
    this.details = details;
  }
}

export function isApiRouteError(error: unknown): error is ApiRouteError {
  return error instanceof ApiRouteError;
}
