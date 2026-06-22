import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { primaryId, userIdRef } from "../ids.js";
import { authUser } from "./auth.schema.js";
import { users } from "./user.schema.js";

/**
 * Maps Better Auth login identity to Afenda platform `users.id`.
 *
 * Golden rule: audit and authorization use `userId` (platform), never `authUserId`.
 */
export const authIdentityLinks = pgTable(
  "auth_identity_links",
  {
    id: primaryId(),
    authUserId: text("auth_user_id")
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
    userId: userIdRef()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("auth_identity_links_auth_user_provider_unique").on(
      table.authUserId,
      table.providerId
    ),
    index("auth_identity_links_auth_user_id_idx").on(table.authUserId),
    index("auth_identity_links_user_id_idx").on(table.userId),
  ]
);

export type AuthIdentityLinkInsert = typeof authIdentityLinks.$inferInsert;
