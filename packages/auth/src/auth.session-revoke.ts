import {
  authSession,
  getAuthDb,
  listAuthUserIdsByPlatformUserId,
} from "@afenda/database";
import { inArray } from "drizzle-orm";

import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";

export interface RevokeAuthSessionsForPlatformUserInput {
  readonly correlationId?: string;
  readonly platformUserId: string;
}

/** Revokes all Better Auth sessions for linked auth_user rows (FR-A01.4). */
export async function revokeAuthSessionsForPlatformUser(
  input: RevokeAuthSessionsForPlatformUserInput
): Promise<number> {
  const authUserIds = await listAuthUserIdsByPlatformUserId(
    input.platformUserId
  );

  if (authUserIds.length === 0) {
    return 0;
  }

  const authDb = getAuthDb();
  const deleted = await authDb
    .delete(authSession)
    .where(inArray(authSession.userId, authUserIds))
    .returning({ id: authSession.id });

  if (deleted.length > 0) {
    await persistAuthAuditEvent({
      event: AUTH_EVENT.sessionInvalidated,
      result: "success",
      context: {
        platformUserId: input.platformUserId,
        ...(input.correlationId === undefined
          ? {}
          : { correlationId: input.correlationId }),
      },
    });
  }

  return deleted.length;
}
