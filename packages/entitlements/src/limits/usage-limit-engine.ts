import type {
  UsageLimitContract,
  UsageLimitKey,
} from "../contracts/usage-limit.contract";

export interface UsageLimitResolution {
  readonly allowed: boolean;
  readonly key: UsageLimitKey;
  readonly limit: UsageLimitContract | null;
  readonly maximum: number;
  readonly used: number;
}

export function limit(
  key: UsageLimitKey,
  limits: readonly UsageLimitContract[]
): UsageLimitResolution {
  return resolveUsageLimit(key, limits);
}

export function resolveUsageLimit(
  key: UsageLimitKey,
  limits: readonly UsageLimitContract[]
): UsageLimitResolution {
  const matchingLimit = limits.find((item) => item.key === key) ?? null;

  if (!matchingLimit) {
    return {
      key,
      allowed: true,
      used: 0,
      maximum: Number.POSITIVE_INFINITY,
      limit: null,
    };
  }

  return {
    key,
    allowed: matchingLimit.used < matchingLimit.maximum,
    used: matchingLimit.used,
    maximum: matchingLimit.maximum,
    limit: matchingLimit,
  };
}
