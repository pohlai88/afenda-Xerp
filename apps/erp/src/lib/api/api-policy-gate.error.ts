import type { ApiEnvelope } from "@/server/api/contracts/api-envelope.contract";
import type { ApiErrorCode } from "@/server/api/contracts/api-error.contract";

import {
  type ApiPolicyGateDecision,
  isApiSuccessEnvelope,
  readApiPolicyGateDecision,
  resolveApiEnvelopeErrorMessage,
} from "./api-envelope.client";

export class ApiClientRequestError extends Error {
  readonly code: ApiErrorCode;
  readonly correlationId: string;

  constructor(input: {
    readonly code: ApiErrorCode;
    readonly correlationId: string;
    readonly message: string;
  }) {
    super(input.message);
    this.name = "ApiClientRequestError";
    this.code = input.code;
    this.correlationId = input.correlationId;
  }
}

export class ApiPolicyGateError extends ApiClientRequestError {
  readonly gateDecision: ApiPolicyGateDecision;

  constructor(input: {
    readonly gateDecision: ApiPolicyGateDecision;
    readonly correlationId: string;
    readonly message: string;
  }) {
    super({
      code: "forbidden",
      correlationId: input.correlationId,
      message: input.message,
    });
    this.name = "ApiPolicyGateError";
    this.gateDecision = input.gateDecision;
  }
}

export function isApiPolicyGateError(
  error: unknown
): error is ApiPolicyGateError {
  return error instanceof ApiPolicyGateError;
}

export function isApiClientRequestError(
  error: unknown
): error is ApiClientRequestError {
  return error instanceof ApiClientRequestError;
}

export function createApiClientErrorFromEnvelope(
  envelope: ApiEnvelope<unknown>,
  fallbackMessage: string
): ApiClientRequestError {
  const gateDecision = readApiPolicyGateDecision(envelope);

  if (gateDecision !== null && envelope.ok === false) {
    return new ApiPolicyGateError({
      gateDecision,
      correlationId: envelope.error.correlationId,
      message: resolveApiEnvelopeErrorMessage(envelope, fallbackMessage),
    });
  }

  if (envelope.ok === false) {
    return new ApiClientRequestError({
      code: envelope.error.code,
      correlationId: envelope.error.correlationId,
      message: resolveApiEnvelopeErrorMessage(envelope, fallbackMessage),
    });
  }

  return new ApiClientRequestError({
    code: "internal_error",
    correlationId: envelope.meta.correlationId,
    message: fallbackMessage,
  });
}

export function assertApiSuccessEnvelope<TData>(
  envelope: ApiEnvelope<TData>,
  fallbackMessage: string
): TData {
  if (isApiSuccessEnvelope(envelope)) {
    return envelope.data;
  }

  throw createApiClientErrorFromEnvelope(envelope, fallbackMessage);
}
