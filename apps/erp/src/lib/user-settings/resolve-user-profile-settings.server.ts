import { getAfendaAuthSession } from "@afenda/auth";
import { getDb, users } from "@afenda/database";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { resolveUserSettingsOperatingContext } from "./resolve-user-settings-context.server";

export interface UserProfileSettingsViewModel {
  readonly displayName: string;
  readonly email: string;
  readonly emailVerified: boolean;
}

export type ResolveUserProfileSettingsResult =
  | {
      readonly kind: "ready";
      readonly profile: UserProfileSettingsViewModel;
    }
  | {
      readonly kind: "not_found";
    };

/** Loads self-scoped profile fields from platform `users` + linked auth session. */
export async function resolveUserProfileSettings(): Promise<ResolveUserProfileSettingsResult> {
  const contextResult = await resolveUserSettingsOperatingContext();

  if (contextResult.kind !== "ready") {
    return { kind: "not_found" };
  }

  const session = await getAfendaAuthSession(await headers());

  const [platformUser] = await getDb()
    .select({
      displayName: users.displayName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, contextResult.actorUserId))
    .limit(1);

  if (!platformUser) {
    return { kind: "not_found" };
  }

  return {
    kind: "ready",
    profile: {
      displayName: platformUser.displayName,
      email: platformUser.email,
      emailVerified: session?.user.emailVerified ?? false,
    },
  };
}
