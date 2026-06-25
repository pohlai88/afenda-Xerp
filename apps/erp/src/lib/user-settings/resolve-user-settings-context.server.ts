import {
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
  toAfendaAuthIdentity,
} from "@afenda/auth";
import type { OperatingContext } from "@afenda/kernel";
import { headers } from "next/headers";
import { cache } from "react";

import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";

export type UserSettingsOperatingContextResult =
  | {
      readonly actorUserId: string;
      readonly kind: "ready";
      readonly operatingContext: OperatingContext;
    }
  | {
      readonly href: string;
      readonly kind: "redirect";
    }
  | {
      readonly kind: "forbidden";
    };

/** Self-service settings guard — linked session + verified operating context only. */
export const resolveUserSettingsOperatingContext = cache(
  async (): Promise<UserSettingsOperatingContextResult> => {
    const session = await getAfendaAuthSession(await headers());

    if (!session) {
      return {
        kind: "redirect",
        href: "/sign-in",
      };
    }

    if (!isAfendaAuthSessionLinked(session)) {
      return {
        kind: "redirect",
        href: "/sign-in?error=unlinked",
      };
    }

    const identity = toAfendaAuthIdentity(session);
    const operatingResult = await resolveOperatingContextFromHeaders({
      actorUserId: identity.userId,
      activeWorkspaceId: session.metadata.activeWorkspaceId,
    });

    if (!operatingResult.ok) {
      return {
        kind: "forbidden",
      };
    }

    return {
      kind: "ready",
      actorUserId: identity.userId,
      operatingContext: operatingResult.value,
    };
  }
);
