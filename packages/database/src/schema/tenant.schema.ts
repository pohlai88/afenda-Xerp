import {
  boolean,
  index,
  pgTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { tenantStatusEnum } from "../database.types.js";
import {
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  enterpriseIdUniqueIndexName,
  primaryId,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";

export const TENANTS_ENTERPRISE_ID_UNIQUE_INDEX =
  enterpriseIdUniqueIndexName("tenants");

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
    enterpriseId: enterpriseIdColumn("tenant"),
    slug: varchar("slug", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    mfaRequired: boolean("mfa_required").notNull().default(false),
    status: tenantStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("tenants_slug_unique").on(table.slug),
    uniqueIndex(TENANTS_ENTERPRISE_ID_UNIQUE_INDEX).on(table.enterpriseId),
    enterpriseIdFormatCheck(table.enterpriseId, "tenant"),
    index("tenants_status_idx").on(table.status),
  ]
);
