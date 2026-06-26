import { inventoryStockLevelsGetContract } from "@/server/api/contracts/inventory/inventory.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { listInventoryStockLevels } from "@/server/inventory/inventory-stock.server";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: inventoryStockLevelsGetContract,
  handler(context) {
    const actor = requireCompanyScopedApiActor(context);

    return listInventoryStockLevels({
      companyId: actor.companyId,
      tenantId: actor.tenantId,
    });
  },
});
