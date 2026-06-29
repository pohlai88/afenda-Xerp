import {
  inventoryWarehousesGetContract,
  inventoryWarehousesPatchContract,
  inventoryWarehousesPostContract,
} from "@/server/api/contracts/inventory/inventory.contract";
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
  handler(context) {
    const actor = requireInventoryCompanyMutationActor(context);

    return listInventoryWarehouses({
      companyId: actor.companyId,
      tenantId: actor.tenantId,
    });
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
