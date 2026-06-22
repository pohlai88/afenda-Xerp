import type { ApiCachePolicy } from "../contracts/api-contract";
import type { ApiErrorCode } from "../contracts/api-error.contract";
import { getApiErrorDefinition } from "../contracts/api-error.contract";
import type {
  ApiErrorEnvelope,
  ApiResponseMeta,
  ApiSuccessEnvelope,
} from "../contracts/api-envelope.contract";
import {
  CORRELATION_ID_HEADER,
  REQUEST_ID_HEADER,
} from "./api-correlation";

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
  return {
    ok: false,
    error: {
      code,
      correlationId: meta.correlationId,
      message,
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

export function jsonSuccessResponse<TData>(
  data: TData,
  meta: ApiResponseMeta,
  cache: ApiCachePolicy,
  status = 200
): Response {
  const body = createSuccessEnvelope(data, meta);

  return Response.json(body, {
    status,
    headers: {
      [CORRELATION_ID_HEADER]: meta.correlationId,
      [REQUEST_ID_HEADER]: meta.requestId,
      "Cache-Control": resolveCacheControlHeader(cache),
      "Content-Type": "application/json",
    },
  });
}

export function jsonErrorResponse(
  code: ApiErrorCode,
  message: string,
  meta: ApiResponseMeta,
  details?: unknown
): Response {
  const definition = getApiErrorDefinition(code);
  const body = createErrorEnvelope(code, message, meta, details);

  return Response.json(body, {
    status: definition.httpStatus,
    headers: {
      [CORRELATION_ID_HEADER]: meta.correlationId,
      [REQUEST_ID_HEADER]: meta.requestId,
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
}
