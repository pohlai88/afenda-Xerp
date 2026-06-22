import {
  dashboardLayoutDeleteContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
} from "@/server/api/contracts/workspace/dashboard-layout.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import {
  getWorkspaceDashboardLayout,
  resetWorkspaceDashboardLayout,
  saveWorkspaceDashboardLayout,
} from "@/server/workspace/dashboard-layout.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requireTenantScopedActor(context: {
  readonly execution: { readonly tenantId: string | null };
  readonly userId: string | null;
}): { readonly tenantId: string; readonly userId: string } {
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

  return { tenantId, userId: context.userId };
}

export const GET = createApiHandler({
  contract: dashboardLayoutGetContract,
  async handler(context) {
    const actor = requireTenantScopedActor(context);
    return getWorkspaceDashboardLayout(actor.tenantId, actor.userId);
  },
});

export const PUT = createApiHandler({
  contract: dashboardLayoutPutContract,
  async handler(context) {
    const actor = requireTenantScopedActor(context);
    return saveWorkspaceDashboardLayout(
      actor.tenantId,
      actor.userId,
      context.requestBody
    );
  },
});

export const DELETE = createApiHandler({
  contract: dashboardLayoutDeleteContract,
  async handler(context) {
    const actor = requireTenantScopedActor(context);
    await resetWorkspaceDashboardLayout(actor.tenantId, actor.userId);
    return { reset: true as const };
  },
});
