/**
 * Tenant-scoped member invitation tokens (ARCH-AUTH-001 Slice 11).
 *
 * Writes: `../membership/member-invitation.service.ts`
 */
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { primaryId, tenantIdRef, userIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";
import { users } from "./user.schema.js";

export const memberInvitations = pgTable(
  "member_invitations",
  {
    id: primaryId(),
    tenantId: tenantIdRef().references(() => tenants.id, {
      onDelete: "cascade",
    }),
    email: text("email").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    platformUserId: userIdRef().references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("member_invitations_token_hash_uidx").on(table.tokenHash),
    index("member_invitations_tenant_id_idx").on(table.tenantId),
    index("member_invitations_email_idx").on(table.email),
    index("member_invitations_tenant_pending_idx").on(
      table.tenantId,
      table.consumedAt,
      table.expiresAt
    ),
  ]
);
