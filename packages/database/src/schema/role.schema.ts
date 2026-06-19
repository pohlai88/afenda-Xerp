/**
 * Postgres table definition for `roles` (Drizzle only).
 *
 * Writes: `../role/role.service.ts`
 */
import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { roleScopeEnum, roleStatusEnum } from "../database.types.js";
import { primaryId, tenantIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

/**
 * Authority template — not the grant.
 *
 * Golden rule: role is the authority template; membership is the grant;
 * permission is the capability.
 *
 * Writes must go through `insertRole()` / `updateRole()` / `archiveRole()`.
 * Role key, tenantId, and scope are immutable after create.
 */
export const roles = pgTable(
  "roles",
  {
    id: primaryId(),
    tenantId: tenantIdRef().references(() => tenants.id, {
      onDelete: "restrict",
    }),
    key: varchar("key", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    scope: roleScopeEnum("scope").notNull(),
    status: roleStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("roles_platform_key_unique")
      .on(table.key)
      .where(sql`${table.tenantId} is null`),
    uniqueIndex("roles_tenant_key_unique")
      .on(table.tenantId, table.key)
      .where(sql`${table.tenantId} is not null`),
    index("roles_tenant_id_idx").on(table.tenantId),
    index("roles_status_idx").on(table.status),
    index("roles_tenant_status_idx").on(table.tenantId, table.status),
    index("roles_tenant_scope_status_idx").on(
      table.tenantId,
      table.scope,
      table.status
    ),
  ]
);
