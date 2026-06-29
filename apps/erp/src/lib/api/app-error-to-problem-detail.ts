import type {
  AppError,
  AppErrorCode,
  AppErrorWire,
  ProblemDetail,
} from "@afenda/kernel";
import { toAppErrorWire } from "@afenda/kernel";

/** RFC 9457 problem type base — aligned with kernel contract tests. */
export const AFENDA_PROBLEM_TYPE_BASE = "https://afenda.dev/problems" as const;

export interface AppErrorToProblemDetailOptions {
  readonly instance?: string;
}

const APP_ERROR_CODE_TO_HTTP_STATUS = {
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const satisfies Record<AppErrorCode, number>;

const APP_ERROR_CODE_TO_PROBLEM_SLUG = {
  VALIDATION_ERROR: "validation",
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not-found",
  CONFLICT: "conflict",
  INTERNAL_ERROR: "internal-error",
} as const satisfies Record<AppErrorCode, string>;

const APP_ERROR_CODE_TO_TITLE = {
  VALIDATION_ERROR: "Validation failed",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Conflict",
  INTERNAL_ERROR: "Internal server error",
} as const satisfies Record<AppErrorCode, string>;

export function mapAppErrorCodeToHttpStatus(code: AppErrorCode): number {
  return APP_ERROR_CODE_TO_HTTP_STATUS[code];
}

export function toProblemDetailFromAppErrorWire(
  error: AppErrorWire,
  options: AppErrorToProblemDetailOptions = {}
): ProblemDetail {
  const slug = APP_ERROR_CODE_TO_PROBLEM_SLUG[error.code];

  return {
    type: `${AFENDA_PROBLEM_TYPE_BASE}/${slug}`,
    title: APP_ERROR_CODE_TO_TITLE[error.code],
    status: mapAppErrorCodeToHttpStatus(error.code),
    detail: error.userMessage,
    ...(options.instance === undefined ? {} : { instance: options.instance }),
  };
}

/** Map kernel AppError to RFC 9457 ProblemDetail — HTTP status owned by API layer. */
export function toProblemDetailFromAppError(
  error: AppError,
  options: AppErrorToProblemDetailOptions = {}
): ProblemDetail {
  return toProblemDetailFromAppErrorWire(toAppErrorWire(error), options);
}
