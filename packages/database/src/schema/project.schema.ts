/**
 * Project authority under a tenant (Foundation phase 30 foundation).
 *
 * Writes: `../project/project.service.ts`
 */
import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { projectLifecycleStatusEnum } from "../database.types.js";
import {
  companyIdRef,
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  organizationIdRef,
  primaryId,
  tenantIdRef,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { organizations } from "./organization.schema.js";
import { tenants } from "./tenant.schema.js";

export const projects = pgTable(
  "projects",
  {
    id: primaryId(),
    enterpriseId: enterpriseIdColumn("project"),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    companyId: companyIdRef()
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    organizationUnitId: organizationIdRef().references(() => organizations.id, {
      onDelete: "set null",
    }),
    slug: varchar("slug", { length: 128 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    status: projectLifecycleStatusEnum("status").notNull().default("draft"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("projects_enterprise_id_unique").on(table.enterpriseId),
    enterpriseIdFormatCheck(table.enterpriseId, "project"),
    uniqueIndex("projects_tenant_slug_unique").on(table.tenantId, table.slug),
    index("projects_tenant_id_idx").on(table.tenantId),
    index("projects_tenant_status_idx").on(table.tenantId, table.status),
    index("projects_company_id_idx").on(table.companyId),
    index("projects_organization_unit_id_idx").on(table.organizationUnitId),
  ]
);

export type ProjectTable = typeof projects;
