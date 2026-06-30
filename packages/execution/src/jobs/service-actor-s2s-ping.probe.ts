import { createHmac } from "node:crypto";

import {
  createCorrelationId as createCanonicalCorrelationId,
  parseCorrelationId,
} from "@afenda/kernel";

import type { RunServiceActorS2sPingJobResult } from "./service-actor-s2s-ping.job.js";
import {
  SERVICE_ACTOR_REQUEST_HEADERS,
  SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS,
  SERVICE_ACTOR_S2S_TOKEN_PREFIX,
  type ServiceActorS2sProbeClaims,
} from "./service-actor-s2s-token.probe-contract.js";

const SERVICE_ACTOR_S2S_PING_PATH =
  "/api/internal/v1/auth/service-actor/ping" as const;

const DEFAULT_PROBE_SUBJECT = "trigger-service-actor-probe" as const;
const DEFAULT_PROBE_PROVIDER = "afenda-execution" as const;
const DEFAULT_PROBE_EXTERNAL_ID = "trigger-service-actor-probe" as const;
const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ" as const;

function generateProbeUlidBody(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(26));
  let body = "";

  for (const byte of bytes) {
    body += CROCKFORD_ALPHABET[byte % CROCKFORD_ALPHABET.length] ?? "0";
  }

  return body;
}

function mintProbeCorrelationId(): string {
  return createCanonicalCorrelationId({
    generateUlidBody: generateProbeUlidBody,
  });
}

function readS2sSigningSecret(env: NodeJS.ProcessEnv): string {
  const secret = env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"]?.trim() ?? "";
  if (secret.length < 32) {
    throw new Error(
      "AFENDA_INTERNAL_S2S_SIGNING_SECRET must be at least 32 characters."
    );
  }
  return secret;
}

function resolveErpBaseUrl(env: NodeJS.ProcessEnv): string {
  const baseUrl = env["BETTER_AUTH_URL"]?.trim();
  if (baseUrl === undefined || baseUrl.length === 0) {
    throw new Error(
      "BETTER_AUTH_URL is required to probe service-actor S2S ping."
    );
  }
  return baseUrl.replace(/\/$/, "");
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function issueServiceActorS2sProbeToken(
  claims: {
    readonly sub: string;
    readonly actorKind: "service" | "delegated_application";
    readonly provider: string;
    readonly externalId: string;
    readonly ttlMs?: number;
  },
  env: NodeJS.ProcessEnv
): string {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const ttlMs = claims.ttlMs ?? SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS;
  const expSeconds = nowSeconds + Math.floor(ttlMs / 1000);

  const payload: ServiceActorS2sProbeClaims = {
    sub: claims.sub,
    actorKind: claims.actorKind,
    provider: claims.provider,
    externalId: claims.externalId,
    iat: nowSeconds,
    exp: expSeconds,
  };

  const payloadSegment = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${SERVICE_ACTOR_S2S_TOKEN_PREFIX}.${payloadSegment}`;
  const signature = createHmac("sha256", readS2sSigningSecret(env))
    .update(signingInput)
    .digest("base64url");

  return `${signingInput}.${signature}`;
}

function isPingSuccessBody(body: unknown): body is {
  readonly data: { readonly status: "ok" };
  readonly ok: true;
} {
  return (
    typeof body === "object" &&
    body !== null &&
    "ok" in body &&
    body.ok === true &&
    "data" in body &&
    typeof body.data === "object" &&
    body.data !== null &&
    "status" in body.data &&
    body.data.status === "ok"
  );
}

/**
 * Worker-safe S2S ping probe (ADR-0036). Used by Trigger.dev and ops scripts.
 */
export async function runServiceActorS2sPingProbe(input?: {
  readonly baseUrl?: string;
  readonly correlationId?: string;
  readonly env?: NodeJS.ProcessEnv;
  readonly fetchImpl?: typeof fetch;
}): Promise<RunServiceActorS2sPingJobResult> {
  const env = input?.env ?? process.env;
  const fetchImpl = input?.fetchImpl ?? fetch;
  const baseUrl = input?.baseUrl ?? resolveErpBaseUrl(env);
  const correlationId =
    input?.correlationId === undefined
      ? mintProbeCorrelationId()
      : parseCorrelationId(input.correlationId);

  const token = issueServiceActorS2sProbeToken(
    {
      actorKind: "service",
      externalId: DEFAULT_PROBE_EXTERNAL_ID,
      provider: DEFAULT_PROBE_PROVIDER,
      sub: DEFAULT_PROBE_SUBJECT,
    },
    env
  );

  const response = await fetchImpl(`${baseUrl}${SERVICE_ACTOR_S2S_PING_PATH}`, {
    headers: {
      authorization: `Bearer ${token}`,
      "x-correlation-id": correlationId,
      [SERVICE_ACTOR_REQUEST_HEADERS.actorKind]: "service",
      [SERVICE_ACTOR_REQUEST_HEADERS.authSubjectId]: DEFAULT_PROBE_SUBJECT,
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationProvider]:
        DEFAULT_PROBE_PROVIDER,
      [SERVICE_ACTOR_REQUEST_HEADERS.integrationExternalId]:
        DEFAULT_PROBE_EXTERNAL_ID,
    },
    method: "GET",
  });

  if (!response.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      detail = "";
    }
    throw new Error(
      `Service-actor S2S ping failed with HTTP ${response.status}.${detail.length > 0 ? ` Body: ${detail.slice(0, 500)}` : ""}`
    );
  }

  const body: unknown = await response.json();
  if (!isPingSuccessBody(body)) {
    throw new Error("Service-actor S2S ping returned an unexpected envelope.");
  }

  return { correlationId, status: "ok" };
}
