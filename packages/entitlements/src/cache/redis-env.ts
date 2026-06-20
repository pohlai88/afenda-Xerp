import { Redis } from "@upstash/redis";

import type { EvaluationCache } from "./evaluation-cache.js";
import { createMemoryEvaluationCache } from "./evaluation-cache.js";
import {
  createUpstashEvaluationCache,
  type UpstashRedisClient,
} from "./upstash-evaluation-cache.js";

export class MissingUpstashRedisConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingUpstashRedisConfigError";
  }
}

export interface UpstashRedisConfig {
  readonly token: string;
  readonly url: string;
}

const UPSTASH_REDIS_REST_URL = "UPSTASH_REDIS_REST_URL";
const UPSTASH_REDIS_REST_TOKEN = "UPSTASH_REDIS_REST_TOKEN";

export function getUpstashRedisConfig(
  env: NodeJS.ProcessEnv = process.env
): UpstashRedisConfig | null {
  const url = env[UPSTASH_REDIS_REST_URL]?.trim();
  const token = env[UPSTASH_REDIS_REST_TOKEN]?.trim();

  if (!(url && token)) {
    return null;
  }

  return { url, token };
}

export function hasUpstashRedisConfig(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return getUpstashRedisConfig(env) !== null;
}

/** Returns true when Upstash REST accepts a PING (used by live tests and env doctor). */
export async function probeUpstashRedisConnectivity(
  env: NodeJS.ProcessEnv = process.env
): Promise<boolean> {
  const config = getUpstashRedisConfig(env);

  if (!config) {
    return false;
  }

  try {
    const redis = new Redis({
      url: config.url,
      token: config.token,
    });
    const response = await redis.ping();

    return response === "PONG";
  } catch {
    return false;
  }
}

export interface CreateEvaluationCacheFromEnvOptions {
  readonly env?: NodeJS.ProcessEnv;
  readonly now?: () => number;
  readonly redis?: UpstashRedisClient;
  readonly ttlMs?: number;
}

/** Uses Upstash Redis when configured; otherwise falls back to in-memory TTL cache. */
export function createEvaluationCacheFromEnv(
  options: CreateEvaluationCacheFromEnvOptions = {}
): EvaluationCache {
  const env = options.env ?? process.env;
  const config = getUpstashRedisConfig(env);

  if (config) {
    const redis =
      options.redis ??
      new Redis({
        url: config.url,
        token: config.token,
      });

    return createUpstashEvaluationCache({
      redis,
      ...(options.now !== undefined ? { now: options.now } : {}),
    });
  }

  return createMemoryEvaluationCache({
    ...(options.ttlMs !== undefined ? { ttlMs: options.ttlMs } : {}),
    ...(options.now !== undefined ? { now: options.now } : {}),
  });
}

export function createUpstashEvaluationCacheFromEnv(
  env: NodeJS.ProcessEnv = process.env
): EvaluationCache {
  const config = getUpstashRedisConfig(env);

  if (!config) {
    throw new MissingUpstashRedisConfigError(
      `${UPSTASH_REDIS_REST_URL} and ${UPSTASH_REDIS_REST_TOKEN} are required.`
    );
  }

  return createUpstashEvaluationCache({
    redis: new Redis({
      url: config.url,
      token: config.token,
    }),
  });
}
