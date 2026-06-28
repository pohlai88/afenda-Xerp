import {
  findPlatformUserIdByAuthUserId,
  findUserEnterpriseIdByPlatformUserId,
} from "@afenda/database";

import type { AuthEventContext } from "./auth.contract.js";

const PLATFORM_USER_CACHE_MAX = 256;

const platformUserCache = new Map<string, string | null>();
const enterpriseUserCache = new Map<string, string | null>();

export function clearPlatformUserIdCacheForTests(): void {
  platformUserCache.clear();
  enterpriseUserCache.clear();
}

function rememberPlatformUserId(
  authUserId: string,
  platformUserId: string | null
): void {
  if (platformUserCache.size >= PLATFORM_USER_CACHE_MAX) {
    const oldestKey = platformUserCache.keys().next().value;

    if (oldestKey) {
      platformUserCache.delete(oldestKey);
    }
  }

  platformUserCache.set(authUserId, platformUserId);
}

/** Resolves canonical platform `users.id` (ARCH-AUTH-001) from context, cache, or identity link. */
export async function resolvePlatformActorUserId(
  context?: AuthEventContext
): Promise<string | null> {
  const authUserId = context?.authUserId;

  if (!authUserId) {
    return context?.platformUserId ?? null;
  }

  if (context.platformUserId) {
    rememberPlatformUserId(authUserId, context.platformUserId);
    return context.platformUserId;
  }

  const cached = platformUserCache.get(authUserId);

  if (cached !== undefined) {
    return cached;
  }

  const platformUserId = await findPlatformUserIdByAuthUserId(authUserId);
  rememberPlatformUserId(authUserId, platformUserId);

  return platformUserId;
}

function rememberEnterpriseUserId(
  platformUserId: string,
  enterpriseUserId: string | null
): void {
  if (enterpriseUserCache.size >= PLATFORM_USER_CACHE_MAX) {
    const oldestKey = enterpriseUserCache.keys().next().value;

    if (oldestKey) {
      enterpriseUserCache.delete(oldestKey);
    }
  }

  enterpriseUserCache.set(platformUserId, enterpriseUserId);
}

/** Resolves governed `users.enterprise_id` from platform `users.id` (ARCH-AUTH-001). */
export async function resolveEnterpriseUserIdFromPlatformUserId(
  platformUserId: string | null
): Promise<string | null> {
  if (platformUserId === null) {
    return null;
  }

  const trimmed = platformUserId.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const cached = enterpriseUserCache.get(trimmed);

  if (cached !== undefined) {
    return cached;
  }

  const enterpriseUserId = await findUserEnterpriseIdByPlatformUserId(trimmed);
  rememberEnterpriseUserId(trimmed, enterpriseUserId);

  return enterpriseUserId;
}
