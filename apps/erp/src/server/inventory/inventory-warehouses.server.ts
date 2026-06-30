import {
  insertWarehouse,
  listWarehousesByTenantCompany,
  updateWarehouse,
  type WarehouseListSortField,
} from "@afenda/database";
import type {
  InventoryWarehouseCreateRequestDto,
  InventoryWarehouseUpdateRequestDto,
} from "@/server/api/contracts/inventory/inventory.api-contract";
import type { ListQuery } from "@/server/api/contracts/list-query.contract";

import { mapInventoryServiceError } from "./inventory-api-errors.server";

function mapWarehouseSortFields(
  sort: ListQuery["sort"]
): WarehouseListSortField[] {
  const mapped: WarehouseListSortField[] = [];

  for (const entry of sort) {
    if (
      entry.field === "displayName" ||
      entry.field === "warehouseCode" ||
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

export async function listInventoryWarehouses(input: {
  readonly companyId: string;
  readonly listQuery: ListQuery;
  readonly tenantId: string;
}) {
  const result = await listWarehousesByTenantCompany({
    companyId: input.companyId,
    tenantId: input.tenantId,
    limit: input.listQuery.limit,
    ...(input.listQuery.cursor === undefined
      ? {}
      : { cursor: input.listQuery.cursor }),
    ...(input.listQuery.q === undefined ? {} : { q: input.listQuery.q }),
    ...(input.listQuery.filter["status"] === undefined
      ? {}
      : { filter: { status: input.listQuery.filter["status"] } }),
    sort: mapWarehouseSortFields(input.listQuery.sort),
  });

  return {
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
    warehouses: result.items.map((warehouse) => ({
      companyId: warehouse.companyId,
      displayName: warehouse.displayName,
      status: warehouse.status,
      tenantId: warehouse.tenantId,
      warehouseCode: warehouse.warehouseCode,
      warehouseId: warehouse.warehouseId,
    })),
  };
}

export async function createInventoryWarehouse(input: {
  readonly actorUserId: string;
  readonly companyId: string;
  readonly correlationId: string;
  readonly request: InventoryWarehouseCreateRequestDto;
  readonly tenantId: string;
}) {
  try {
    const result = await insertWarehouse({
      audit: {
        actorType: "user",
        actorUserId: input.actorUserId,
        correlationId: input.correlationId,
        source: "api",
      },
      companyId: input.companyId,
      displayName: input.request.displayName,
      tenantId: input.tenantId,
      warehouseCode: input.request.warehouseCode,
      ...(input.request.status === undefined
        ? {}
        : { status: input.request.status }),
    });

    return { warehouseId: result.id };
  } catch (error: unknown) {
    mapInventoryServiceError(error);
  }
}

export async function patchInventoryWarehouse(input: {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly request: InventoryWarehouseUpdateRequestDto;
  readonly tenantId: string;
}) {
  try {
    const result = await updateWarehouse(
      input.request.warehouseId,
      input.tenantId,
      {
        audit: {
          actorType: "user",
          actorUserId: input.actorUserId,
          correlationId: input.correlationId,
          source: "api",
        },
        ...(input.request.displayName === undefined
          ? {}
          : { displayName: input.request.displayName }),
        ...(input.request.status === undefined
          ? {}
          : { status: input.request.status }),
        ...(input.request.warehouseCode === undefined
          ? {}
          : { warehouseCode: input.request.warehouseCode }),
      }
    );

    return { warehouseId: result.id };
  } catch (error: unknown) {
    mapInventoryServiceError(error);
  }
}
