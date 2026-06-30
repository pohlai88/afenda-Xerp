import { toProductId } from "@afenda/kernel";
import { parseRouteProductId } from "@/lib/api/parse-route-id";
import {
  inventoryProductsGetContract,
  inventoryProductsPatchContract,
  inventoryProductsPostContract,
} from "@/server/api/contracts/inventory/inventory.contract";
import { buildPaginationMeta } from "@/server/api/contracts/pagination.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import {
  createInventoryProduct,
  listInventoryProducts,
  patchInventoryProduct,
} from "@/server/inventory/inventory-products.server";
import { requireInventoryTenantMutationActor } from "@/server/inventory/require-inventory-api-actor.server";
import { requireTenantScopedApiActor } from "@/server/system-admin/require-tenant-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: inventoryProductsGetContract,
  async handler(context) {
    const actor = requireTenantScopedApiActor(context);
    const listQuery = context.listQuery;
    if (listQuery === undefined) {
      throw new ApiRouteError(
        "internal_error",
        "List query is required for cursor-paginated routes."
      );
    }

    const result = await listInventoryProducts({
      listQuery,
      tenantId: actor.tenantId,
    });

    return {
      data: { products: result.products },
      pagination: buildPaginationMeta({
        hasMore: result.hasMore,
        limit: listQuery.limit,
        nextCursor: result.nextCursor,
      }),
    };
  },
});

export const POST = createApiHandler({
  contract: inventoryProductsPostContract,
  handler(context) {
    const actor = requireInventoryTenantMutationActor(context);

    return createInventoryProduct({
      actorUserId: actor.actorUserId,
      correlationId: actor.correlationId,
      request: context.requestBody,
      tenantId: actor.tenantId,
    });
  },
});

export const PATCH = createApiHandler({
  contract: inventoryProductsPatchContract,
  handler(context) {
    const actor = requireInventoryTenantMutationActor(context);
    const productId = toProductId(
      parseRouteProductId(context.requestBody.productId)
    );

    return patchInventoryProduct({
      actorUserId: actor.actorUserId,
      correlationId: actor.correlationId,
      request: {
        ...context.requestBody,
        productId,
      },
      tenantId: actor.tenantId,
    });
  },
});
