import { resolveCorrelationIdFromRequest } from "@/lib/observability/resolve-correlation-id";

export { CORRELATION_ID_HEADER } from "@/lib/observability/correlation-header";

export const REQUEST_ID_HEADER = "x-request-id" as const;

export const resolveCorrelationId = resolveCorrelationIdFromRequest;

export function createRequestId(): string {
  return crypto.randomUUID();
}
