import type { ApiErrorCategory, ApiErrorCode } from "./api-error.contract";
import {
  parseApiCorrelationIdentity,
  type ApiCorrelationIdentity,
} from "./core/api-audit-replay.contract";

export interface ApiResponseMeta {
  /** Trace correlation identity (API-010) — branded at validation boundary. */
  readonly correlationId: string;
  readonly requestId: string;
  readonly timestamp: string;
}

export interface ApiSuccessEnvelope<TData> {
  readonly data: TData;
  readonly meta: ApiResponseMeta;
  readonly ok: true;
}

export interface ApiErrorBody<TCode extends ApiErrorCode = ApiErrorCode> {
  readonly category: ApiErrorCategory;
  readonly code: TCode;
  readonly correlationId: string;
  readonly details?: unknown;
  readonly message: string;
  readonly retryable: boolean;
}

/** Serializable error body nested under governed `{ ok: false, error, meta }` envelopes. */
export type ApiClientErrorBody = ApiErrorBody;

export interface ApiErrorEnvelope<TCode extends ApiErrorCode = ApiErrorCode> {
  readonly error: ApiErrorBody<TCode>;
  readonly meta: ApiResponseMeta;
  readonly ok: false;
}

export type ApiEnvelope<TData> = ApiErrorEnvelope | ApiSuccessEnvelope<TData>;

export function isApiSuccessEnvelope<TData>(
  envelope: ApiEnvelope<TData>
): envelope is ApiSuccessEnvelope<TData> {
  return envelope.ok === true;
}

export function isApiErrorEnvelope(
  envelope: ApiEnvelope<unknown>
): envelope is ApiErrorEnvelope {
  return envelope.ok === false;
}

/** Validates governed response meta carries non-empty correlation identity (API-010). */
export function parseGovernedResponseMeta(
  meta: ApiResponseMeta
): ApiResponseMeta & { readonly trace: ApiCorrelationIdentity } {
  const trace = parseApiCorrelationIdentity({
    correlationId: meta.correlationId,
    requestId: meta.requestId,
  });

  return { ...meta, trace };
}

export type { ApiCorrelationIdentity } from "./core/api-audit-replay.contract";
