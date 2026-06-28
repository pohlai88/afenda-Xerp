/**
 * Stock movement audit trail — inventory domain Slice 3.
 */
import { index, numeric, pgTable, varchar } from "drizzle-orm/pg-core";
import { stockMovementTypeEnum } from "../database.types.js";
import {
  companyIdRef,
  primaryId,
  productIdRef,
  tenantIdRef,
  warehouseIdRef,
} from "../ids.js";
import { createdAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { products } from "./product.schema.js";
import { tenants } from "./tenant.schema.js";
import { warehouses } from "./warehouse.schema.js";

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    companyId: companyIdRef()
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    productId: productIdRef()
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    warehouseId: warehouseIdRef()
      .notNull()
      .references(() => warehouses.id, { onDelete: "restrict" }),
    movementType: stockMovementTypeEnum("movement_type").notNull(),
    quantityDelta: numeric("quantity_delta", {
      precision: 18,
      scale: 4,
    }).notNull(),
    reason: varchar("reason", { length: 255 }),
    createdAt: createdAtColumn(),
  },
  (table) => [
    index("stock_movements_tenant_id_idx").on(table.tenantId),
    index("stock_movements_product_id_idx").on(table.productId),
    index("stock_movements_warehouse_id_idx").on(table.warehouseId),
    index("stock_movements_tenant_created_at_idx").on(
      table.tenantId,
      table.createdAt
    ),
  ]
);

export type StockMovementTable = typeof stockMovements;
