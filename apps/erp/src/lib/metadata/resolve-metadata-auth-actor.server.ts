import type { AfendaAuthSession } from "@afenda/auth";
import { parseAuthActorIdentityFromAfendaAuthSession } from "@afenda/auth";
import { normalizeUserIdForWire, type OperatingContext } from "@afenda/kernel";

import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";

export { parseAuthActorIdentityFromAfendaAuthSession };

/** Metadata runtime actor id from a governed auth session. */
export function resolveMetadataActorUserIdFromAfendaAuthSession(
  session: AfendaAuthSession
): string {
  return resolveProtectedPathActorUserIdFromSession(session);
}

/** Metadata runtime actor id from verified operating context. */
export function resolveMetadataActorUserIdFromOperatingContext(
  operatingContext: OperatingContext
): string {
  const normalized = normalizeUserIdForWire(operatingContext.actor.userId);

  if (normalized === null) {
    throw new Error(
      "Operating context actor userId must normalize for metadata wire ingress."
    );
  }

  return normalized;
}
