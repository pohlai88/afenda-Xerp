"use server";

import { z } from "zod";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

import {
  USER_SETTINGS_AUDIT_EVENTS,
  USER_SETTINGS_MUTATION_AUDIT_MODULE,
} from "./user-settings-audit.registry";

const RECORD_USER_SESSION_REVOKED_ACTION =
  "user.settings.session.revoke.record" as const;

const recordUserSessionRevokedInputSchema = z.object({
  sessionId: z.string().min(1).max(128),
});

export interface RecordUserSessionRevokedData {
  readonly acknowledged: true;
}

export type RecordUserSessionRevokedActionState =
  ServerActionResult<RecordUserSessionRevokedData> | null;

export async function recordUserSessionRevokedAction(
  sessionId: string
): Promise<RecordUserSessionRevokedActionState> {
  const parsed = parseProtectedActionInput(
    recordUserSessionRevokedInputSchema,
    { sessionId }
  );
  if (!parsed.ok) {
    return failServerAction({
      action: RECORD_USER_SESSION_REVOKED_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: RECORD_USER_SESSION_REVOKED_ACTION,
      error: contextResult.error,
    });
  }

  const actorUserId = contextResult.operatingContext.actor.userId;

  await recordActionAudit({
    action: USER_SETTINGS_AUDIT_EVENTS.sessionRevoked,
    actorUserId,
    module: USER_SETTINGS_MUTATION_AUDIT_MODULE,
    result: "success",
    targetId: parsed.value.sessionId,
    targetType: "user_session",
  });

  return serverActionSuccess({ acknowledged: true });
}
