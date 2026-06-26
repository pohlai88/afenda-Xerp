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

    return { allowed: true, retryAfterSeconds: null };
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

    return { allowed: true, retryAfterSeconds: null };
  }

  if (existing.requestCount >= input.config.maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: resolveRetryAfterSeconds(
        existing.windowStart,
        existing.windowSeconds,
        now
      ),
    };
  }

  await db
    .update(apiRateLimitBuckets)
    .set({
      requestCount: existing.requestCount + 1,
    })
    .where(eq(apiRateLimitBuckets.id, existing.id));

  return { allowed: true, retryAfterSeconds: null };
}
