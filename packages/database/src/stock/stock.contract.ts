import type { StockMovementType } from "../stock/stock-movement-type.contract.js";

export interface StockLevelRecord {
  readonly companyId: string;
  readonly productId: string;
  readonly quantityOnHand: string;
  readonly tenantId: string;
  readonly warehouseId: string;
}

export interface StockMovementWriteInput {
  readonly companyId: string;
  readonly movementType: StockMovementType;
  readonly productId: string;
  readonly quantityDelta: string;
  readonly reason?: string;
  readonly tenantId: string;
  readonly warehouseId: string;
}

export {
  isStockMovementType,
  STOCK_MOVEMENT_TYPES,
  type StockMovementType,
} from "../stock/stock-movement-type.contract.js";
