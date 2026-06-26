/**
 * Product master data — tenant catalog scope (ARCH-MD-001 / ADR-0019).
 *
 * Natural key: SKU unique per tenant.
 */
import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { masterDataRecordStatusEnum } from "../database.types.js";
import { primaryId, tenantIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

export const PRODUCTS_TENANT_SKU_UNIQUE_INDEX = "products_tenant_sku_unique";

export const products = pgTable(
  "products",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    sku: varchar("sku", { length: 64 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    status: masterDataRecordStatusEnum("status").notNull().default("draft"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex(PRODUCTS_TENANT_SKU_UNIQUE_INDEX).on(table.tenantId, table.sku),
    index("products_tenant_id_idx").on(table.tenantId),
    index("products_tenant_status_idx").on(table.tenantId, table.status),
  ]
);

export type ProductTable = typeof products;
