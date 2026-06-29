import type { AppError, ProblemDetail } from "@afenda/kernel";

import {
  type AppErrorToProblemDetailOptions,
  mapAppErrorCodeToHttpStatus,
  toProblemDetailFromAppError,
} from "./app-error-to-problem-detail.js";

export const PROBLEM_JSON_CONTENT_TYPE = "application/problem+json" as const;

export function createProblemDetailResponse(detail: ProblemDetail): Response {
  const status = detail.status ?? 500;

  return Response.json(detail, {
    status,
    headers: {
      "Content-Type": PROBLEM_JSON_CONTENT_TYPE,
    },
  });
}

/** RFC 9457 API error response — consumes kernel ProblemDetail at ERP boundary. */
export function createApiErrorResponse(
  error: AppError,
  options: AppErrorToProblemDetailOptions = {}
): Response {
  const detail = toProblemDetailFromAppError(error, options);
  const status = detail.status ?? mapAppErrorCodeToHttpStatus(error.code);

  return Response.json(
    { ...detail, status },
    {
      status,
      headers: {
        "Content-Type": PROBLEM_JSON_CONTENT_TYPE,
      },
    }
  );
}
