import { inventoryStockLevelsGetContract } from "@/server/api/contracts/inventory/inventory.contract";
import { buildPaginationMeta } from "@/server/api/contracts/pagination.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { listInventoryStockLevels } from "@/server/inventory/inventory-stock.server";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: inventoryStockLevelsGetContract,
  async handler(context) {
    const actor = requireCompanyScopedApiActor(context);
    const listQuery = context.listQuery;
    if (listQuery === undefined) {
      throw new ApiRouteError(
        "internal_error",
        "List query is required for cursor-paginated routes."
      );
    }

    const result = await listInventoryStockLevels({
      companyId: actor.companyId,
      listQuery,
      tenantId: actor.tenantId,
    });

    return {
      data: { stockLevels: result.stockLevels },
      pagination: buildPaginationMeta({
        hasMore: result.hasMore,
        limit: listQuery.limit,
        nextCursor: result.nextCursor,
      }),
    };
  },
});
