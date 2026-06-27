import type { UserId } from "../families/identity-access-id.contract.js";
import {
  parseUserId,
  toUserId,
} from "../families/identity-access-id.contract.js";
import {
  type AuthSubjectId,
  parseAuthSubjectId,
  toAuthSubjectId,
} from "./auth-subject-id.contract.js";
import {
  type InternalEntityPk,
  parseInternalEntityPk,
  toInternalEntityPk,
} from "./internal-entity-pk.contract.js";

/** Wire JSON shape — plain strings for auth subject, platform PK, and ERP actor ID fields. */
export type WireAuthActorIdentity = {
  readonly authSubjectId: string;
  readonly userPk?: string | null;
  readonly userId?: string | null;
};

/** Trusted auth actor bridge after wire ingress parsing (PAS-001 §4.1.11). */
export type AuthActorIdentity = {
  readonly authSubjectId: AuthSubjectId;
  readonly userPk?: InternalEntityPk;
  readonly userId?: UserId;
};

export function parseAuthActorIdentity(
  input: WireAuthActorIdentity
): AuthActorIdentity {
  const identity: {
    authSubjectId: AuthSubjectId;
    userPk?: InternalEntityPk;
    userId?: UserId;
  } = {
    authSubjectId: parseAuthSubjectId(input.authSubjectId),
  };

  if (input.userPk != null && input.userPk !== "") {
    identity.userPk = parseInternalEntityPk(input.userPk, "EntityPk");
  }

  if (input.userId != null && input.userId !== "") {
    identity.userId = parseUserId(input.userId);
  }

  return identity;
}

export function serializeAuthActorIdentity(
  identity: AuthActorIdentity
): WireAuthActorIdentity {
  return {
    authSubjectId: toAuthSubjectId(identity.authSubjectId),
    ...(identity.userPk !== undefined && {
      userPk: toInternalEntityPk(identity.userPk),
    }),
    ...(identity.userId !== undefined && {
      userId: toUserId(identity.userId),
    }),
  };
}
