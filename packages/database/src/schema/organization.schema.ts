/**
 * Postgres table definition for `organizations` (Drizzle only).
 *
 * Writes: `../organization/organization.service.ts`
 */
import {
  type AnyPgColumn,
  date,
  index,
  pgTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import {
  organizationStatusEnum,
  organizationTypeEnum,
} from "../database.types.js";
import {
  companyIdRef,
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  parentOrganizationIdRef,
  primaryId,
  tenantIdRef,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { tenants } from "./tenant.schema.js";

/**
 * Operating hierarchy within a company.
 *
 * Writes must go through `insertOrganization()` / `updateOrganization()` /
 * `deleteOrganization()` only. Tree scope and acyclicity are enforced in service.
 */
export const organizations = pgTable(
  "organizations",
  {
    id: primaryId(),
    enterpriseId: enterpriseIdColumn("organization"),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    companyId: companyIdRef()
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    parentOrganizationId: parentOrganizationIdRef().references(
      (): AnyPgColumn => organizations.id,
      { onDelete: "set null" }
    ),
    slug: varchar("slug", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: organizationTypeEnum("type").notNull().default("department"),
    status: organizationStatusEnum("status").notNull().default("active"),
    effectiveFrom: date("effective_from"),
    effectiveTo: date("effective_to"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("organizations_enterprise_id_unique").on(table.enterpriseId),
    enterpriseIdFormatCheck(table.enterpriseId, "organization"),
    uniqueIndex("organizations_company_slug_unique").on(
      table.companyId,
      table.slug
    ),
    index("organizations_tenant_id_idx").on(table.tenantId),
    index("organizations_company_id_idx").on(table.companyId),
    index("organizations_tenant_company_idx").on(
      table.tenantId,
      table.companyId
    ),
    index("organizations_company_status_idx").on(table.companyId, table.status),
    index("organizations_parent_organization_id_idx").on(
      table.parentOrganizationId
    ),
  ]
);
