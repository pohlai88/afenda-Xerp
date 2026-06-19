import { describe, expect, it, vi } from "vitest";
import type { EvaluationCacheEntry } from "../cache/evaluation-cache";
import {
  createUpstashEvaluationCache,
  type UpstashRedisClient,
} from "../cache/upstash-evaluation-cache";

describe("createUpstashEvaluationCache", () => {
  it("stores and retrieves entries with tenant index tracking", async () => {
    const store = new Map<string, EvaluationCacheEntry>();
    const tenantIndexes = new Map<string, Set<string>>();

    const redis = {
      get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
      set: vi.fn(
        (
          key: string,
          value: EvaluationCacheEntry,
          _options?: { ex?: number }
        ) => {
          store.set(key, value);
          return Promise.resolve();
        }
      ),
      del: vi.fn((...keys: string[]) => {
        let deletedCount = 0;
        for (const key of keys) {
          if (store.delete(key) || tenantIndexes.delete(key)) {
            deletedCount += 1;
          }
        }
        return Promise.resolve(deletedCount);
      }),
      sadd: vi.fn((indexKey: string, member: string) => {
        const members = tenantIndexes.get(indexKey) ?? new Set<string>();
        members.add(member);
        tenantIndexes.set(indexKey, members);
        return Promise.resolve(1);
      }),
      smembers: vi.fn((indexKey: string) =>
        Promise.resolve([...(tenantIndexes.get(indexKey) ?? [])])
      ),
    };

    const cache = createUpstashEvaluationCache({
      redis: redis as unknown as UpstashRedisClient,
      now: () => 1000,
    });
    const entry: EvaluationCacheEntry = {
      decision: {
        result: "allow",
        capabilityKey: "accounting",
        reason: "Capability is available.",
        audit: null,
      },
      expiresAt: 5000,
    };

    await cache.set("tenant_a:company_a:accounting", entry, 4000);

    expect(await cache.get("tenant_a:company_a:accounting")).toEqual(entry);
    expect(redis.sadd).toHaveBeenCalledWith(
      "entitlement:eval:tenant:tenant_a",
      "entitlement:eval:tenant_a:company_a:accounting"
    );
  });

  it("invalidates all keys tracked for a tenant", async () => {
    const store = new Map<string, EvaluationCacheEntry>();
    const tenantIndexes = new Map<string, Set<string>>();

    const redis = {
      get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
      set: vi.fn((key: string, value: EvaluationCacheEntry) => {
        store.set(key, value);
        return Promise.resolve(1);
      }),
      del: vi.fn((...keys: string[]) => {
        let deletedCount = 0;
        for (const key of keys) {
          if (store.delete(key) || tenantIndexes.delete(key)) {
            deletedCount += 1;
          }
        }
        return Promise.resolve(deletedCount);
      }),
      sadd: vi.fn((indexKey: string, member: string) => {
        const members = tenantIndexes.get(indexKey) ?? new Set<string>();
        members.add(member);
        tenantIndexes.set(indexKey, members);
        return Promise.resolve(1);
      }),
      smembers: vi.fn((indexKey: string) =>
        Promise.resolve([...(tenantIndexes.get(indexKey) ?? [])])
      ),
    };

    const cache = createUpstashEvaluationCache({
      redis: redis as unknown as UpstashRedisClient,
      now: () => 1000,
    });
    const entry: EvaluationCacheEntry = {
      decision: {
        result: "allow",
        capabilityKey: "accounting",
        reason: "Capability is available.",
        audit: null,
      },
      expiresAt: 5000,
    };

    const cacheKey = "entitlement:eval:tenant_a:company_a:accounting";
    store.set(cacheKey, entry);
    tenantIndexes.set("entitlement:eval:tenant:tenant_a", new Set([cacheKey]));

    await cache.invalidateTenant("tenant_a");

    expect(store.has(cacheKey)).toBe(false);
    expect(tenantIndexes.has("entitlement:eval:tenant:tenant_a")).toBe(false);
  });
});
