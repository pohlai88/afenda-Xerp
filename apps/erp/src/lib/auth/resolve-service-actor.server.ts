/**
 * PAS-001A R2 — service / delegated_application S2S actor ingress (E12 · B113 vocabulary).
 *
 * Production stance (ADR-0035): service identity requires verified bearer token
 * whose claims match `x-afenda-actor-*` headers. Shape-only headers are rejected.
 */

import {
  type AuthActorIdentity,
  parseAuthActorIdentity,
  type WireAuthActorIdentity,
} from "@afenda/kernel";

import { verifyServiceActorS2sBearerToken } from "./verify-service-actor-s2s-token.server";

export const SERVICE_ACTOR_REQUEST_HEADERS = {
  actorKind: "x-afenda-actor-kind",
  authSubjectId: "x-afenda-auth-subject-id",
  integrationProvider: "x-afenda-integration-provider",
  integrationExternalId: "x-afenda-integration-external-id",
} as const;

const SERVICE_ACTOR_KINDS = new Set(["service", "delegated_application"]);

export function hasServiceActorIngressHeaders(headers: Headers): boolean {
  const actorKind = headers
    .get(SERVICE_ACTOR_REQUEST_HEADERS.actorKind)
    ?.trim()
    .toLowerCase();

  return actorKind !== undefined && SERVICE_ACTOR_KINDS.has(actorKind);
}

function readRequiredHeader(headers: Headers, name: string): string {
  const value = headers.get(name)?.trim() ?? "";
  if (value.length === 0) {
    throw new Error(`${name} is required for service actor ingress.`);
  }
  return value;
}

function buildServiceActorWireFromHeaders(
  headers: Headers
): WireAuthActorIdentity {
  const actorKind = readRequiredHeader(
    headers,
    SERVICE_ACTOR_REQUEST_HEADERS.actorKind
  ).toLowerCase();
  const authSubjectId = readRequiredHeader(
    headers,
    SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId
  );
  const provider = readRequiredHeader(
    headers,
    SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider
  );
  const externalId = readRequiredHeader(
    headers,
    SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId
  );

  return {
    actorKind,
    authSubjectId,
    integrationIdentity: { provider, externalId },
  };
}

function bearerClaimsMatchHeaders(
  headers: Headers,
  authorizationHeader: string | null
): boolean {
  const claims = verifyServiceActorS2sBearerToken(authorizationHeader);
  if (claims === null) {
    return false;
  }

  const actorKind = readRequiredHeader(
    headers,
    SERVICE_ACTOR_REQUEST_HEADERS.actorKind
  ).toLowerCase();
  const authSubjectId = readRequiredHeader(
    headers,
    SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId
  );
  const provider = readRequiredHeader(
    headers,
    SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider
  );
  const externalId = readRequiredHeader(
    headers,
    SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId
  );

  return (
    claims.sub === authSubjectId &&
    claims.actorKind === actorKind &&
    claims.provider === provider &&
    claims.externalId === externalId
  );
}

/**
 * Returns parsed service/delegated_application identity when bearer verification
 * succeeds and token claims match ingress headers; otherwise null.
 */
export function parseServiceActorIdentityFromRequestHeaders(
  headers: Headers
): AuthActorIdentity | null {
  if (!hasServiceActorIngressHeaders(headers)) {
    return null;
  }

  const authorization = headers.get("authorization");
  if (!bearerClaimsMatchHeaders(headers, authorization)) {
    return null;
  }

  return parseAuthActorIdentity(buildServiceActorWireFromHeaders(headers));
}
