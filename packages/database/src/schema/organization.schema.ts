import {
  type AnyPgColumn,
  index,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  organizationStatusEnum,
  organizationTypeEnum,
} from "../database.types.js";
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { tenants } from "./tenant.schema.js";

export const organizations = pgTable(
  "organizations",
  {
    id: primaryId(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    parentOrganizationId: uuid("parent_organization_id").references(
      (): AnyPgColumn => organizations.id,
      { onDelete: "set null" }
    ),
    slug: varchar("slug", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: organizationTypeEnum("type").notNull().default("department"),
    status: organizationStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => [
    uniqueIndex("organizations_company_slug_unique").on(
      table.companyId,
      table.slug
    ),
    index("organizations_tenant_id_idx").on(table.tenantId),
    index("organizations_company_id_idx").on(table.companyId),
    index("organizations_parent_organization_id_idx").on(
      table.parentOrganizationId
    ),
    index("organizations_status_idx").on(table.status),
  ]
);
