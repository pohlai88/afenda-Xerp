import { toUserId, type UserId } from "@afenda/kernel";

import type { ApiRequestContext } from "@/server/api/runtime/api-request-context";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";
import { requireTenantScopedApiActor } from "@/server/system-admin/require-tenant-scoped-api-actor.server";

export interface InventoryTenantMutationActor {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly tenantId: string;
}

export interface InventoryCompanyMutationActor
  extends InventoryTenantMutationActor {
  readonly companyId: string;
}

function requireAuthenticatedUserId(userId: UserId | null): string {
  if (userId === null) {
    throw new ApiRouteError("unauthenticated", "Authentication is required.");
  }

  return toUserId(userId);
}

export function requireInventoryTenantMutationActor(
  context: Pick<
    ApiRequestContext<unknown>,
    "correlationId" | "execution" | "userId"
  >
): InventoryTenantMutationActor {
  const tenantScope = requireTenantScopedApiActor(context);

  return {
    actorUserId: requireAuthenticatedUserId(context.userId),
    correlationId: context.correlationId,
    tenantId: tenantScope.tenantId,
  };
}

export function requireInventoryCompanyMutationActor(
  context: Pick<
    ApiRequestContext<unknown>,
    "correlationId" | "execution" | "userId"
  >
): InventoryCompanyMutationActor {
  const companyScope = requireCompanyScopedApiActor(context);

  return {
    actorUserId: companyScope.actorUserId,
    companyId: companyScope.companyId,
    correlationId: companyScope.correlationId,
    tenantId: companyScope.tenantId,
  };
}
