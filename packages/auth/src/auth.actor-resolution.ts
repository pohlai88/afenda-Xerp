import { findPlatformUserIdByAuthUserId } from "@afenda/database";

import type { AuthEventContext } from "./auth.contract.js";

const PLATFORM_USER_CACHE_MAX = 256;

const platformUserCache = new Map<string, string | null>();

export function clearPlatformUserIdCacheForTests(): void {
  platformUserCache.clear();
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

/** Resolves platform `users.id` from hook context, cache, or identity-link lookup. */
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
