import { inventoryStockMovementsPostContract } from "@/server/api/contracts/inventory/inventory.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { createInventoryStockMovement } from "@/server/inventory/inventory-stock.server";
import { requireInventoryCompanyMutationActor } from "@/server/inventory/require-inventory-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createApiHandler({
  contract: inventoryStockMovementsPostContract,
  handler(context) {
    const actor = requireInventoryCompanyMutationActor(context);

    return createInventoryStockMovement({
      actorUserId: actor.actorUserId,
      companyId: actor.companyId,
      correlationId: actor.correlationId,
      request: context.requestBody,
      tenantId: actor.tenantId,
    });
  },
});
