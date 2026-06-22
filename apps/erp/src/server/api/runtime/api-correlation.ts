import { CORRELATION_ID_HEADER } from "@/middleware";

export { CORRELATION_ID_HEADER };

export const REQUEST_ID_HEADER = "x-request-id" as const;

export function resolveCorrelationId(request: Request): string {
  const incoming = request.headers.get(CORRELATION_ID_HEADER);
  if (incoming !== null && incoming.trim().length > 0) {
    return incoming.trim();
  }

  return crypto.randomUUID();
}

export function createRequestId(): string {
  return crypto.randomUUID();
}
