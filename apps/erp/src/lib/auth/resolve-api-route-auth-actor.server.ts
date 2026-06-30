import type { AfendaAuthSession } from "@afenda/auth";
import { getAfendaAuthSession } from "@afenda/auth";
import type { AuthActorIdentity } from "@afenda/kernel";

import {
  hasServiceActorIngressHeaders,
  parseServiceActorIdentityFromRequestHeaders,
} from "./resolve-service-actor.server";

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
 * Resolves protected internal API auth actor — verified S2S service headers or human session.
 * When service ingress headers are present but verification fails, session fallback is denied.
 */
export async function resolveApiRouteAuthActor(
  requestHeaders: Headers
): Promise<ApiRouteAuthActor | null> {
  if (hasServiceActorIngressHeaders(requestHeaders)) {
    const serviceIdentity =
      parseServiceActorIdentityFromRequestHeaders(requestHeaders);

    if (serviceIdentity !== null) {
      return { kind: "service", identity: serviceIdentity };
    }

    return null;
  }

  const session = await getAfendaAuthSession(requestHeaders);

  if (session !== null) {
    return { kind: "human", session };
  }

  return null;
}
