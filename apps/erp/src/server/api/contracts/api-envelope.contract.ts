import type { ApiErrorCode } from "./api-error.contract";

export interface ApiResponseMeta {
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
  readonly code: TCode;
  readonly correlationId: string;
  readonly details?: unknown;
  readonly message: string;
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
