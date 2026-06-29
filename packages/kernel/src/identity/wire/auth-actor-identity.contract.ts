import type { UserId } from "../families/identity-access-id.contract.js";
import {
  parseUserId,
  toUserId,
} from "../families/identity-access-id.contract.js";
import {
  type ActorKind,
  assertActorKind,
  parseOptionalActorKind,
} from "./actor-kind.contract.js";
import {
  type AuthSubjectId,
  parseAuthSubjectId,
  toAuthSubjectId,
} from "./auth-subject-id.contract.js";
import {
  type IntegrationIdentity,
  parseOptionalIntegrationIdentity,
  serializeIntegrationIdentity,
  type WireIntegrationIdentity,
} from "./integration-identity.contract.js";
import {
  type InternalEntityPk,
  parseInternalEntityPk,
  toInternalEntityPk,
} from "./internal-entity-pk.contract.js";

/** Wire JSON shape — plain strings for auth subject, platform PK, ERP actor ID, and E12 slots. */
export type WireAuthActorIdentity = {
  readonly actorKind?: string | null;
  readonly authSubjectId: string;
  readonly integrationIdentity?: WireIntegrationIdentity | null;
  readonly userPk?: string | null;
  readonly userId?: string | null;
};

/** Trusted auth actor bridge after wire ingress parsing (PAS-001 §4.1.11 · E12). */
export type AuthActorIdentity = {
  readonly actorKind?: ActorKind;
  readonly authSubjectId: AuthSubjectId;
  readonly integrationIdentity?: IntegrationIdentity;
  readonly userPk?: InternalEntityPk;
  readonly userId?: UserId;
};

function assertActorKindIntegrationConsistency(
  actorKind: ActorKind | undefined,
  integrationIdentity: IntegrationIdentity | undefined,
  userId: UserId | undefined
): void {
  if (actorKind === "human" && integrationIdentity !== undefined) {
    throw new Error(
      "AuthActorIdentity: human actorKind must not carry integrationIdentity."
    );
  }

  if (
    (actorKind === "service" || actorKind === "delegated_application") &&
    userId !== undefined
  ) {
    throw new Error(
      "AuthActorIdentity: service and delegated_application actorKind must not carry userId."
    );
  }
}

export function parseAuthActorIdentity(
  input: WireAuthActorIdentity
): AuthActorIdentity {
  const actorKind = parseOptionalActorKind(input.actorKind ?? undefined);
  const integrationIdentity = parseOptionalIntegrationIdentity(
    input.integrationIdentity ?? undefined
  );

  const identity: {
    actorKind?: ActorKind;
    authSubjectId: AuthSubjectId;
    integrationIdentity?: IntegrationIdentity;
    userPk?: InternalEntityPk;
    userId?: UserId;
  } = {
    authSubjectId: parseAuthSubjectId(input.authSubjectId),
  };

  if (actorKind !== undefined) {
    identity.actorKind = assertActorKind(actorKind);
  }

  if (integrationIdentity !== undefined) {
    identity.integrationIdentity = integrationIdentity;
  }

  if (input.userPk != null && input.userPk !== "") {
    identity.userPk = parseInternalEntityPk(input.userPk, "EntityPk");
  }

  if (input.userId != null && input.userId !== "") {
    identity.userId = parseUserId(input.userId);
  }

  assertActorKindIntegrationConsistency(
    identity.actorKind,
    identity.integrationIdentity,
    identity.userId
  );

  return identity;
}

export function serializeAuthActorIdentity(
  identity: AuthActorIdentity
): WireAuthActorIdentity {
  return {
    authSubjectId: toAuthSubjectId(identity.authSubjectId),
    ...(identity.actorKind !== undefined && {
      actorKind: identity.actorKind,
    }),
    ...(identity.integrationIdentity !== undefined && {
      integrationIdentity: serializeIntegrationIdentity(
        identity.integrationIdentity
      ),
    }),
    ...(identity.userPk !== undefined && {
      userPk: toInternalEntityPk(identity.userPk),
    }),
    ...(identity.userId !== undefined && {
      userId: toUserId(identity.userId),
    }),
  };
}
