import type { AfendaAuthSession } from "@afenda/auth";
import { getAfendaAuthSession } from "@afenda/auth";
import type { AuthActorIdentity } from "@afenda/kernel";

import { parseServiceActorIdentityFromRequestHeaders } from "./resolve-service-actor.server";

export type ApiRouteAuthActor =
  | {
      readonly kind: "human";
      readonly session: AfendaAuthSession;
    }
  | {
      readonly kind: "service";
      readonly identity: AuthActorIdentity;
    };

/**
 * Resolves protected internal API auth actor — human session or S2S service headers.
 */
export async function resolveApiRouteAuthActor(
  requestHeaders: Headers
): Promise<ApiRouteAuthActor | null> {
  const serviceIdentity =
    parseServiceActorIdentityFromRequestHeaders(requestHeaders);

  if (serviceIdentity !== null) {
    return { kind: "service", identity: serviceIdentity };
  }

  const session = await getAfendaAuthSession(requestHeaders);

  if (session !== null) {
    return { kind: "human", session };
  }

  return null;
}
