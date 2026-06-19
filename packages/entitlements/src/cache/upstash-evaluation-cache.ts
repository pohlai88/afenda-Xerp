import type {
  EvaluationCache,
  EvaluationCacheEntry,
} from "./evaluation-cache.js";

const CACHE_PREFIX = "entitlement:eval";
const TENANT_INDEX_PREFIX = "entitlement:eval:tenant";

export interface UpstashRedisClient {
  del(...keys: string[]): Promise<number>;
  /** Generic to match the real @upstash/redis Redis.get<TData> signature. */
  get<TData = unknown>(key: string): Promise<TData | null>;
  sadd(key: string, member: string): Promise<number>;
  set(key: string, value: unknown, options: { ex: number }): Promise<unknown>;
  smembers(key: string): Promise<string[]>;
}

export interface CreateUpstashEvaluationCacheOptions {
  readonly keyPrefix?: string;
  readonly now?: () => number;
  readonly redis: UpstashRedisClient;
}

function buildCacheKey(prefix: string, key: string): string {
  return `${prefix}:${key}`;
}

function buildTenantIndexKey(tenantId: string): string {
  return `${TENANT_INDEX_PREFIX}:${tenantId}`;
}

function parseCacheEntry(value: unknown): EvaluationCacheEntry | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("decision" in value) ||
    !("expiresAt" in value)
  ) {
    return null;
  }

  const record = value as EvaluationCacheEntry;

  if (typeof record.expiresAt !== "number") {
    return null;
  }

  return record;
}

/** Upstash Redis-backed TTL cache for cross-instance entitlement evaluation. */
export function createUpstashEvaluationCache(
  options: CreateUpstashEvaluationCacheOptions
): EvaluationCache {
  const prefix = options.keyPrefix ?? CACHE_PREFIX;
  const now = options.now ?? (() => Date.now());
  const redis = options.redis;

  return {
    async get(key) {
      const raw = await redis.get(buildCacheKey(prefix, key));
      const entry = parseCacheEntry(raw);

      if (!entry) {
        return null;
      }

      if (entry.expiresAt <= now()) {
        await redis.del(buildCacheKey(prefix, key));
        return null;
      }

      return entry;
    },
    async set(key, entry, ttlMs) {
      const ttlSeconds = Math.max(1, Math.ceil(ttlMs / 1000));
      const cacheKey = buildCacheKey(prefix, key);
      const tenantId = key.split(":")[0];

      await redis.set(cacheKey, entry, { ex: ttlSeconds });

      if (tenantId) {
        await redis.sadd(buildTenantIndexKey(tenantId), cacheKey);
      }
    },
    async delete(key) {
      await redis.del(buildCacheKey(prefix, key));
    },
    async invalidateTenant(tenantId) {
      const indexKey = buildTenantIndexKey(tenantId);
      const members = await redis.smembers(indexKey);

      if (members.length === 0) {
        return;
      }

      await redis.del(...members, indexKey);
    },
  };
}
