import { randomUUID } from "node:crypto";

import { getUpstashRedisConfig } from "@afenda/entitlements";

import type { SignInTwoFactorChallenge } from "./is-sign-in-two-factor-redirect";

const MFA_CHALLENGE_REDIS_PREFIX = "afenda:mfa-challenge:" as const;
const MFA_CHALLENGE_REDIS_REFERENCE_PREFIX = "redis:" as const;

export type MfaChallengeStorePayload = {
  readonly challenge: SignInTwoFactorChallenge;
  readonly exp: number;
  readonly nextPath: string;
};

type UpstashRedisClient = {
  del: (...keys: string[]) => Promise<unknown>;
  get: <TData>(key: string) => Promise<TData | null>;
  set: (
    key: string,
    value: MfaChallengeStorePayload,
    options: { ex: number }
  ) => Promise<unknown>;
};

function buildRedisKey(challengeId: string): string {
  return `${MFA_CHALLENGE_REDIS_PREFIX}${challengeId}`;
}

async function createRedisClient(): Promise<UpstashRedisClient | null> {
  const config = getUpstashRedisConfig();

  if (!config) {
    return null;
  }

  const { Redis } = await import("@upstash/redis");

  return new Redis({
    url: config.url,
    token: config.token,
  });
}

export function encodeMfaChallengeStoreReference(challengeId: string): string {
  return `${MFA_CHALLENGE_REDIS_REFERENCE_PREFIX}${challengeId}`;
}

export function readMfaChallengeStoreReference(value: string): string | null {
  if (!value.startsWith(MFA_CHALLENGE_REDIS_REFERENCE_PREFIX)) {
    return null;
  }

  const challengeId = value.slice(MFA_CHALLENGE_REDIS_REFERENCE_PREFIX.length);

  return challengeId.length > 0 ? challengeId : null;
}

export async function persistMfaChallengeStorePayload(
  payload: MfaChallengeStorePayload
): Promise<string> {
  const redis = await createRedisClient();

  if (!redis) {
    return JSON.stringify(payload);
  }

  const challengeId = randomUUID();
  const ttlSeconds = Math.max(1, Math.ceil((payload.exp - Date.now()) / 1000));

  await redis.set(buildRedisKey(challengeId), payload, { ex: ttlSeconds });

  return encodeMfaChallengeStoreReference(challengeId);
}

export async function readMfaChallengeStorePayload(
  storedValue: string
): Promise<MfaChallengeStorePayload | null> {
  const challengeId = readMfaChallengeStoreReference(storedValue);

  if (challengeId === null) {
    try {
      const parsed = JSON.parse(storedValue) as MfaChallengeStorePayload;

      if (
        typeof parsed.exp !== "number" ||
        typeof parsed.nextPath !== "string" ||
        !parsed.challenge ||
        !Array.isArray(parsed.challenge.methods)
      ) {
        return null;
      }

      if (parsed.exp < Date.now()) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  const redis = await createRedisClient();

  if (!redis) {
    return null;
  }

  const payload = await redis.get<MfaChallengeStorePayload>(
    buildRedisKey(challengeId)
  );

  if (
    payload === null ||
    typeof payload.exp !== "number" ||
    payload.exp < Date.now()
  ) {
    return null;
  }

  return payload;
}

export async function clearMfaChallengeStorePayload(
  storedValue: string
): Promise<void> {
  const challengeId = readMfaChallengeStoreReference(storedValue);
  const redis = await createRedisClient();

  if (challengeId === null || !redis) {
    return;
  }

  await redis.del(buildRedisKey(challengeId));
}
