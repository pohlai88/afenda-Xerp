import {
  createCorrelationId as createCanonicalCorrelationId,
  parseCorrelationId,
} from "@afenda/kernel";

import { persistenceCanonicalIdBodyGenerator } from "@/lib/identity/persistence-canonical-id-body-generator.server";

import { CORRELATION_ID_HEADER } from "./correlation-header";

export function resolveCorrelationIdFromHeaders(
  requestHeaders: Headers
): string {
  const incoming = requestHeaders.get(CORRELATION_ID_HEADER);
  if (incoming !== null && incoming.trim().length > 0) {
    return parseCorrelationId(incoming.trim());
  }

  return createCanonicalCorrelationId(persistenceCanonicalIdBodyGenerator);
}

export function resolveCorrelationIdFromRequest(request: Request): string {
  return resolveCorrelationIdFromHeaders(request.headers);
}
