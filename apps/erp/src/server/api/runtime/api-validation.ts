import type { ZodType } from "zod";

import type { ApiErrorCode } from "../contracts/api-error.contract";

export class ApiRouteError extends Error {
  readonly code: ApiErrorCode;
  readonly details?: unknown;

  constructor(code: ApiErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ApiRouteError";
    this.code = code;
    this.details = details;
  }
}

export function isApiRouteError(error: unknown): error is ApiRouteError {
  return error instanceof ApiRouteError;
}

export async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new ApiRouteError(
      "validation_failed",
      "Content-Type must be application/json."
    );
  }

  try {
    return await request.json();
  } catch {
    throw new ApiRouteError("validation_failed", "Request body must be valid JSON.");
  }
}

export function parseRequestBody<T>(
  schema: ZodType<T>,
  value: unknown
): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new ApiRouteError("validation_failed", "Request validation failed.", {
      issues: result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  return result.data;
}

export function parseResponseData<T>(schema: ZodType<T>, value: T): T {
  return schema.parse(value);
}
