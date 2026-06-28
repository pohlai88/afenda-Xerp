import {
  parseCorrelationId,
  toCorrelationId,
  type UserId,
} from "@afenda/kernel";

import type { ApiRequestContext } from "@/server/api/runtime/api-request-context";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

export interface MutationScope {
  readonly actorId: string;
  readonly companyId: string;
  readonly correlationId: string;
  readonly organizationId: string | null;
  readonly tenantId: string;
  readonly userId: UserId;
}

function resolveScopeCorrelationId(value: string): string {
  return toCorrelationId(parseCorrelationId(value.trim()));
}

export function resolveMutationScopeFromApiContext(
  context: ApiRequestContext<unknown>
): MutationScope {
  if (context.userId === null) {
    throw new ApiRouteError("unauthenticated", "Authentication is required.");
  }

  const tenantId = context.execution.tenantId;

  if (tenantId === null || tenantId.trim().length === 0) {
    throw new ApiRouteError(
      "forbidden",
      "A valid workspace tenant context is required."
    );
  }

  const companyId = context.execution.companyId;

  if (companyId === null || companyId.trim().length === 0) {
    throw new ApiRouteError(
      "forbidden",
      "A valid company context is required for scoped mutations."
    );
  }

  const actorId = context.execution.actorId ?? context.userId;

  return {
    actorId,
    companyId,
    correlationId: resolveScopeCorrelationId(context.correlationId),
    organizationId: context.execution.organizationId,
    tenantId,
    userId: context.userId,
  };
}
