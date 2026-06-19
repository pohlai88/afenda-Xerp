/**
 * Postgres table definition for `companies` (Drizzle only).
 *
 * Writes: `../company/company.service.ts`
 */
import { sql } from "drizzle-orm";
import {
  char,
  index,
  pgTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { companyStatusEnum } from "../database.types.js";
import { primaryId, tenantIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

/**
 * Governed legal/business entity within a tenant.
 *
 * Writes must go through `insertCompany()` / `updateCompany()` only.
 * Tenant owns platform boundary; company owns legal/business boundary.
 */
export const companies = pgTable(
  "companies",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    slug: varchar("slug", { length: 128 }).notNull(),
    legalName: varchar("legal_name", { length: 255 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    registrationNumber: varchar("registration_number", { length: 128 }),
    taxId: varchar("tax_id", { length: 128 }),
    baseCurrency: char("base_currency", { length: 3 }).notNull(),
    countryCode: char("country_code", { length: 2 }).notNull(),
    status: companyStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("companies_tenant_slug_unique").on(table.tenantId, table.slug),
    uniqueIndex("companies_tenant_country_registration_unique")
      .on(table.tenantId, table.countryCode, table.registrationNumber)
      .where(sql`${table.registrationNumber} is not null`),
    index("companies_tenant_id_idx").on(table.tenantId),
    index("companies_tenant_status_idx").on(table.tenantId, table.status),
    index("companies_status_idx").on(table.status),
  ]
);
