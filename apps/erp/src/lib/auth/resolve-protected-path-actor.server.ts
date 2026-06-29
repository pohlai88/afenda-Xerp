/**
 * PAS-001 §4.1.11 — canonical ERP protected-path auth actor ingress.
 *
 * Protected surfaces must resolve actorUserId through this module.
 */
import type { AfendaAuthSession } from "@afenda/auth";
import {
  parseAuthActorIdentityFromAfendaAuthSession,
  resolveWireActorUserIdFromAfendaAuthSession,
} from "@afenda/auth";

export { parseAuthActorIdentityFromAfendaAuthSession };

/** Governed wire actor user id for ERP protected surfaces. */
export function resolveProtectedPathActorUserIdFromSession(
  session: AfendaAuthSession
): string {
  return resolveWireActorUserIdFromAfendaAuthSession(session);
}
