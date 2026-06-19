import {
  char,
  index,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { companyStatusEnum } from "../database.types.js";
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

export const companies = pgTable(
  "companies",
  {
    id: primaryId(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 128 }).notNull(),
    legalName: varchar("legal_name", { length: 255 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    registrationNumber: varchar("registration_number", { length: 128 }),
    taxId: varchar("tax_id", { length: 128 }),
    baseCurrency: char("base_currency", { length: 3 }).notNull(),
    countryCode: char("country_code", { length: 2 }).notNull(),
    status: companyStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => [
    uniqueIndex("companies_tenant_slug_unique").on(table.tenantId, table.slug),
    index("companies_tenant_id_idx").on(table.tenantId),
    index("companies_status_idx").on(table.status),
  ]
);
