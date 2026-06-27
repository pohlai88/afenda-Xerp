import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { userStatusEnum } from "../database.types.js";
import {
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  primaryId,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";

/**
 * Afenda platform actor identity (Postgres table — Drizzle only).
 *
 * Writes: `../user/user.service.ts`
 * Not Better Auth login identity — see `auth.schema.ts`.
 *
 * Golden rule: `users.id` is the ERP authority actor — audit, membership,
 * ownership, approval, assignment. Better Auth login lives in `auth_user`.
 *
 * Do not hard-delete users.
 */
export const users = pgTable(
  "users",
  {
    id: primaryId(),
    enterpriseId: enterpriseIdColumn("user"),
    email: varchar("email", { length: 320 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("users_enterprise_id_unique").on(table.enterpriseId),
    enterpriseIdFormatCheck(table.enterpriseId, "user"),
    uniqueIndex("users_email_unique").on(table.email),
    index("users_status_idx").on(table.status),
  ]
);
