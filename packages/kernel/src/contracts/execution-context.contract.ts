/**
 * Cross-platform execution context types.
 *
 * Owned by `@afenda/kernel` — execution infrastructure consumes these types
 * but does not redefine them.
 */

import {
  brandCompanyId,
  brandCorrelationId,
  brandExecutionId,
  brandOrganizationId,
  brandTenantId,
  brandUserId,
  type CompanyId,
  type CorrelationId,
  type ExecutionId,
  type OrganizationId,
  type TenantId,
  type UserId,
} from "./platform-id.contract.js";

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
  readonly startedAt: string;
  readonly tenantId: TenantId | null;
}

export interface ExecutionContextInput {
  readonly actorId?: string | UserId | null;
  readonly companyId?: string | CompanyId | null;
  readonly correlationId: string | CorrelationId;
  readonly executionId?: string | ExecutionId;
  readonly organizationId?: string | OrganizationId | null;
  readonly source: ExecutionContextSource;
  readonly startedAt?: string;
  readonly tenantId?: string | TenantId | null;
}

export function createExecutionId(prefix = "exec"): ExecutionId {
  return brandExecutionId(`${prefix}-${crypto.randomUUID()}`);
}

export function createExecutionContext(
  input: ExecutionContextInput
): ExecutionContext {
  return {
    actorId: brandUserId(input.actorId),
    companyId: brandCompanyId(input.companyId),
    correlationId: brandCorrelationId(input.correlationId),
    executionId:
      input.executionId === undefined
        ? createExecutionId()
        : brandExecutionId(input.executionId),
    organizationId: brandOrganizationId(input.organizationId),
    source: input.source,
    startedAt: input.startedAt ?? new Date().toISOString(),
    tenantId: brandTenantId(input.tenantId),
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
