/**
 * Team authority under a tenant (TIP-030 foundation).
 *
 * Writes: `../team/team.service.ts`
 */
import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { companyStatusEnum } from "../database.types.js";
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

export const teams = pgTable(
  "teams",
  {
    id: primaryId(),
    enterpriseId: enterpriseIdColumn("team"),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    companyId: companyIdRef().references(() => companies.id, {
      onDelete: "restrict",
    }),
    organizationUnitId: organizationIdRef().references(() => organizations.id, {
      onDelete: "set null",
    }),
    slug: varchar("slug", { length: 128 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    status: companyStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("teams_enterprise_id_unique").on(table.enterpriseId),
    enterpriseIdFormatCheck(table.enterpriseId, "team"),
    uniqueIndex("teams_tenant_slug_unique").on(table.tenantId, table.slug),
    index("teams_tenant_id_idx").on(table.tenantId),
    index("teams_tenant_status_idx").on(table.tenantId, table.status),
    index("teams_company_id_idx").on(table.companyId),
    index("teams_organization_unit_id_idx").on(table.organizationUnitId),
  ]
);

export type TeamTable = typeof teams;
