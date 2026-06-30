import {
  listStockLevelsByTenant,
  recordStockMovement,
  type StockLevelListSortField,
} from "@afenda/database";
import type { InventoryStockMovementCreateRequestDto } from "@/server/api/contracts/inventory/inventory.api-contract";
import type { ListQuery } from "@/server/api/contracts/list-query.contract";

import { mapInventoryServiceError } from "./inventory-api-errors.server";

function mapStockLevelSortFields(
  sort: ListQuery["sort"]
): StockLevelListSortField[] {
  const mapped: StockLevelListSortField[] = [];

  for (const entry of sort) {
    if (
      entry.field === "productId" ||
      entry.field === "quantityOnHand" ||
      entry.field === "updatedAt"
    ) {
      mapped.push({
        direction: entry.direction,
        field: entry.field,
      });
    }
  }

  return mapped;
}

export async function listInventoryStockLevels(input: {
  readonly companyId: string;
  readonly listQuery: ListQuery;
  readonly tenantId: string;
}) {
  const result = await listStockLevelsByTenant({
    companyId: input.companyId,
    tenantId: input.tenantId,
    limit: input.listQuery.limit,
    ...(input.listQuery.cursor === undefined
      ? {}
      : { cursor: input.listQuery.cursor }),
    ...(input.listQuery.filter["productId"] === undefined &&
    input.listQuery.filter["warehouseId"] === undefined
      ? {}
      : {
          filter: {
            ...(input.listQuery.filter["productId"] === undefined
              ? {}
              : { productId: input.listQuery.filter["productId"] }),
            ...(input.listQuery.filter["warehouseId"] === undefined
              ? {}
              : { warehouseId: input.listQuery.filter["warehouseId"] }),
          },
        }),
    sort: mapStockLevelSortFields(input.listQuery.sort),
  });

  return {
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
    stockLevels: result.items.map((level) => ({
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
