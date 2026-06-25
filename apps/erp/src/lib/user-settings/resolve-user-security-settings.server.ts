import { getAfendaAuthSession, isAuthUserMfaEnabled } from "@afenda/auth";
import { headers } from "next/headers";

import { resolveUserSettingsOperatingContext } from "./resolve-user-settings-context.server";

export interface UserSecuritySettingsViewModel {
  readonly userMfaEnabled: boolean;
}

export type ResolveUserSecuritySettingsResult =
  | {
      readonly kind: "ready";
      readonly settings: UserSecuritySettingsViewModel;
    }
  | {
      readonly kind: "not_found";
    };

/** Self-scoped security read model — personal MFA only; no tenant policy fields. */
export async function resolveUserSecuritySettings(): Promise<ResolveUserSecuritySettingsResult> {
  const contextResult = await resolveUserSettingsOperatingContext();

  if (contextResult.kind !== "ready") {
    return { kind: "not_found" };
  }

  const session = await getAfendaAuthSession(await headers());

  if (!session) {
    return { kind: "not_found" };
  }

  const userMfaEnabled = await isAuthUserMfaEnabled(session.user.authUserId);

  return {
    kind: "ready",
    settings: {
      userMfaEnabled,
    },
  };
}
