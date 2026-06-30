import type { ApiCachePolicy } from "../contracts/api-contract";
import type {
  ApiErrorEnvelope,
  ApiResponseMeta,
  ApiSuccessEnvelope,
} from "../contracts/api-envelope.contract";
import type { ApiErrorCode } from "../contracts/api-error.contract";
import {
  getApiErrorDefinition,
  projectProblemDetailEnvelopeFields,
} from "../contracts/api-error.contract";
import { CORRELATION_ID_HEADER, REQUEST_ID_HEADER } from "./api-correlation";
import type { ApiRateLimitSnapshot } from "./api-rate-limit";

export const RATE_LIMIT_LIMIT_HEADER = "X-RateLimit-Limit" as const;
export const RATE_LIMIT_REMAINING_HEADER = "X-RateLimit-Remaining" as const;
export const RATE_LIMIT_RESET_HEADER = "X-RateLimit-Reset" as const;
export const RETRY_AFTER_HEADER = "Retry-After" as const;

function buildResponseMeta(meta: ApiResponseMeta): ApiResponseMeta {
  return meta;
}

export function createSuccessEnvelope<TData>(
  data: TData,
  meta: ApiResponseMeta
): ApiSuccessEnvelope<TData> {
  return {
    ok: true,
    data,
    meta: buildResponseMeta(meta),
  };
}

export function createErrorEnvelope(
  code: ApiErrorCode,
  message: string,
  meta: ApiResponseMeta,
  details?: unknown
): ApiErrorEnvelope {
  const definition = getApiErrorDefinition(code);
  const problemDetail = projectProblemDetailEnvelopeFields(
    code,
    message,
    meta.correlationId
  );

  return {
    ok: false,
    error: {
      category: definition.category,
      code,
      correlationId: meta.correlationId,
      detail: problemDetail.detail,
      instance: problemDetail.instance,
      message,
      retryable: definition.retryable,
      status: problemDetail.status,
      title: problemDetail.title,
      type: problemDetail.type,
      ...(details === undefined ? {} : { details }),
    },
    meta: buildResponseMeta(meta),
  };
}

function resolveCacheControlHeader(cache: ApiCachePolicy): string {
  if (cache.kind === "no-store") {
    return "no-store";
  }

  if (cache.kind === "static") {
    return "public, max-age=31536000, immutable";
  }

  return `public, max-age=0, s-maxage=${cache.seconds}, stale-while-revalidate=${cache.seconds}`;
}

function resolveRetryAfterSeconds(details: unknown): string | undefined {
  if (typeof details !== "object" || details === null) {
    return;
  }

  if (!("retryAfterSeconds" in details)) {
    return;
  }

  const retryAfterSeconds = details.retryAfterSeconds;
  if (
    typeof retryAfterSeconds !== "number" ||
    !Number.isFinite(retryAfterSeconds)
  ) {
    return;
  }

  return String(Math.max(1, Math.ceil(retryAfterSeconds)));
}

function buildRateLimitHeaders(
  snapshot: ApiRateLimitSnapshot | null | undefined
): Record<string, string> {
  if (snapshot === null || snapshot === undefined) {
    return {};
  }

  return {
    [RATE_LIMIT_LIMIT_HEADER]: String(snapshot.limit),
    [RATE_LIMIT_REMAINING_HEADER]: String(snapshot.remaining),
    [RATE_LIMIT_RESET_HEADER]: String(snapshot.resetAtUnix),
  };
}

export function jsonSuccessResponse<TData>(
  data: TData,
  meta: ApiResponseMeta,
  cache: ApiCachePolicy,
  status = 200,
  rateLimitSnapshot?: ApiRateLimitSnapshot | null
): Response {
  const body = createSuccessEnvelope(data, meta);

  return Response.json(body, {
    status,
    headers: {
      [CORRELATION_ID_HEADER]: meta.correlationId,
      [REQUEST_ID_HEADER]: meta.requestId,
      "Cache-Control": resolveCacheControlHeader(cache),
      "Content-Type": "application/json",
      ...buildRateLimitHeaders(rateLimitSnapshot),
    },
  });
}

export function jsonErrorResponse(
  code: ApiErrorCode,
  message: string,
  meta: ApiResponseMeta,
  details?: unknown,
  rateLimitSnapshot?: ApiRateLimitSnapshot | null
): Response {
  const definition = getApiErrorDefinition(code);
  const body = createErrorEnvelope(code, message, meta, details);
  const retryAfter =
    code === "rate_limited" ? resolveRetryAfterSeconds(details) : undefined;

  return Response.json(body, {
    status: definition.httpStatus,
    headers: {
      [CORRELATION_ID_HEADER]: meta.correlationId,
      [REQUEST_ID_HEADER]: meta.requestId,
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
      ...buildRateLimitHeaders(rateLimitSnapshot),
      ...(retryAfter === undefined ? {} : { [RETRY_AFTER_HEADER]: retryAfter }),
    },
  });
}
