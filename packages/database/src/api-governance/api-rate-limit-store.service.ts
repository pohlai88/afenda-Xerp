import { eq } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { apiRateLimitBuckets } from "../schema/api-governance.schema.js";

export interface ApiRateLimitWindowConfig {
  readonly maxRequests: number;
  readonly windowSeconds: number;
}

export interface ConsumeApiRateLimitInput {
  readonly bucketKey: string;
  readonly config: ApiRateLimitWindowConfig;
}

export interface ConsumeApiRateLimitResult {
  readonly allowed: boolean;
  readonly limit: number;
  readonly remaining: number;
  readonly resetAtUnix: number;
  readonly retryAfterSeconds: number | null;
}

function resolveRetryAfterSeconds(
  windowStart: Date,
  windowSeconds: number,
  now: Date
): number {
  const windowEndMs = windowStart.getTime() + windowSeconds * 1000;
  return Math.max(1, Math.ceil((windowEndMs - now.getTime()) / 1000));
}

function resolveResetAtUnix(windowStart: Date, windowSeconds: number): number {
  return Math.ceil((windowStart.getTime() + windowSeconds * 1000) / 1000);
}

function buildAllowedResult(input: {
  readonly config: ApiRateLimitWindowConfig;
  readonly requestCount: number;
  readonly windowStart: Date;
}): ConsumeApiRateLimitResult {
  return {
    allowed: true,
    limit: input.config.maxRequests,
    remaining: Math.max(0, input.config.maxRequests - input.requestCount),
    resetAtUnix: resolveResetAtUnix(
      input.windowStart,
      input.config.windowSeconds
    ),
    retryAfterSeconds: null,
  };
}

export async function consumeApiRateLimitBucket(
  input: ConsumeApiRateLimitInput,
  db: AfendaDatabase = getDb()
): Promise<ConsumeApiRateLimitResult> {
  const now = new Date();
  const [existing] = await db
    .select({
      id: apiRateLimitBuckets.id,
      requestCount: apiRateLimitBuckets.requestCount,
      windowSeconds: apiRateLimitBuckets.windowSeconds,
      windowStart: apiRateLimitBuckets.windowStart,
    })
    .from(apiRateLimitBuckets)
    .where(eq(apiRateLimitBuckets.bucketKey, input.bucketKey))
    .limit(1);

  if (!existing) {
    await db.insert(apiRateLimitBuckets).values({
      bucketKey: input.bucketKey,
      requestCount: 1,
      windowSeconds: input.config.windowSeconds,
      windowStart: now,
    });

    return buildAllowedResult({
      config: input.config,
      requestCount: 1,
      windowStart: now,
    });
  }

  const elapsedSeconds = Math.floor(
    (now.getTime() - existing.windowStart.getTime()) / 1000
  );

  if (elapsedSeconds >= existing.windowSeconds) {
    await db
      .update(apiRateLimitBuckets)
      .set({
        requestCount: 1,
        windowSeconds: input.config.windowSeconds,
        windowStart: now,
      })
      .where(eq(apiRateLimitBuckets.id, existing.id));

    return buildAllowedResult({
      config: input.config,
      requestCount: 1,
      windowStart: now,
    });
  }

  if (existing.requestCount >= input.config.maxRequests) {
    return {
      allowed: false,
      limit: input.config.maxRequests,
      remaining: 0,
      resetAtUnix: resolveResetAtUnix(
        existing.windowStart,
        existing.windowSeconds
      ),
      retryAfterSeconds: resolveRetryAfterSeconds(
        existing.windowStart,
        existing.windowSeconds,
        now
      ),
    };
  }

  const nextCount = existing.requestCount + 1;

  await db
    .update(apiRateLimitBuckets)
    .set({
      requestCount: nextCount,
    })
    .where(eq(apiRateLimitBuckets.id, existing.id));

  return buildAllowedResult({
    config: input.config,
    requestCount: nextCount,
    windowStart: existing.windowStart,
  });
}
