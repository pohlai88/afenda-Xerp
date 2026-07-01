import type { ApiErrorEnvelope } from "../meta-contracts/api-envelope.contract";
import type { ApiErrorCode } from "../meta-contracts/api-error.contract";
import { getApiErrorDefinition } from "../meta-contracts/api-error.contract";

export function createTestApiErrorEnvelope(
  input: {
    readonly code: ApiErrorCode;
    readonly correlationId: string;
    readonly message: string;
    readonly details?: unknown;
  },
  meta?: {
    readonly requestId?: string;
    readonly timestamp?: string;
  }
): ApiErrorEnvelope {
  const definition = getApiErrorDefinition(input.code);

  return {
    ok: false,
    error: {
      category: definition.category,
      code: input.code,
      correlationId: input.correlationId,
      message: input.message,
      retryable: definition.retryable,
      ...(input.details === undefined ? {} : { details: input.details }),
    },
    meta: {
      correlationId: input.correlationId,
      requestId: meta?.requestId ?? "req-test",
      timestamp: meta?.timestamp ?? "2026-01-01T00:00:00.000Z",
    },
  };
}
