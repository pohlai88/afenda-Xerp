import { type AfendaDatabase, authSession, getDb } from "@afenda/database";
import { eq } from "drizzle-orm";

import { resolveActiveWorkspaceId } from "./auth.session.js";

export interface PersistAuthSessionActiveWorkspaceIdInput {
  readonly activeWorkspaceId: string | null;
  readonly db?: AfendaDatabase;
  readonly sessionId: string;
}

/** Persists workspace scope on the Better Auth session row — FR-A05.2. */
export async function persistAuthSessionActiveWorkspaceId(
  input: PersistAuthSessionActiveWorkspaceIdInput
): Promise<void> {
  const sessionId = input.sessionId.trim();
  if (sessionId.length === 0) {
    throw new Error("sessionId is required to persist activeWorkspaceId");
  }

  const db = input.db ?? getDb();
  const activeWorkspaceId = resolveActiveWorkspaceId(input.activeWorkspaceId);

  await db
    .update(authSession)
    .set({
      activeWorkspaceId,
      updatedAt: new Date(),
    })
    .where(eq(authSession.id, sessionId));
}
