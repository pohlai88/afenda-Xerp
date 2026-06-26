/**
 * Warehouse master data — tenant + company scope (ARCH-MD-001 / ADR-0019).
 *
 * Natural key: warehouseCode unique per company within tenant.
 */
import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { masterDataRecordStatusEnum } from "../database.types.js";
import { companyIdRef, primaryId, tenantIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { tenants } from "./tenant.schema.js";

export const WAREHOUSES_TENANT_COMPANY_CODE_UNIQUE_INDEX =
  "warehouses_tenant_company_code_unique";

export const warehouses = pgTable(
  "warehouses",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    companyId: companyIdRef()
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    warehouseCode: varchar("warehouse_code", { length: 64 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    status: masterDataRecordStatusEnum("status").notNull().default("draft"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex(WAREHOUSES_TENANT_COMPANY_CODE_UNIQUE_INDEX).on(
      table.tenantId,
      table.companyId,
      table.warehouseCode
    ),
    index("warehouses_tenant_id_idx").on(table.tenantId),
    index("warehouses_company_id_idx").on(table.companyId),
    index("warehouses_tenant_status_idx").on(table.tenantId, table.status),
  ]
);

export type WarehouseTable = typeof warehouses;
