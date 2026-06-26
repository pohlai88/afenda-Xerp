const DEFAULT_SAFE_INTERNAL_PATH = "/" as const;

/**
 * Resolves a safe same-origin relative path for post-auth redirects.
 * Rejects open redirects (absolute URLs, protocol-relative paths, backslashes).
 */
export function resolveSafeInternalPath(
  candidate: string | null | undefined,
  fallback: string = DEFAULT_SAFE_INTERNAL_PATH
): string {
  if (candidate === null || candidate === undefined) {
    return fallback;
  }

  const trimmed = candidate.trim();
  if (trimmed.length === 0) {
    return fallback;
  }

  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  if (trimmed.startsWith("//")) {
    return fallback;
  }

  if (trimmed.includes("\\") || trimmed.includes("@")) {
    return fallback;
  }

  return trimmed;
}

export { DEFAULT_SAFE_INTERNAL_PATH };
