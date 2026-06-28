/**
 * PAS-001 §4.1.11 — Better Auth actor wire ingress at @afenda/auth boundaries.
 *
 * Maps governed `AfendaAuthSession` into kernel `WireAuthActorIdentity` and parses
 * through `parseAuthActorIdentity` — never conflate login subject with ERP actor id.
 */
import {
  type AuthActorIdentity,
  isUuidV7WireForm,
  parseAuthActorIdentity,
  parseOptionalUserId,
  toInternalEntityPk,
  toUserId,
  type UserId,
  type WireAuthActorIdentity,
} from "@afenda/kernel";

import type { AfendaAuthSession } from "./auth.contract.js";

export function toWireAuthActorIdentityFromAfendaAuthSession(
  session: AfendaAuthSession
): WireAuthActorIdentity {
  const wire: WireAuthActorIdentity = {
    authSubjectId: session.user.authUserId,
  };

  const platformRef = session.user.userId?.trim() ?? "";
  const enterpriseRef = session.user.enterpriseUserId?.trim() ?? "";

  let wireWithEnterprise: WireAuthActorIdentity = wire;

  if (enterpriseRef.length > 0) {
    const enterpriseUserId = parseOptionalUserId(enterpriseRef);

    if (enterpriseUserId !== null) {
      wireWithEnterprise = {
        ...wire,
        userId: toUserId(enterpriseUserId),
      };
    }
  }

  if (platformRef.length > 0) {
    if (isUuidV7WireForm(platformRef)) {
      return {
        ...wireWithEnterprise,
        userPk: platformRef,
      };
    }

    if (wireWithEnterprise.userId === undefined) {
      const enterpriseUserId = parseOptionalUserId(platformRef);

      if (enterpriseUserId !== null) {
        return {
          ...wire,
          userId: toUserId(enterpriseUserId),
        };
      }
    }

    return wireWithEnterprise;
  }

  return wireWithEnterprise;
}

export function parseAuthActorIdentityFromAfendaAuthSession(
  session: AfendaAuthSession
): AuthActorIdentity {
  return parseAuthActorIdentity(
    toWireAuthActorIdentityFromAfendaAuthSession(session)
  );
}

/** ERP actor wire id for metadata and operating-context ingress (enterprise id preferred). */
export function resolveWireActorUserIdFromAfendaAuthSession(
  session: AfendaAuthSession
): string {
  const identity = parseAuthActorIdentityFromAfendaAuthSession(session);

  if (identity.userId !== undefined) {
    return toUserId(identity.userId);
  }

  if (identity.userPk !== undefined) {
    return toInternalEntityPk(identity.userPk);
  }

  throw new Error(
    "Linked Afenda auth session must resolve to userId or userPk at wire ingress."
  );
}

export function resolveEnterpriseUserIdFromAfendaAuthSession(
  session: AfendaAuthSession
): UserId | null {
  const identity = parseAuthActorIdentityFromAfendaAuthSession(session);
  return identity.userId ?? null;
}
