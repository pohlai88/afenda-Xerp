import {
  type DeactivateUserInput,
  deactivateUser,
  type UserMutationResult,
} from "@afenda/database";

import { revokeAuthSessionsForPlatformUser } from "./auth.session-revoke.js";

/** Deactivates platform user and revokes linked auth sessions (FR-A01.4). */
export async function deactivatePlatformUserWithSessionRevoke(
  userId: string,
  input: DeactivateUserInput
): Promise<UserMutationResult> {
  const result = await deactivateUser(userId, input);

  await revokeAuthSessionsForPlatformUser({
    correlationId: input.audit.correlationId,
    platformUserId: userId,
  });

  return result;
}

/** FR-A01.4 alias — deactivate platform user and revoke linked auth sessions. */
export const deactivatePlatformUser = deactivatePlatformUserWithSessionRevoke;
