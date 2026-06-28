import {
  type AfendaAuthSession,
  parseAuthActorIdentityFromAfendaAuthSession,
  resolveWireActorUserIdFromAfendaAuthSession,
} from "@afenda/auth";
import {
  normalizeUserIdForWire,
  type OperatingContext,
  toUserId,
} from "@afenda/kernel";

/**
 * Metadata runtime actor id from a governed auth session (PAS-001 §4.1.11 ingress).
 */
export function resolveMetadataActorUserIdFromAfendaAuthSession(
  session: AfendaAuthSession
): string {
  const identity = parseAuthActorIdentityFromAfendaAuthSession(session);

  if (identity.userId !== undefined) {
    return toUserId(identity.userId);
  }

  return resolveWireActorUserIdFromAfendaAuthSession(session);
}

/** Metadata runtime actor id from verified operating context (enterprise user wire). */
export function resolveMetadataActorUserIdFromOperatingContext(
  operatingContext: OperatingContext
): string {
  return normalizeUserIdForWire(operatingContext.actor.userId);
}
