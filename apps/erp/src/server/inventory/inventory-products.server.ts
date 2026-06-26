import {
  insertProduct,
  listProductsByTenant,
  updateProduct,
} from "@afenda/database";

import type {
  InventoryProductCreateRequestDto,
  InventoryProductUpdateRequestDto,
} from "@/server/api/contracts/inventory/inventory.api-contract";

import { mapInventoryServiceError } from "./inventory-api-errors.server";

export async function listInventoryProducts(input: {
  readonly tenantId: string;
}) {
  const products = await listProductsByTenant({
    tenantId: input.tenantId,
  });

  return {
    products: products.map((product) => ({
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
