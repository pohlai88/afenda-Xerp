import {
  InvalidMasterDataNaturalKeyError,
  ProductNotFoundError,
  ProductSkuConflictError,
  StockInsufficientQuantityError,
  StockProductNotFoundError,
  StockScopeMismatchError,
  StockWarehouseNotFoundError,
  WarehouseCodeConflictError,
  WarehouseNotFoundError,
  WarehouseScopeMismatchError,
} from "@afenda/database";
import { describe, expect, it } from "vitest";

import type { ApiRouteError } from "@/server/api/runtime/api-validation";
import { mapInventoryServiceError } from "@/server/inventory/inventory-api-errors.server";

describe("mapInventoryServiceError", () => {
  it("maps domain inventory errors to governed API codes", () => {
    expect(() =>
      mapInventoryServiceError(new ProductNotFoundError("p-1"))
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "not_found",
      })
    );

    expect(() =>
      mapInventoryServiceError(new ProductSkuConflictError("SKU-001"))
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "conflict",
      })
    );

    expect(() =>
      mapInventoryServiceError(new WarehouseCodeConflictError("WH-MAIN"))
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "conflict",
      })
    );

    expect(() =>
      mapInventoryServiceError(new WarehouseScopeMismatchError("scope"))
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "forbidden",
      })
    );

    expect(() =>
      mapInventoryServiceError(
        new InvalidMasterDataNaturalKeyError("invalid sku")
      )
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "validation_failed",
      })
    );

    expect(() =>
      mapInventoryServiceError(new WarehouseNotFoundError("w-1"))
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "not_found",
      })
    );

    expect(() =>
      mapInventoryServiceError(new StockProductNotFoundError("p-1"))
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "not_found",
      })
    );

    expect(() =>
      mapInventoryServiceError(new StockWarehouseNotFoundError("w-1"))
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "not_found",
      })
    );

    expect(() =>
      mapInventoryServiceError(new StockScopeMismatchError("scope"))
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "forbidden",
      })
    );

    expect(() =>
      mapInventoryServiceError(
        new StockInsufficientQuantityError({
          productId: "product-1",
          quantityDelta: "-5.0000",
          quantityOnHand: "2.0000",
          warehouseId: "warehouse-1",
        })
      )
    ).toThrow(
      expect.objectContaining<Partial<ApiRouteError>>({
        code: "conflict",
      })
    );
  });

  it("rethrows unknown errors", () => {
    const unknown = new Error("unexpected");

    expect(() => mapInventoryServiceError(unknown)).toThrow(unknown);
  });
});
