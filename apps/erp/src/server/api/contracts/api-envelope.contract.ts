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

export interface ApiErrorEnvelope<TCode extends ApiErrorCode = ApiErrorCode> {
  readonly error: {
    readonly code: TCode;
    readonly details?: unknown;
    readonly message: string;
  };
  readonly meta: ApiResponseMeta;
  readonly ok: false;
}

export type ApiEnvelope<TData> = ApiErrorEnvelope | ApiSuccessEnvelope<TData>;
