import { listStockLevelsByTenant, recordStockMovement } from "@afenda/database";

import type { InventoryStockMovementCreateRequestDto } from "@/server/api/contracts/inventory/inventory.api-contract";

import { mapInventoryServiceError } from "./inventory-api-errors.server";

export async function listInventoryStockLevels(input: {
  readonly companyId: string;
  readonly tenantId: string;
}) {
  const stockLevels = await listStockLevelsByTenant({
    companyId: input.companyId,
    tenantId: input.tenantId,
  });

  return {
    stockLevels: stockLevels.map((level) => ({
      companyId: level.companyId,
      productId: level.productId,
      quantityOnHand: level.quantityOnHand,
      tenantId: level.tenantId,
      warehouseId: level.warehouseId,
    })),
  };
}

export async function createInventoryStockMovement(input: {
  readonly actorUserId: string;
  readonly companyId: string;
  readonly correlationId: string;
  readonly request: InventoryStockMovementCreateRequestDto;
  readonly tenantId: string;
}): Promise<{ movementId: string; quantityOnHand: string }> {
  const result = await recordStockMovement({
    audit: {
      actorType: "user",
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
      source: "api",
    },
    companyId: input.companyId,
    movementType: input.request.movementType,
    productId: input.request.productId,
    quantityDelta: input.request.quantityDelta,
    ...(input.request.reason === undefined
      ? {}
      : { reason: input.request.reason }),
    tenantId: input.tenantId,
    warehouseId: input.request.warehouseId,
  }).catch((error: unknown) => mapInventoryServiceError(error));

  return {
    movementId: result.movementId,
    quantityOnHand: result.quantityOnHand,
  };
}
