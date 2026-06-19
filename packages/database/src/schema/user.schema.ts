import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { userStatusEnum } from "../database.types.js";
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";

export const users = pgTable(
  "users",
  {
    id: primaryId(),
    email: varchar("email", { length: 320 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    index("users_status_idx").on(table.status),
  ]
);
