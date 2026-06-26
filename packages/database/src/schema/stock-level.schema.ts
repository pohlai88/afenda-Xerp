/**
 * Stock level snapshot — quantity on hand per product + warehouse (fdr-r02 Slice 3).
 */
import { index, numeric, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import {
  companyIdRef,
  primaryId,
  productIdRef,
  tenantIdRef,
  warehouseIdRef,
} from "../ids.js";
import { updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { products } from "./product.schema.js";
import { tenants } from "./tenant.schema.js";
import { warehouses } from "./warehouse.schema.js";

export const STOCK_LEVELS_TENANT_COMPANY_PRODUCT_WAREHOUSE_UNIQUE_INDEX =
  "stock_levels_tenant_company_product_warehouse_unique";

export const stockLevels = pgTable(
  "stock_levels",
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
    quantityOnHand: numeric("quantity_on_hand", {
      precision: 18,
      scale: 4,
    })
      .notNull()
      .default("0"),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex(STOCK_LEVELS_TENANT_COMPANY_PRODUCT_WAREHOUSE_UNIQUE_INDEX).on(
      table.tenantId,
      table.companyId,
      table.productId,
      table.warehouseId
    ),
    index("stock_levels_tenant_id_idx").on(table.tenantId),
    index("stock_levels_product_id_idx").on(table.productId),
    index("stock_levels_warehouse_id_idx").on(table.warehouseId),
  ]
);

export type StockLevelTable = typeof stockLevels;
