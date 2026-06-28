/**
 * Cross-platform execution context types.
 *
 * Owned by `@afenda/kernel` — execution infrastructure consumes these types
 * but does not redefine them.
 */

import {
  type CanonicalIdBodyGenerator,
  type CompanyId,
  type CorrelationId,
  createExecutionId,
  type ExecutionId,
  type OrganizationId,
  parseCorrelationId,
  parseExecutionId,
  parseOptionalCompanyId,
  parseOptionalOrganizationId,
  parseOptionalTenantId,
  parseOptionalUserId,
  type TenantId,
  type UserId,
} from "../identity/index.js";

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
  readonly actorId: UserId | null;
  readonly companyId: CompanyId | null;
  readonly correlationId: CorrelationId;
  readonly executionId: ExecutionId;
  readonly organizationId: OrganizationId | null;
  readonly source: ExecutionContextSource;
  readonly spanId: string | null;
  readonly startedAt: string;
  readonly tenantId: TenantId | null;
  readonly traceId: string | null;
}

export interface ExecutionContextInput {
  readonly actorId?: string | UserId | null;
  readonly canonicalIdBodyGenerator?: CanonicalIdBodyGenerator;
  readonly companyId?: string | CompanyId | null;
  readonly correlationId: string | CorrelationId;
  readonly executionId?: string | ExecutionId;
  readonly organizationId?: string | OrganizationId | null;
  readonly source: ExecutionContextSource;
  readonly spanId?: string | null;
  readonly startedAt?: string;
  readonly tenantId?: string | TenantId | null;
  readonly traceId?: string | null;
}

function resolveExecutionId(input: ExecutionContextInput): ExecutionId {
  if (input.executionId !== undefined) {
    return typeof input.executionId === "string"
      ? parseExecutionId(input.executionId)
      : input.executionId;
  }

  if (input.canonicalIdBodyGenerator === undefined) {
    throw new Error(
      "ExecutionContextInput.executionId or canonicalIdBodyGenerator is required — kernel does not mint execution IDs without an injected generator."
    );
  }

  return createExecutionId(input.canonicalIdBodyGenerator);
}

export function createExecutionContext(
  input: ExecutionContextInput
): ExecutionContext {
  return {
    actorId: parseOptionalUserId(input.actorId),
    companyId: parseOptionalCompanyId(input.companyId),
    correlationId:
      typeof input.correlationId === "string"
        ? parseCorrelationId(input.correlationId)
        : input.correlationId,
    executionId: resolveExecutionId(input),
    organizationId: parseOptionalOrganizationId(input.organizationId),
    source: input.source,
    spanId: input.spanId ?? null,
    startedAt: input.startedAt ?? new Date().toISOString(),
    tenantId: parseOptionalTenantId(input.tenantId),
    traceId: input.traceId ?? null,
  };
}
