import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { policyEffectEnum, policyStatusEnum } from "../database.types.js";
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

export const policies = pgTable(
  "policies",
  {
    id: primaryId(),
    tenantId: uuid("tenant_id").references(() => tenants.id, {
      onDelete: "cascade",
    }),
    key: varchar("key", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    effect: policyEffectEnum("effect").notNull(),
    status: policyStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => [
    uniqueIndex("policies_platform_key_unique")
      .on(table.key)
      .where(sql`${table.tenantId} is null`),
    uniqueIndex("policies_tenant_key_unique")
      .on(table.tenantId, table.key)
      .where(sql`${table.tenantId} is not null`),
    index("policies_tenant_id_idx").on(table.tenantId),
    index("policies_status_idx").on(table.status),
  ]
);
