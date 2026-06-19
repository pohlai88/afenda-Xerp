import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { tenantStatusEnum } from "../database.types.js";
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";

/**
 * Hard platform isolation boundary.
 *
 * Golden rule: tenant owns isolation; company owns legal entity;
 * organization owns operating structure.
 *
 * Writes must go through `insertTenant()` / `updateTenant()` / `archiveTenant()`.
 * Contract: `../tenant/tenant.contract.ts`
 * Do not hard-delete tenants.
 */
export const tenants = pgTable(
  "tenants",
  {
    id: primaryId(),
    slug: varchar("slug", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: tenantStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("tenants_slug_unique").on(table.slug),
    index("tenants_status_idx").on(table.status),
  ]
);
