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

import { ApiRouteError } from "@/server/api/runtime/api-validation";

export function mapInventoryServiceError(error: unknown): never {
  if (error instanceof ProductNotFoundError) {
    throw new ApiRouteError("not_found", error.message);
  }

  if (error instanceof WarehouseNotFoundError) {
    throw new ApiRouteError("not_found", error.message);
  }

  if (error instanceof StockProductNotFoundError) {
    throw new ApiRouteError("not_found", error.message);
  }

  if (error instanceof StockWarehouseNotFoundError) {
    throw new ApiRouteError("not_found", error.message);
  }

  if (error instanceof ProductSkuConflictError) {
    throw new ApiRouteError("conflict", error.message);
  }

  if (error instanceof WarehouseCodeConflictError) {
    throw new ApiRouteError("conflict", error.message);
  }

  if (error instanceof WarehouseScopeMismatchError) {
    throw new ApiRouteError("forbidden", error.message);
  }

  if (error instanceof StockScopeMismatchError) {
    throw new ApiRouteError("forbidden", error.message);
  }

  if (error instanceof StockInsufficientQuantityError) {
    throw new ApiRouteError("conflict", error.message);
  }

  if (error instanceof InvalidMasterDataNaturalKeyError) {
    throw new ApiRouteError("validation_failed", error.message);
  }

  throw error;
}
