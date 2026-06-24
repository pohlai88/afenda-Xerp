import {
  type ExecutionContext,
  type UserId,
  toTenantId,
} from "@afenda/kernel";

import type { ApiRequestContext } from "@/server/api/runtime/api-request-context";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

export interface TenantScopedApiActor {
  readonly tenantId: string;
}

export function requireTenantScopedApiActor(
  context:
    | {
        readonly execution: Pick<ExecutionContext, "tenantId">;
        readonly userId: UserId | null;
      }
    | Pick<ApiRequestContext<unknown>, "execution" | "userId">
): TenantScopedApiActor {
  if (context.userId === null) {
    throw new ApiRouteError("unauthenticated", "Authentication is required.");
  }

  if (context.execution.tenantId === null) {
    throw new ApiRouteError(
      "forbidden",
      "Tenant operating scope is required for this action."
    );
  }

  return {
    tenantId: toTenantId(context.execution.tenantId),
  };
}
