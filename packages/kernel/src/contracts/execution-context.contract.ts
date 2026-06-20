/**
 * Cross-platform execution context types.
 *
 * Owned by `@afenda/kernel` — execution infrastructure consumes these types
 * but does not redefine them.
 */

export const EXECUTION_CONTEXT_SOURCES = [
  "api",
  "cron",
  "event",
  "manual",
  "system",
  "outbox",
  "job",
] as const;

export type ExecutionContextSource = (typeof EXECUTION_CONTEXT_SOURCES)[number];

export interface ExecutionContext {
  readonly actorId: string | null;
  readonly companyId: string | null;
  readonly correlationId: string;
  readonly executionId: string;
  readonly organizationId: string | null;
  readonly source: ExecutionContextSource;
  readonly startedAt: string;
  readonly tenantId: string | null;
}

export interface ExecutionContextInput {
  readonly actorId?: string | null;
  readonly companyId?: string | null;
  readonly correlationId: string;
  readonly executionId?: string;
  readonly organizationId?: string | null;
  readonly source: ExecutionContextSource;
  readonly startedAt?: string;
  readonly tenantId?: string | null;
}

export function createExecutionId(prefix = "exec"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createExecutionContext(
  input: ExecutionContextInput
): ExecutionContext {
  return {
    actorId: input.actorId ?? null,
    companyId: input.companyId ?? null,
    correlationId: input.correlationId,
    executionId: input.executionId ?? createExecutionId(),
    organizationId: input.organizationId ?? null,
    source: input.source,
    startedAt: input.startedAt ?? new Date().toISOString(),
    tenantId: input.tenantId ?? null,
  };
}

export function assertExecutionContext(
  context: ExecutionContext
): ExecutionContext {
  if (!context.executionId.trim()) {
    throw new Error("executionId is required.");
  }

  if (!context.correlationId.trim()) {
    throw new Error("correlationId is required.");
  }

  return context;
}
