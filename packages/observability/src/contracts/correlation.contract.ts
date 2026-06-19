export interface CorrelationContext {
  readonly correlationId: string;
}

export function createCorrelationId(prefix = "corr"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function assertCorrelationId(correlationId: string): string {
  const normalized = correlationId.trim();

  if (!normalized) {
    throw new Error("correlationId is required.");
  }

  return normalized;
}
