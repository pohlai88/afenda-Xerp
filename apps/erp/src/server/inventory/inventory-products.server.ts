import {
  insertProduct,
  listProductsByTenant,
  type ProductListSortField,
  updateProduct,
} from "@afenda/database";
import type {
  InventoryProductCreateRequestDto,
  InventoryProductUpdateRequestDto,
} from "@/server/api/contracts/inventory/inventory.api-contract";
import type { ListQuery } from "@/server/api/contracts/list-query.contract";

import { mapInventoryServiceError } from "./inventory-api-errors.server";

function mapProductSortFields(sort: ListQuery["sort"]): ProductListSortField[] {
  const mapped: ProductListSortField[] = [];

  for (const entry of sort) {
    if (
      entry.field === "displayName" ||
      entry.field === "sku" ||
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

export async function listInventoryProducts(input: {
  readonly listQuery: ListQuery;
  readonly tenantId: string;
}) {
  const result = await listProductsByTenant({
    tenantId: input.tenantId,
    limit: input.listQuery.limit,
    ...(input.listQuery.cursor === undefined
      ? {}
      : { cursor: input.listQuery.cursor }),
    ...(input.listQuery.q === undefined ? {} : { q: input.listQuery.q }),
    ...(input.listQuery.filter["status"] === undefined
      ? {}
      : { filter: { status: input.listQuery.filter["status"] } }),
    sort: mapProductSortFields(input.listQuery.sort),
  });

  return {
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
    products: result.items.map((product) => ({
      displayName: product.displayName,
      productId: product.productId,
      sku: product.sku,
      status: product.status,
      tenantId: product.tenantId,
    })),
  };
}

export async function createInventoryProduct(input: {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly request: InventoryProductCreateRequestDto;
  readonly tenantId: string;
}) {
  try {
    const result = await insertProduct({
      audit: {
        actorType: "user",
        actorUserId: input.actorUserId,
        correlationId: input.correlationId,
        source: "api",
      },
      displayName: input.request.displayName,
      sku: input.request.sku,
      ...(input.request.status === undefined
        ? {}
        : { status: input.request.status }),
      tenantId: input.tenantId,
    });

    return { productId: result.id };
  } catch (error: unknown) {
    mapInventoryServiceError(error);
  }
}

export async function patchInventoryProduct(input: {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly request: InventoryProductUpdateRequestDto;
  readonly tenantId: string;
}) {
  try {
    const result = await updateProduct(
      input.request.productId,
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
        ...(input.request.sku === undefined ? {} : { sku: input.request.sku }),
        ...(input.request.status === undefined
          ? {}
          : { status: input.request.status }),
      }
    );

    return { productId: result.id };
  } catch (error: unknown) {
    mapInventoryServiceError(error);
  }
}
