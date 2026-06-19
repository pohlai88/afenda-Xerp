import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { roleScopeEnum, roleStatusEnum } from "../database.types.js";
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

export const roles = pgTable(
  "roles",
  {
    id: primaryId(),
    tenantId: uuid("tenant_id").references(() => tenants.id, {
      onDelete: "cascade",
    }),
    key: varchar("key", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    scope: roleScopeEnum("scope").notNull(),
    status: roleStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
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
  ]
);
