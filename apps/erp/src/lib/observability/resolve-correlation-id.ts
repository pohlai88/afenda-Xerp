import { createCorrelationId } from "@afenda/observability";

import { CORRELATION_ID_HEADER } from "./correlation-header";

export function resolveCorrelationIdFromHeaders(
  requestHeaders: Headers
): string {
  const incoming = requestHeaders.get(CORRELATION_ID_HEADER);
  if (incoming !== null && incoming.trim().length > 0) {
    return incoming.trim();
  }

  return createCorrelationId();
}

export function resolveCorrelationIdFromRequest(request: Request): string {
  return resolveCorrelationIdFromHeaders(request.headers);
}
