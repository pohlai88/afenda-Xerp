import { unbrand } from "@afenda/kernel";

import { commitWorkspaceDashboardMutation } from "@/lib/outbox/commit-workspace-dashboard-mutation.server";
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
  handler(context) {
    const actor = requireTenantScopedActor(context);
    return getWorkspaceDashboardLayout(actor.tenantId, actor.userId);
  },
});

export const PUT = createApiHandler({
  contract: dashboardLayoutPutContract,
  async handler(context) {
    if (
      context.userId === null ||
      context.execution.companyId === null ||
      context.execution.tenantId === null
    ) {
      throw new ApiRouteError(
        "forbidden",
        "A valid tenant and company context is required."
      );
    }

    const actorId =
      context.execution.actorId === null
        ? unbrand(context.userId)
        : unbrand(context.execution.actorId);

    const committed = await commitWorkspaceDashboardMutation({
      actorId,
      companyId: unbrand(context.execution.companyId),
      correlationId: context.correlationId,
      layout: context.requestBody,
      organizationId: context.execution.organizationId
        ? unbrand(context.execution.organizationId)
        : null,
      tenantId: unbrand(context.execution.tenantId),
      userId: unbrand(context.userId),
    });

    return {
      layout: committed.layout,
      source: committed.source,
      updatedAt: committed.updatedAt,
    };
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
