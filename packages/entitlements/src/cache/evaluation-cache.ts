import type { EntitlementDecisionContract } from "../contracts/entitlement-decision.contract";
import type { EvaluateCapabilityInput } from "../evaluation/capability-evaluation";

export interface EvaluationCacheEntry {
  readonly decision: EntitlementDecisionContract;
  readonly expiresAt: number;
}

export interface EvaluationCacheKeyInput {
  readonly capabilityKey: string;
  readonly companyId: string;
  readonly tenantId: string;
}

export interface EvaluationCache {
  readonly delete: (key: string) => void;
  readonly get: (key: string) => EvaluationCacheEntry | null;
  readonly invalidateTenant: (tenantId: string) => void;
  readonly set: (key: string, entry: EvaluationCacheEntry) => void;
}

export interface CreateMemoryEvaluationCacheOptions {
  readonly now?: () => number;
  readonly ttlMs?: number;
}

const DEFAULT_TTL_MS = 60_000;

export function buildEvaluationCacheKey(
  input: EvaluationCacheKeyInput
): string {
  return `${input.tenantId}:${input.companyId}:${input.capabilityKey}`;
}

/** Process-local TTL cache for entitlement evaluation decisions. */
export function createMemoryEvaluationCache(
  options: CreateMemoryEvaluationCacheOptions = {}
): EvaluationCache {
  const now = options.now ?? (() => Date.now());
  const store = new Map<string, EvaluationCacheEntry>();
  const tenantIndex = new Map<string, Set<string>>();

  function trackTenantKey(tenantId: string, key: string): void {
    const keys = tenantIndex.get(tenantId) ?? new Set<string>();
    keys.add(key);
    tenantIndex.set(tenantId, keys);
  }

  function isExpired(entry: EvaluationCacheEntry, currentTime: number): boolean {
    return entry.expiresAt <= currentTime;
  }

  return {
    get(key) {
      const entry = store.get(key);

      if (!entry) {
        return null;
      }

      const currentTime = now();

      if (isExpired(entry, currentTime)) {
        store.delete(key);
        return null;
      }

      return entry;
    },
    set(key, entry) {
      store.set(key, entry);

      const tenantId = key.split(":")[0];

      if (tenantId) {
        trackTenantKey(tenantId, key);
      }
    },
    delete(key) {
      store.delete(key);
    },
    invalidateTenant(tenantId) {
      const keys = tenantIndex.get(tenantId);

      if (!keys) {
        return;
      }

      for (const key of keys) {
        store.delete(key);
      }

      tenantIndex.delete(tenantId);
    },
  };
}

export interface CachedEvaluateCapabilityOptions {
  readonly cache: EvaluationCache;
  readonly now?: () => number;
  readonly ttlMs?: number;
}

export function createCachedCapabilityEvaluator(
  evaluate: (input: EvaluateCapabilityInput) => EntitlementDecisionContract,
  options: CachedEvaluateCapabilityOptions
) {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const now = options.now ?? (() => Date.now());

  return (input: EvaluateCapabilityInput): EntitlementDecisionContract => {
    const cacheKey = buildEvaluationCacheKey({
      tenantId: input.context.tenantId,
      companyId: input.context.companyId,
      capabilityKey: input.capabilityKey,
    });

    const cached = options.cache.get(cacheKey);

    if (cached) {
      return cached.decision;
    }

    const decision = evaluate(input);

    options.cache.set(cacheKey, {
      decision,
      expiresAt: now() + ttlMs,
    });

    return decision;
  };
}
