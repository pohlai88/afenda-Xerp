import { createHmac, timingSafeEqual } from "node:crypto";

import { getS2sSigningSecret } from "@/lib/env/s2s-env";

import {
  SERVICE_ACTOR_S2S_TOKEN_CLOCK_SKEW_MS,
  SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS,
  SERVICE_ACTOR_S2S_TOKEN_PREFIX,
  serviceActorS2sTokenPayloadSchema,
  type VerifiedServiceActorClaims,
} from "./service-actor-s2s-token.contract";

const BEARER_PREFIX = "Bearer ";

function base64UrlDecode(segment: string): string | null {
  try {
    return Buffer.from(segment, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function parseBearerToken(authorizationHeader: string | null): string | null {
  if (authorizationHeader === null) {
    return null;
  }

  const trimmed = authorizationHeader.trim();
  if (!trimmed.startsWith(BEARER_PREFIX)) {
    return null;
  }

  const token = trimmed.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

function verifySignature(
  signingInput: string,
  signatureSegment: string,
  secret: string
): boolean {
  const expected = createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64url");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(signatureSegment, "utf8");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

function isPayloadWithinLifetime(
  payload: VerifiedServiceActorClaims,
  nowMs: number
): boolean {
  const nowSeconds = Math.floor(nowMs / 1000);
  const skewSeconds = Math.ceil(SERVICE_ACTOR_S2S_TOKEN_CLOCK_SKEW_MS / 1000);
  const maxTtlSeconds = Math.floor(SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS / 1000);

  if (payload.iat > nowSeconds + skewSeconds) {
    return false;
  }

  if (payload.exp < nowSeconds - skewSeconds) {
    return false;
  }

  if (payload.exp - payload.iat > maxTtlSeconds + skewSeconds) {
    return false;
  }

  return true;
}

/**
 * Verifies `Authorization: Bearer <afenda-s2s-v1 token>` and returns claims or null.
 */
export function verifyServiceActorS2sBearerToken(
  authorizationHeader: string | null,
  env: NodeJS.ProcessEnv = process.env,
  nowMs: number = Date.now()
): VerifiedServiceActorClaims | null {
  const rawToken = parseBearerToken(authorizationHeader);
  if (rawToken === null) {
    return null;
  }

  const segments = rawToken.split(".");
  if (segments.length !== 3) {
    return null;
  }

  const [prefix, payloadSegment, signatureSegment] = segments;
  if (
    prefix !== SERVICE_ACTOR_S2S_TOKEN_PREFIX ||
    payloadSegment === undefined ||
    signatureSegment === undefined ||
    payloadSegment.length === 0 ||
    signatureSegment.length === 0
  ) {
    return null;
  }

  let secret: string;
  try {
    secret = getS2sSigningSecret(env);
  } catch {
    return null;
  }

  const signingInput = `${prefix}.${payloadSegment}`;
  if (!verifySignature(signingInput, signatureSegment, secret)) {
    return null;
  }

  const payloadJson = base64UrlDecode(payloadSegment);
  if (payloadJson === null) {
    return null;
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(payloadJson) as unknown;
  } catch {
    return null;
  }

  const payloadResult =
    serviceActorS2sTokenPayloadSchema.safeParse(parsedPayload);
  if (!payloadResult.success) {
    return null;
  }

  const claims: VerifiedServiceActorClaims = payloadResult.data;

  if (!isPayloadWithinLifetime(claims, nowMs)) {
    return null;
  }

  return claims;
}
