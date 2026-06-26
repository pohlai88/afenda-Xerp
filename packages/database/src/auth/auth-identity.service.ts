/**
 * Auth identity link write path — maps Better Auth user to platform user.
 *
 * Table: `schema/auth-identity-link.schema.ts`
 */
import { eq } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { authIdentityLinks } from "../schema/auth-identity-link.schema.js";

export interface InsertAuthIdentityLinkInput {
  readonly authUserId: string;
  readonly providerId: string;
  readonly userId: string;
}

export interface InsertAuthIdentityLinkResult {
  readonly id: string;
}

/** Links Better Auth identity to a platform user. Append-only provisioning path. */
export async function insertAuthIdentityLink(
  input: InsertAuthIdentityLinkInput,
  db: AfendaDatabase = getDb()
): Promise<InsertAuthIdentityLinkResult> {
  const [inserted] = await db
    .insert(authIdentityLinks)
    .values({
      authUserId: input.authUserId,
      userId: input.userId,
      providerId: input.providerId,
    })
    .returning({ id: authIdentityLinks.id });

  if (!inserted) {
    throw new Error("Auth identity link insert did not return a row id.");
  }

  return { id: inserted.id };
}

/** Resolves platform `users.id` from Better Auth `auth_user.id`. */
export async function findPlatformUserIdByAuthUserId(
  authUserId: string,
  db: AfendaDatabase = getDb()
): Promise<string | null> {
  const [link] = await db
    .select({ userId: authIdentityLinks.userId })
    .from(authIdentityLinks)
    .where(eq(authIdentityLinks.authUserId, authUserId))
    .limit(1);

  return link?.userId ?? null;
}

/** Lists Better Auth user ids linked to a platform `users.id` (FR-A01.4). */
export async function listAuthUserIdsByPlatformUserId(
  platformUserId: string,
  db: AfendaDatabase = getDb()
): Promise<string[]> {
  const rows = await db
    .select({ authUserId: authIdentityLinks.authUserId })
    .from(authIdentityLinks)
    .where(eq(authIdentityLinks.userId, platformUserId));

  return rows.map((row) => row.authUserId);
}
