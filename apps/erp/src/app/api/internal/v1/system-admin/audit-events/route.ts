import { buildPaginationMeta } from "@/server/api/contracts/pagination.contract";
import { systemAdminAuditEventsGetContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { listSystemAdminAuditEvents } from "@/server/system-admin/list-system-admin-audit-events.server";
import { requireTenantScopedApiActor } from "@/server/system-admin/require-tenant-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: systemAdminAuditEventsGetContract,
  async handler(context) {
    const actor = requireTenantScopedApiActor(context);
    const paginationQuery = context.paginationQuery;
    if (paginationQuery === undefined) {
      throw new ApiRouteError(
        "internal_error",
        "Pagination query is required for cursor-paginated routes."
      );
    }

    const result = await listSystemAdminAuditEvents({
      limit: paginationQuery.limit,
      tenantId: actor.tenantId,
      ...(paginationQuery.cursor === undefined
        ? {}
        : { cursor: paginationQuery.cursor }),
    });

    return {
      data: { events: result.events },
      pagination: buildPaginationMeta({
        hasMore: result.hasMore,
        limit: paginationQuery.limit,
        nextCursor: result.nextCursor,
      }),
    };
  },
});
