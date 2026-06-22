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

function requireAuthenticatedUserId(
  userId: string | null
): asserts userId is string {
  if (userId === null) {
    throw new ApiRouteError("unauthenticated", "Authentication is required.");
  }
}

export const GET = createApiHandler({
  contract: dashboardLayoutGetContract,
  async handler(context) {
    requireAuthenticatedUserId(context.userId);
    return getWorkspaceDashboardLayout(context.userId);
  },
});

export const PUT = createApiHandler({
  contract: dashboardLayoutPutContract,
  async handler(context) {
    requireAuthenticatedUserId(context.userId);
    return saveWorkspaceDashboardLayout(
      context.userId,
      context.requestBody
    );
  },
});

export const DELETE = createApiHandler({
  contract: dashboardLayoutDeleteContract,
  async handler(context) {
    requireAuthenticatedUserId(context.userId);
    await resetWorkspaceDashboardLayout(context.userId);
    return { reset: true as const };
  },
});
