/**
 * PAS-001 §4.1.11 — canonical ERP protected-path auth actor ingress.
 *
 * All operating-context, metadata, and audit spine entries on protected surfaces
 * must resolve `actorUserId` through this module (never raw session user fields).
 */
import type { AfendaAuthSession } from "@afenda/auth";
import {
  parseAuthActorIdentityFromAfendaAuthSession,
  resolveWireActorUserIdFromAfendaAuthSession,
} from "@afenda/auth";

export { parseAuthActorIdentityFromAfendaAuthSession };

/** Governed wire actor user id for ERP protected surfaces (layout, API, actions, metadata). */
export function resolveProtectedPathActorUserIdFromSession(
  session: AfendaAuthSession
): string {
  return resolveWireActorUserIdFromAfendaAuthSession(session);
}
