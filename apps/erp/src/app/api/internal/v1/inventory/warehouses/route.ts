import {
  inventoryWarehousesGetContract,
  inventoryWarehousesPatchContract,
  inventoryWarehousesPostContract,
} from "@/server/api/contracts/inventory/inventory.contract";
import { buildPaginationMeta } from "@/server/api/contracts/pagination.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import {
  createInventoryWarehouse,
  listInventoryWarehouses,
  patchInventoryWarehouse,
} from "@/server/inventory/inventory-warehouses.server";
import { requireInventoryCompanyMutationActor } from "@/server/inventory/require-inventory-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: inventoryWarehousesGetContract,
  async handler(context) {
    const actor = requireInventoryCompanyMutationActor(context);
    const listQuery = context.listQuery;
    if (listQuery === undefined) {
      throw new ApiRouteError(
        "internal_error",
        "List query is required for cursor-paginated routes."
      );
    }

    const result = await listInventoryWarehouses({
      companyId: actor.companyId,
      listQuery,
      tenantId: actor.tenantId,
    });

    return {
      data: { warehouses: result.warehouses },
      pagination: buildPaginationMeta({
        hasMore: result.hasMore,
        limit: listQuery.limit,
        nextCursor: result.nextCursor,
      }),
    };
  },
});

export const POST = createApiHandler({
  contract: inventoryWarehousesPostContract,
  handler(context) {
    const actor = requireInventoryCompanyMutationActor(context);

    return createInventoryWarehouse({
      actorUserId: actor.actorUserId,
      companyId: actor.companyId,
      correlationId: actor.correlationId,
      request: context.requestBody,
      tenantId: actor.tenantId,
    });
  },
});

export const PATCH = createApiHandler({
  contract: inventoryWarehousesPatchContract,
  handler(context) {
    const actor = requireInventoryCompanyMutationActor(context);

    return patchInventoryWarehouse({
      actorUserId: actor.actorUserId,
      correlationId: actor.correlationId,
      request: context.requestBody,
      tenantId: actor.tenantId,
    });
  },
});
