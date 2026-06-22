/**
 * Corporate group authority under a tenant (TIP-008 foundation).
 *
 * Writes: `../entity-group/entity-group.service.ts`
 */
import {
  index,
  pgTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { companyStatusEnum } from "../database.types.js";
import {
  parentLegalEntityIdRef,
  primaryId,
  tenantIdRef,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { tenants } from "./tenant.schema.js";

export const entityGroups = pgTable(
  "entity_groups",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    slug: varchar("slug", { length: 128 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    parentLegalEntityId: parentLegalEntityIdRef().references(
      () => companies.id,
      { onDelete: "set null" }
    ),
    status: companyStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("entity_groups_tenant_slug_unique").on(
      table.tenantId,
      table.slug
    ),
    index("entity_groups_tenant_id_idx").on(table.tenantId),
    index("entity_groups_tenant_status_idx").on(table.tenantId, table.status),
    index("entity_groups_parent_legal_entity_id_idx").on(
      table.parentLegalEntityId
    ),
  ]
);

export type EntityGroupTable = typeof entityGroups;
