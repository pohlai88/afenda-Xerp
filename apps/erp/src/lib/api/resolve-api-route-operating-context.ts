import {
  err,
  type OperatingContextError,
  type OperatingContextResult,
} from "@afenda/kernel";

import { resolveApiRouteAuthActor } from "@/lib/auth/resolve-api-route-auth-actor.server";
import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";

export interface ResolveApiRouteOperatingContextInput {
  readonly requestHeaders: Headers;
}

/**
 * Minimal protected API operating-context resolver — delegates to IS-002 spine (R1a).
 * R2 S2S scaffold: service/delegated_application headers parse at ingress before session path.
 */
export async function resolveApiRouteOperatingContext(
  input: ResolveApiRouteOperatingContextInput
): Promise<OperatingContextResult> {
  const authActor = await resolveApiRouteAuthActor(input.requestHeaders);

  if (authActor === null) {
    return err({
      code: "MEMBERSHIP_DENIED",
      userMessage:
        "Authentication is required for protected internal API routes.",
    } satisfies OperatingContextError);
  }

  if (authActor.kind === "service") {
    return err({
      code: "MEMBERSHIP_DENIED",
      userMessage:
        "Service actor operating context assembly is scaffolded — full S2S scope resolution lands in PAS-001A API track.",
    } satisfies OperatingContextError);
  }

  return resolveOperatingContext({
    requestHeaders: input.requestHeaders,
    session: authActor.session,
  });
}
