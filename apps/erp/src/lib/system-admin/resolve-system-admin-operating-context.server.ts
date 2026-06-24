import {
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
  toAfendaAuthIdentity,
} from "@afenda/auth";
import type { OperatingContext } from "@afenda/kernel";
import { headers } from "next/headers";
import { cache } from "react";

import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";

export type SystemAdminOperatingContextResult =
  | {
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

export const resolveSystemAdminOperatingContext = cache(
  async (): Promise<SystemAdminOperatingContextResult> => {
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
    });

    if (!operatingResult.ok) {
      return {
        kind: "forbidden",
      };
    }

    return {
      kind: "ready",
      operatingContext: operatingResult.value,
    };
  }
);
