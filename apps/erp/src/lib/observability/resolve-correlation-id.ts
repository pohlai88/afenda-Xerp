import {
  createCorrelationId,
  parseCorrelationId,
  toCorrelationId,
} from "@afenda/kernel";

import { persistenceCanonicalIdBodyGenerator } from "@/lib/identity/persistence-canonical-id-body-generator.server";

import { CORRELATION_ID_HEADER } from "./correlation-header";

function mintRequestCorrelationId(): string {
  return toCorrelationId(
    createCorrelationId(persistenceCanonicalIdBodyGenerator)
  );
}

function parseIncomingCorrelationId(value: string): string | null {
  try {
    return toCorrelationId(parseCorrelationId(value.trim()));
  } catch {
    return null;
  }
}

/**
 * Resolves the request correlation ID for API and middleware boundaries.
 *
 * Accepts canonical `cor_*` ingress headers; mints a new canonical ID when the
 * header is absent or non-canonical (legacy `corr-*` values must not reach
 * execution/outbox persistence).
 */
export function resolveCorrelationIdFromHeaders(
  requestHeaders: Headers
): string {
  const incoming = requestHeaders.get(CORRELATION_ID_HEADER);

  if (incoming !== null && incoming.trim().length > 0) {
    const parsed = parseIncomingCorrelationId(incoming);

    if (parsed !== null) {
      return parsed;
    }
  }

  return mintRequestCorrelationId();
}

export function resolveCorrelationIdFromRequest(request: Request): string {
  return resolveCorrelationIdFromHeaders(request.headers);
}
