/**
 * Postgres table definition for `permissions` (Drizzle only).
 *
 * Writes: `../permission/permission.service.ts`
 * Key shape: `../permission-key.contract.ts`
 */
import { pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import {
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  primaryId,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";

export const permissions = pgTable(
  "permissions",
  {
    id: primaryId(),
    enterpriseId: enterpriseIdColumn("permission"),
    key: varchar("key", { length: 191 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    domain: varchar("domain", { length: 64 }).notNull(),
    action: varchar("action", { length: 64 }).notNull(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("permissions_enterprise_id_unique").on(table.enterpriseId),
    enterpriseIdFormatCheck(table.enterpriseId, "permission"),
    uniqueIndex("permissions_key_unique").on(table.key),
  ]
);
