/**
 * Self-scoped user preference document (ARCH-USER-001 Slice 4A).
 *
 * Writes: `../user-preferences/user-preferences.service.ts`
 * Contract: `../user-preferences/user-preferences.contract.ts`
 */
import { index, jsonb, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

import { primaryId, userIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { users } from "./user.schema.js";

export const userPreferences = pgTable(
  "user_preferences",
  {
    id: primaryId(),
    userId: userIdRef()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    notifications: jsonb("notifications").notNull().default({}),
    display: jsonb("display").notNull().default({}),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("user_preferences_user_id_uidx").on(table.userId),
    index("user_preferences_user_id_idx").on(table.userId),
  ]
);
