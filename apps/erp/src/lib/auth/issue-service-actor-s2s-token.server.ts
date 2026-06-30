import { createHmac } from "node:crypto";

import { getS2sSigningSecret } from "@/lib/env/s2s-env";

import {
  SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS,
  SERVICE_ACTOR_S2S_TOKEN_PREFIX,
  type ServiceActorS2sTokenPayload,
  serviceActorS2sTokenPayloadSchema,
} from "./service-actor-s2s-token.contract";

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

export type IssueServiceActorS2sTokenInput = {
  readonly sub: string;
  readonly actorKind: "service" | "delegated_application";
  readonly provider: string;
  readonly externalId: string;
  readonly ttlMs?: number;
};

/**
 * Issues a signed S2S bearer token. Intended for tests and trusted internal issuers only.
 */
export function issueServiceActorS2sToken(
  claims: IssueServiceActorS2sTokenInput,
  env: NodeJS.ProcessEnv = process.env
): string {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const ttlMs = claims.ttlMs ?? SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS;
  const expSeconds = nowSeconds + Math.floor(ttlMs / 1000);

  const payload: ServiceActorS2sTokenPayload =
    serviceActorS2sTokenPayloadSchema.parse({
      sub: claims.sub,
      actorKind: claims.actorKind,
      provider: claims.provider,
      externalId: claims.externalId,
      iat: nowSeconds,
      exp: expSeconds,
    });

  const payloadSegment = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${SERVICE_ACTOR_S2S_TOKEN_PREFIX}.${payloadSegment}`;
  const signature = createHmac("sha256", getS2sSigningSecret(env))
    .update(signingInput)
    .digest("base64url");

  return `${signingInput}.${signature}`;
}
