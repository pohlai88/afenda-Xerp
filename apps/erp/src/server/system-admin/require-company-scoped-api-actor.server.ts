import {
  type ExecutionContext,
  toCompanyId,
  toTenantId,
  toUserId,
  type UserId,
} from "@afenda/kernel";

import type { ApiRequestContext } from "@/server/api/runtime/api-request-context";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

export interface CompanyScopedApiActor {
  readonly actorUserId: string;
  readonly companyId: string;
  readonly correlationId: string;
  readonly tenantId: string;
}

export function requireCompanyScopedApiActor(
  context:
    | {
        readonly correlationId: string;
        readonly execution: Pick<ExecutionContext, "companyId" | "tenantId">;
        readonly userId: UserId | null;
      }
    | Pick<ApiRequestContext<unknown>, "correlationId" | "execution" | "userId">
): CompanyScopedApiActor {
  if (context.userId === null) {
    throw new ApiRouteError("unauthenticated", "Authentication is required.");
  }

  if (context.execution.companyId === null) {
    throw new ApiRouteError(
      "forbidden",
      "Company operating scope is required for this action."
    );
  }

  if (context.execution.tenantId === null) {
    throw new ApiRouteError(
      "forbidden",
      "Tenant operating scope is required for this action."
    );
  }

  return {
    actorUserId: toUserId(context.userId),
    companyId: toCompanyId(context.execution.companyId),
    correlationId: context.correlationId,
    tenantId: toTenantId(context.execution.tenantId),
  };
}
